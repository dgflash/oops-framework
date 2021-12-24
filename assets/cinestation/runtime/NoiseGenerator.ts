import { lerp, Quat, Vec3 } from "cc";
import { Perlin } from "./Common/Math";
import { IVCam } from "./Datas/IVCam";
import { VCamNoise } from "./Datas/VCamNoise";

const { cos, PI } = Math;
const PI2 = 2 * PI;

const Noise_CM_4: number[][] = [
    [0.1, 7, 0, 0.75, 3, 0, 1.2, 1, 0],
    [0.15, 4, 0, 0.8, 1, 0, 1.4, 0.8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const Shake_6D: number[][] = [
    [5.83, 0.09, 1, 9.17, 0.14, 1, 57.17, 0.15, 1],      //rotX
    [1.8, 0.059, 1, 11.35, 0.041, 1, 54.17, 0.048, 1],   //rotY
    [2.38, 0.017, 1, 10.52, 0.009, 1, 63.76, 0.016, 1],  //rotZ
    [3.2, 0.011, 1, 7.7, 0.009, 1, 51.51, 0.002, 1],     //posX
    [1.9, 0.059, 1, 9.1, 0.04, 0, 55.54, 0.05, 1],       //posY
    [3.33, 0.021, 1, 9.22, 0.009, 1, 58.55, 0.017, 1],   //posZ
]

const Handheld_normal_extreme: number[][] = [
    [0.2, 15, 0, 0.9, 5, 0, 2, 2, 0],
    [0.25, 7, 0, 1, 3, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const Handheld_normal_mild: number[][] = [
    [0.15, 7, 0, 0.8, 4, 0, 1.2, 1, 0],
    [0.1, 5, 0, 0.75, 2, 0, 1.5, 0.8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const Handheld_normal_strong: number[][] = [
    [0.4, 10, 0, 1.44, 5, 0, 2.49, 3, 0],
    [0.06, 10, 0, 0.73, 3, 0, 2, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const Handheld_tele_mild: number[][] = [
    [0.2, 4, 0, 0.4, 2, 0, 0.7, 1, 0],
    [0.15, 2, 0, 0.5, 2, 0, 0.6, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const Handheld_tele_strong: number[][] = [
    [0.39, 6.19, 0, 1.75, 1.84, 0, 2, 2.3, 0],
    [0.15, 3, 0, 0.9, 0.5, 0, 1.4, 0.5, 0],
    [0.1, 1, 0, 0, 0, 0, 0, 0, 0]
]

const Handheld_wideangle_mild: number[][] = [
    [0.15, 12, 0, 0.6, 5, 0, 1.5, 1, 0],
    [0.1, 5, 0, 0.45, 4, 0, 1.2, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const Handheld_wideangle_strong: number[][] = [
    [0.5, 17.46, 0, 0.94, 12.47, 0, 1.2, 4, 0],
    [0.25, 5, 0, 0.5, 4, 0, 1.3, 2, 0],
    [0.1, 0, 0, 0.4, 1, 0, 0, 0, 0]
]

const Profiles = [
    Noise_CM_4,
    Shake_6D,
    Handheld_normal_extreme,
    Handheld_normal_mild,
    Handheld_normal_strong,
    Handheld_tele_mild,
    Handheld_tele_strong,
    Handheld_wideangle_mild,
    Handheld_wideangle_strong
]

export enum NoiseProfile {
    Noise_CM_4,
    Shake_6D,
    Handheld_normal_extreme,
    Handheld_normal_mild,
    Handheld_normal_strong,
    Handheld_tele_mild,
    Handheld_tele_strong,
    Handheld_wideangle_mild,
    Handheld_wideangle_strong
}


let __rotation = new Quat();
let __position = new Vec3();

export class NoiseGenerator {
    private _time: number = 0;
    private _values: number[] = [0, 0, 0, 0, 0, 0];
    private _noiseOffsets: number[] = [0, 0, 0];

    public reset() {
        this._time = 0;
        this._noiseOffsets.forEach((v, i) => this._noiseOffsets[i] = lerp(-1000, 1000, Math.random()));
    }

    public fractalNoise(noise: VCamNoise, deltaTime: number) {
        let t = this._time += deltaTime * noise.frequncyGain;
        let coeffs = Profiles[noise.profile] || Profiles[0];
        let values = this._values.fill(0);
        let noiseOffsets = this._noiseOffsets;
        for (let i = 0; i < coeffs.length; i++) {
            let coeff = coeffs[i];
            values[i] =
                NoiseGenerator.Noise(t, coeff[0], coeff[1], coeff[2], noiseOffsets[0]) +
                NoiseGenerator.Noise(t, coeff[3], coeff[4], coeff[5], noiseOffsets[1]) +
                NoiseGenerator.Noise(t, coeff[6], coeff[7], coeff[8], noiseOffsets[2]);
            values[i] *= noise.amplitudeGain;
        }
        return values;
    }

    public static Noise(t: number, frequency: number, amplitude: number, constant: number, offset: number = 0) {
        if (constant) {
            return cos(PI2 * t * frequency + offset) * 0.5 * amplitude;
        }
        return Perlin.Noise(t * frequency + offset) * amplitude;
    }

    public static ApplyNoise(values: number[], vcam: IVCam) {
        Quat.fromEuler(__rotation, values[0], values[1], values[2]);
        Vec3.set(__position, values[3], values[4], values[5]);
        Vec3.transformQuat(__position, __position, vcam.node.worldRotation);
        Quat.multiply(vcam.correctRotation, vcam.correctRotation, __rotation);
        Vec3.add(vcam.correctPosition, vcam.correctPosition, __position);
    }
}