import { clamp, clamp01, IQuatLike, IVec3Like, IVec4Like, Mat4, Quat, Vec2, Vec3, Vec4 } from "cc";

const { sqrt, atan2, acos, sin, cos, floor, min, abs } = Math;

Quat.lerp = function <Out extends IQuatLike>(out: Out, a: Out, b: Out, t: number) {
    if (Quat.dot(a, b) < 0) {
        Quat.set(b, -b.x, -b.y, -b.z, -b.w);
    }
    t = clamp01(t);
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    out.w = a.w + t * (b.w - a.w);
    Quat.normalize(out, out);
    return out;
}

Quat.prototype.lerp = function (b: Quat, t: number) {
    return Quat.lerp(this, this, b, t);
}

export const EPSILON = 0.0001;

let v3_1 = new Vec3();
let v3_2 = new Vec3();

export function closeTo(a: number, b: number) {
    return abs(a - b) <= EPSILON;
}

export function Vec4_closeTo(a: IVec4Like, b: IVec4Like) {
    return abs(a.x - b.x) + abs(a.y - b.y) + abs(a.z - b.z) + abs(a.w - b.w) <= EPSILON;
}

export function Vec3_closeTo(a: IVec3Like, b: IVec3Like) {
    return abs(a.x - b.x) + abs(a.y - b.y) + abs(a.z - b.z) <= EPSILON;
}

export function Vec3_closestPointOnSegment(p: Vec3, s0: Vec3, s1: Vec3) {
    let s = Vec3.subtract(v3_1, s1, s0);
    let dd = Vec3.lengthSqr(s);
    if (dd < EPSILON) {
        return 0;
    }
    return clamp01(Vec3.dot(Vec3.subtract(v3_2, p, s0), s) / dd); //use sqrt(dd)?
}

export function Vec3_setFromSpherical(out: IVec3Like, s: Spherical) {
    const { radius, phi, theta } = s;
    let sinPhiRadius = sin(phi) * radius;
    out.x = sinPhiRadius * sin(theta);
    out.y = cos(phi) * radius;
    out.z = sinPhiRadius * cos(theta);
    return out;
}

export function Vec3_setFromMatrixColumn(out: IVec3Like, m: Mat4, col: number) {
    switch (col) {
        case 0:
            out.x = m.m00;
            out.y = m.m01;
            out.z = m.m02;
            break;
        case 1:
            out.x = m.m04;
            out.y = m.m05;
            out.z = m.m06;
            break;
        case 2:
            out.x = m.m08;
            out.y = m.m09;
            out.z = m.m10;
            break;
    }
    return out;
}

const kNegligibleResidual = 0.01;
const kLogNegligibleResidual = Math.log(kNegligibleResidual)// -4.605170186;

export function exponentialDamp(current: number, target: number, dampTime: number, deltaTime: number) {
    let k = -kLogNegligibleResidual / dampTime;
    return current + (target - current) * (1 - Math.exp(-k * deltaTime));
}

export function quarticDamp(current: number, target: number, dampTime: number, deltaTime: number) { // cuve like exponentialDecay but cost less
    let t = (1 - min(deltaTime, dampTime) / dampTime);
    let tt = t * t;
    return current + (target - current) * (1 - tt * tt);
}

export function Quat_exponentialDamp(out: Quat, current: Quat, target: Quat, dampTime: number, deltaTime: number) {
    return Quat.lerp(out, current, target, exponentialDamp(0, 1, dampTime, deltaTime));
}

export function Quat_quarticDamp(out: Quat, current: Quat, target: Quat, dampTime: number, deltaTime: number) {
    return Quat.lerp(out, current, target, quarticDamp(0, 1, dampTime, deltaTime));
}

export class SmoothDamper {
    private _velocity: number = 0;

    public smoothDamp(current: number, target: number, smoothTime: number, maxSpeed: number, deltaTime: number) {
        smoothTime = Math.max(0.0001, smoothTime);
        let num = 2 / smoothTime;
        let num2 = num * deltaTime;
        let num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
        let num4 = current - target;
        let num5 = target;
        let num6 = maxSpeed * smoothTime;
        num4 = clamp(num4, -num6, num6);
        target = current - num4;
        let num7 = (this._velocity + num * num4) * deltaTime;
        this._velocity = (this._velocity - num * num7) * num3;
        let num8 = target + (num4 + num7) * num3;
        if (num5 - current > 0 == num8 > num5) {
            num8 = num5;
            this._velocity = (num8 - num5) / deltaTime;
        }
        return num8;
    }

    public Quat_smoothDamp(out: Quat, current: Quat, target: Quat, dampTime: number, deltaTime: number) {
        return Quat.lerp(out, current, target, this.smoothDamp(0, 1, dampTime, Infinity, deltaTime));
    }

    public Vec3_smoothDamp(out: Vec3, current: Vec3, target: Vec3, dampTime: number, deltaTime: number) {
        return Vec3.lerp(out, current, target, this.smoothDamp(0, 1, dampTime, Infinity, deltaTime));
    }
}

