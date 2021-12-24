import { Vec3 } from "cc";
import { SmoothDamper } from "./Common/Math";
import { Nullable } from "./Common/Types";

let __delta = new Vec3();
export class Predictor {
    private _prePos: Nullable<Vec3> = null;
    private _velocity: Vec3 = new Vec3();
    private _dampingVelocity: Vec3 = new Vec3();
    private _smoothDamper: SmoothDamper = new SmoothDamper();

    public predictPosition(out: Vec3, wpos: Vec3, lookaheadDamping: number, lookaheadTime: number, deltaTime: number) {
        if (this._prePos === null) {
            this._prePos = new Vec3(wpos);
            out.set(wpos);
        }
        else {
            Vec3.subtract(this._velocity, wpos, this._prePos).multiplyScalar(1 / deltaTime);
            this._smoothDamper.Vec3_smoothDamp(this._dampingVelocity, this._dampingVelocity, this._velocity, lookaheadDamping, deltaTime);
            this._prePos.set(wpos);

            Vec3.multiplyScalar(__delta, this._dampingVelocity, lookaheadTime);
            Vec3.add(out, wpos, __delta);
        }
        return out;
    }
}