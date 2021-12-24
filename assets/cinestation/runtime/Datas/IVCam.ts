import { Quat, Vec3, Node } from "cc";
import { Nullable } from "../Common/Types";
import { VCamAim } from "./VCamAim";
import { VCamBody } from "./VCamBody";
import { VCamImpulse } from "./VCamImpulse";
import { VCamLens } from "./VCamLens";
import { VCamNoise } from "./VCamNoise";

export interface IVCam {
    node: Node;
    lookAt: Nullable<Node>;
    follow: Nullable<Node>;
    lens: VCamLens;
    body: VCamBody;
    aim: VCamAim;
    noise: VCamNoise;
    impulse: VCamImpulse;
    correctPosition: Vec3;
    correctRotation: Quat;
    lookaheadPosition: Vec3;
}