export class Spherical {
    public radius: number;
    public phi: number; //垂直旋转角度
    public theta: number; //水平旋转角度

    constructor(radius: number = 1, phi: number = 0, theta: number = 0) {
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;
    }

    public setFromVec3(v: Vec3) {
        return this.setFromCartesianCoords(v.x, v.y, v.z);
    }

    public setFromCartesianCoords(x: number, y: number, z: number) {
        this.radius = sqrt(x * x + y * y + z * z);
        if (this.radius === 0) {
            this.theta = 0;
            this.phi = 0;
        } else {
            this.theta = atan2(x, z);
            this.phi = acos(clamp(y / this.radius, - 1, 1));
        }
        return this;
    }
}

// Copyright (C) 2016 Keijiro Takahashi
// https://mrl.cs.nyu.edu/~perlin/noise/
export class Perlin {
    public static Noise(x: number): number;
    public static Noise(x: number, y: number): number;
    public static Noise(x: number, y: number, z: number): number;
    public static Noise(x: number, y?: number, z?: number) {
        let fade = Perlin._Fade;
        let grad = Perlin._Grad;
        let lerp = Perlin._Lerp;
        let p = Perlin._Permutation;

        if (y !== undefined && z !== undefined) {
            let xi = floor(x);
            let yi = floor(y);
            let zi = floor(z);
            let X = xi & 0xff;                                   // FIND UNIT CUBE THAT
            let Y = yi & 0xff;                                   // CONTAINS POINT.
            let Z = zi & 0xff;
            x -= xi;                                             // FIND RELATIVE X,Y,Z
            y -= yi;                                             // OF POINT IN CUBE.
            z -= zi;
            let u = fade(x);                                     // COMPUTE FADE CURVES
            let v = fade(y);                                     // FOR EACH OF X,Y,Z.
            let w = fade(z);
            let A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z;  // HASH COORDINATES OF
            let B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;  // THE 8 CUBE CORNERS,

            return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),      // AND ADD
                grad(p[BA], x - 1, y, z)),     // BLENDED
                lerp(u, grad(p[AB], x, y - 1, z),      // RESULTS
                    grad(p[BB], x - 1, y - 1, z))),    // FROM  8
                lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),      // CORNERS
                    grad(p[BA + 1], x - 1, y, z - 1)),     // OF CUBE
                    lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
                        grad(p[BB + 1], x - 1, y - 1, z - 1))));
        }
        else if (y !== undefined) {
            let xi = floor(x);
            let yi = floor(y);
            let X = xi & 0xff;
            let Y = yi & 0xff;
            x -= xi;
            y -= yi;
            let u = fade(x);
            let v = fade(y);
            let A = (p[X] + Y) & 0xff;
            let B = (p[X + 1] + Y) & 0xff;
            return lerp(v, lerp(u, grad(p[A], x, y),
                grad(p[B], x - 1, y)),
                lerp(u, grad(p[A + 1], x, y - 1),
                    grad(p[B + 1], x - 1, y - 1)));
        }
        else {
            let xi = floor(x);
            let X = xi & 0xff;
            x -= xi;
            let u = fade(x);
            return lerp(u, grad(p[X], x),
                grad(p[X + 1], x - 1));
        }
    }

    public static Fbm(octave: number, x: number): number;
    public static Fbm(octave: number, x: number, y: number): number;
    public static Fbm(octave: number, x: number, y: number, z: number): number;
    public static Fbm(octave: number, x: number, y?: number, z?: number) {
        let f = 0;
        let w = 0.5;
        let noise = Perlin.Noise;
        if (y !== undefined && z !== undefined) {
            for (let i = 0; i < octave; i++) {
                f += w * noise(x, y, z);
                x *= 2.0;
                y *= 2.0;
                z *= 2.0;
                w *= 0.5;
            }
        }
        else if (y !== undefined) {
            for (let i = 0; i < octave; i++) {
                f += w * noise(x, y);
                x *= 2.0;
                y *= 2.0;
                w *= 0.5;
            }
        }
        else {
            for (let i = 0; i < octave; i++) {
                f += w * noise(x);
                x *= 2.0;
                w *= 0.5;
            }
        }
        return f;
    }

    private static _Fade(t: number) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private static _Lerp(t: number, a: number, b: number) {
        return a + t * (b - a);
    }

    private static _Grad(hash: number, x: number): number;
    private static _Grad(hash: number, x: number, y: number): number;
    private static _Grad(hash: number, x: number, y: number, z: number): number
    private static _Grad(hash: number, x: number, y?: number, z?: number) {
        if (y !== undefined && z !== undefined) {
            let h = hash & 15;                     // CONVERT LO 4 BITS OF HASH CODE
            let u = h < 8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
                v = h < 4 ? y : (h == 12 || h == 14 ? x : z);
            return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
        }
        else if (y !== undefined) {
            return ((hash & 1) == 0 ? x : -x) + ((hash & 2) == 0 ? y : -y);
        }
        else {
            return (hash & 1) == 0 ? x : -x;
        }
    }

    private static _Permutation = [
        151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
        151
    ]
}

