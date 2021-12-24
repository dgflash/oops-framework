
import { _decorator, Component, Node, Vec3, Mesh, Vec4, Vec2, utils, clamp, Color, primitives, renderer } from 'cc';
import { Spline, Vec3_closestPointOnSegment } from './Common/Math';
import { Visualization } from './Common/Visualization';
const { ccclass, property, executeInEditMode } = _decorator;

let __v0 = new Vec3();
let __v1 = new Vec3();
let __dis = new Vec3();
let __indices = new Vec2();

@ccclass('CinestationSmoothPath')
@executeInEditMode
export class CinestationSmoothPath extends Visualization {

    @property({ visible: false })
    private _looped: boolean = false;

    @property({ visible: false })
    private _localControlPoints1: Vec3[] = [];

    @property({ visible: false })
    private _localControlPoints2: Vec3[] = [];

    @property
    get looped() {
        return this._looped;
    }
    set looped(v: boolean) {
        if (this._looped !== v) {
            this._looped = v;
            this._modelChanged = true;
        }
    }

    private get _minProgress() {
        return 0;
    }

    private get _maxProgress() {
        let count = this.node.children.length - 1;
        if (count < 1) return 0;
        return this.looped ? count + 1 : count;
    }

    public onLoad() {
        if (CC_EDITOR) {
            this.node.on(Node.EventType.CHILD_ADDED, this._onChildAdded, this);
            this.node.on(Node.EventType.CHILD_REMOVED, this._onNodeChanged, this);
            for (let child of this.node.children) {
                this._onNodeChanged(child);
            }
        }
    }

    private _onChildAdded(node: Node) {
        let children = this.node.children;
        let length = children.length;
        if (length === 2) {
            node.position = new Vec3(children[0].position).add3f(0, 0, 5);
        }
        else if (length > 2) {
            let p0 = children[length - 3].position;
            let p1 = children[length - 2].position;
            let offset = new Vec3(p1).subtract(p0).normalize().multiplyScalar(5);
            node.position = offset.add(p1);
        }
        this._onNodeChanged(node);
    }

    private _onNodeChanged(node: Node) {
        node.on(Node.EventType.TRANSFORM_CHANGED, () => {
            this._modelChanged = true;
        })
        this._modelChanged = true;
    }

    private _updateControlPoints() {
        let children = this.node.children;
        let numPoints = children.length;
        if (numPoints > 1) {
            let p1 = new Array<Vec4>(numPoints);
            let p2 = new Array<Vec4>(numPoints);
            let K = new Array<Vec4>(numPoints);
            for (let i = 0; i < numPoints; i++) {
                p1[i] = new Vec4();
                p2[i] = new Vec4();
                let p = children[i].position;
                K[i] = new Vec4(p.x, p.y, p.z, 0);
            }

            if (this.looped) {
                Spline.ComputeSmoothControlPointsLooped(K, p1, p2);
            }
            else {
                Spline.ComputeSmoothControlPoints(K, p1, p2);
            }

            this._localControlPoints1.length = numPoints;
            this._localControlPoints2.length = numPoints;

            for (let i = 0; i < numPoints; i++) {
                this._localControlPoints1[i] = new Vec3(p1[i].x, p1[i].y, p1[i].z);
                this._localControlPoints2[i] = new Vec3(p2[i].x, p2[i].y, p2[i].z);
            }
        }
    }

    private _getBoundingIndices(t: number, out: Vec2) {
        t = this._clampProgress(t);
        let children = this.node.children;
        let numWaypoints = children.length;
        if (numWaypoints < 2) {
            out.x = out.y = 0;
        }
        else {
            out.x = Math.floor(t);
            if (out.x >= numWaypoints) {
                // Only true if looped
                t -= this._maxProgress;
                out.x = 0;
            }
            out.y = out.x + 1;
            if (out.y == numWaypoints) {
                if (this.looped) {
                    out.y = 0;
                }
                else {
                    --out.y;
                    --out.x;
                }
            }
        }
        return t;
    }

    private _clampProgress(t: number) {
        let maxPos = this._maxProgress;
        if (this._looped && maxPos > 0) {
            t = t % maxPos;
            if (t < 0) {
                t += maxPos;
            }
            return t;
        }
        return clamp(t, 0, maxPos);
    }