export class Spline {

    /**
     * Compute the tangent of a 4-point 1-dimensional bezier spline
     * @param out 
     * @param t  How far along the spline (0...1)
     * @param p0 First point
     * @param p1 First tangent
     * @param p2 Second point
     * @param p3 Second tangent
     * @returns 
     */
    public static Bezier3(out: Vec3, t: number, p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3) {
        t = clamp01(t);
        let d = 1 - t;
        let k0 = d * d * d;
        let k1 = 3 * d * d * t;
        let k2 = 3 * d * t * t;
        let k3 = t * t * t;

        return out.set(
            k0 * p0.x + k1 * p1.x + k2 * p2.x + k3 * p3.x,
            k0 * p0.y + k1 * p1.y + k2 * p2.y + k3 * p3.y,
            k0 * p0.z + k1 * p1.z + k2 * p2.z + k3 * p3.z,
        )
    }

    // Use the Thomas algorithm to compute smooth tangent values for a spline.  
    // Resultant tangents guarantee second-order smoothness of the curve.
    public static ComputeSmoothControlPoints(knot: Vec4[], ctrl1: Vec4[], ctrl2: Vec4[]) {
        let numPoints = knot.length;
        if (numPoints <= 2) {
            if (numPoints == 2) {
                Vec4.lerp(ctrl1[0], knot[0], knot[1], 0.33333);
                Vec4.lerp(ctrl2[0], knot[0], knot[1], 0.66666);
            }
            else if (numPoints == 1) {
                ctrl1[0] = ctrl2[0] = knot[0];
            }
            return;
        }

        let a = new Array(numPoints);
        let b = new Array(numPoints);
        let c = new Array(numPoints);
        let r = new Array(numPoints);
        let knot_any: any = knot;
        let ctrl1_any: any = ctrl1;
        let ctrl2_any: any = ctrl2;
        let axis_list = ["x", "y", "z", "w"];

        for (let k = 0; k < 4; ++k) {
            let axis = axis_list[k];
            let n = numPoints - 1;

            // Linear into the first segment
            a[0] = 0;
            b[0] = 2;
            c[0] = 1;
            r[0] = knot_any[0][axis] + 2 * knot_any[1][axis];

            // Internal segments
            for (let i = 1; i < n - 1; ++i) {
                a[i] = 1;
                b[i] = 4;
                c[i] = 1;
                r[i] = 4 * knot_any[i][axis] + 2 * knot_any[i + 1][axis];
            }

            // Linear out of the last segment
            a[n - 1] = 2;
            b[n - 1] = 7;
            c[n - 1] = 0;
            r[n - 1] = 8 * knot_any[n - 1][axis] + knot_any[n][axis];

            // Solve with Thomas algorithm
            for (let i = 1; i < n; ++i) {
                let m = a[i] / b[i - 1];
                b[i] = b[i] - m * c[i - 1];
                r[i] = r[i] - m * r[i - 1];
            }

            // Compute ctrl1
            ctrl1_any[n - 1][axis] = r[n - 1] / b[n - 1];
            for (let i = n - 2; i >= 0; --i) {
                ctrl1_any[i][axis] = (r[i] - c[i] * ctrl1_any[i + 1][axis]) / b[i];
            }

            // Compute ctrl2 from ctrl1
            for (let i = 0; i < n; i++) {
                ctrl2_any[i][axis] = 2 * knot_any[i + 1][axis] - ctrl1_any[i + 1][axis];
            }

            ctrl2_any[n - 1][axis] = 0.5 * (knot_any[n][axis] + ctrl1_any[n - 1][axis]);
        }
    }


    public static ComputeSmoothControlPointsLooped(knot: Vec4[], ctrl1: Vec4[], ctrl2: Vec4[]) {
        let numPoints = knot.length;
        if (numPoints < 2) {
            if (numPoints == 1)
                ctrl1[0] = ctrl2[0] = knot[0];
            return;
        }

        let margin = Math.min(4, numPoints - 1);
        let length = numPoints + 2 * margin;
        let knotLooped: Vec4[] = new Array<Vec4>(length);
        let ctrl1Looped: Vec4[] = new Array<Vec4>(length);
        let ctrl2Looped: Vec4[] = new Array<Vec4>(length);

        for (let i = 0; i < margin; ++i) {
            knotLooped[i] = knot[numPoints - (margin - i)];
            knotLooped[numPoints + margin + i] = knot[i];
        }

        for (let i = 0; i < numPoints; ++i) {
            knotLooped[i + margin] = knot[i];
        }

        for (let i = 0; i < length; ++i) {
            ctrl1Looped[i] = new Vec4();
            ctrl2Looped[i] = new Vec4();
        }

        Spline.ComputeSmoothControlPoints(knotLooped, ctrl1Looped, ctrl2Looped);

        for (let i = 0; i < numPoints; ++i) {
            ctrl1[i] = ctrl1Looped[i + margin];
            ctrl2[i] = ctrl2Looped[i + margin];
        }
    }
}