    public evaluatePosition(out: Vec3, t: number) {
        return this.evaluateLocalPosition(out, t).add(this.node.worldPosition);
    }

    public evaluateLocalPosition(out: Vec3, t: number) {
        let children = this.node.children;
        if (children.length === 0) {
            return out.set(this.node.position);
        }
        let indices = __indices.set(0, 0);
        t = this._getBoundingIndices(t, indices);
        if (indices.x === indices.y) {
            return out.set(children[indices.x].position);
        }
        else {
            return Spline.Bezier3(out, t - indices.x, children[indices.x].position, this._localControlPoints1[indices.x], this._localControlPoints2[indices.x], children[indices.y].position)
        }
    }

    public findClosestPoint(p: Vec3, startSegment: number, searchRadius: number, stepPerSegment: number) {
        let start = this._minProgress, end = this._maxProgress;
        if (searchRadius >= 0) {
            let r = Math.floor(Math.min(searchRadius, Math.max(1, (end - start) / 2)));
            start = startSegment - r;
            end = startSegment + r + 1;
            if (!this.looped) {
                start = Math.max(start, this._minProgress);
                end = Math.min(end, this._maxProgress);
            }
        }
        let bestPos = startSegment, bestDistance = Infinity;
        let stepSize = 1 / clamp(stepPerSegment, 1, 100);
        let v0 = this.evaluatePosition(__v0, 0);
        for (let f = start + stepSize; f <= end; f += stepSize) {
            let v1 = this.evaluatePosition(__v1, f);
            let t = Vec3_closestPointOnSegment(p, v0, v1);
            let d = Vec3.squaredDistance(p, Vec3.lerp(__dis, v0, v1, t));
            if (d < bestDistance) {
                bestDistance = d;
                bestPos = f - (1 - t) * stepSize;
            }
            v0.set(v1);
        }
        return bestPos;
    }

    protected _updateMesh(mesh: Mesh) {
        this._updateControlPoints();
        let vertices: Vec3[] = [];
        let step = 1 / 10;
        let children = this.node.children;
        for (let t = 0; t < children.length; t += step) {
            vertices.push(this.evaluateLocalPosition(new Vec3(), t));
        }
        let positions: number[] = [], colors: number[] = [];
        let point0s = [], point1s = [];
        let greenColor = new Color(0, 1, 0, 1);
        let grayColor = new Color(0.3, 0.3, 0.3, 1);

        function linkPoints(p0: Vec3, p1: Vec3, col: Color) {
            if (!(p0 && p1)) return;
            Vec3.toArray(positions, p0, positions.length);
            Vec3.toArray(positions, p1, positions.length);
            colors.push(col.r, col.g, col.b, col.a);
            colors.push(col.r, col.g, col.b, col.a);
        }

        for (let i = 0; i + 1 < vertices.length; i++) {
            let p0 = vertices[i];
            let p1 = vertices[i + 1];
            let dir = new Vec3(p1).subtract(p0).normalize();
            let offset = new Vec3(dir.z, dir.y, -dir.x).multiplyScalar(0.1);
            if (i === 0) {
                point0s.push(new Vec3(p0).subtract(offset));
                point1s.push(new Vec3(p0).add(offset));
            }
            point0s.push(new Vec3(p1).subtract(offset));
            point1s.push(new Vec3(p1).add(offset));

            linkPoints(new Vec3(p0).subtract(offset), new Vec3(p0).add(offset), greenColor);
            linkPoints(p0, p1, grayColor);
        }
        if (this._looped) {
            linkPoints(vertices[vertices.length - 1], vertices[0], grayColor);
        }
        for (let i = 0; i + 1 < point0s.length; i++) {
            linkPoints(point0s[i], point0s[i + 1], greenColor);
        }
        if (this._looped) {
            linkPoints(point0s[point0s.length - 1], point0s[0], greenColor);
        }
        for (let i = 0; i + 1 < point1s.length; i++) {
            linkPoints(point1s[i], point1s[i + 1], greenColor);
        }
        if (this._looped) {
            linkPoints(point1s[point1s.length - 1], point1s[0], greenColor);
        }
        return utils.createMesh({ positions, colors }, mesh);
    }
}
