import { clamp, EventMouse, Touch, EventTouch, geometry, SystemEvent, systemEvent, toRadian, Vec2, Vec3, sys, view } from "cc";
import { EPSILON, quarticDamp, SmoothDamper, Spherical, Vec3_closeTo, Vec3_setFromMatrixColumn, Vec3_setFromSpherical } from "../Common/Math";
import { BaseFlag } from "../Datas/Base";
import { IVCam } from "../Datas/IVCam";
import { CameraHandler } from "./CameraHandler";

const { abs, tan } = Math;

enum Flag {
    None = 0,
    RotateZoom = BaseFlag.Custom << 0,
    Pan = BaseFlag.Custom << 1,
}

let __worldPos = new Vec3();
let __posDelta = new Vec3();
let __moveDelta = new Vec2();
let __xAxis = new Vec3();
let __yAxis = new Vec3();
let __loc0 = new Vec2();
let __loc1 = new Vec2();
let __preLoc0 = new Vec2();
let __preLoc1 = new Vec2();

export class FreeLookHandler extends CameraHandler<IVCam> {
    private _button: number = -1;
    private _rotateDelta: Vec2 = new Vec2();
    private _panDelta: Vec2 = new Vec2();
    private _panDeltaPrevious: Vec2 = new Vec2();
    private _panFrame: number = 0;
    private _panEnable: number = 1;
    private _distanceScale: number = 1;
    private _spherical: Spherical = new Spherical();
    private _smoothDamper: SmoothDamper = new SmoothDamper();

    public onEnable() {
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this._onMouseDown, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this._onMouseUp, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL, this._onMouseWheel, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this._onMouseMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this._onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    public onDisable() {
        systemEvent.off(SystemEvent.EventType.MOUSE_DOWN, this._onMouseDown, this);
        systemEvent.off(SystemEvent.EventType.MOUSE_UP, this._onMouseUp, this);
        systemEvent.off(SystemEvent.EventType.MOUSE_WHEEL, this._onMouseWheel, this);
        systemEvent.off(SystemEvent.EventType.MOUSE_MOVE, this._onMouseMove, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this._onTouchMove, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private _getPreviousLocation(e: EventTouch | EventMouse | Touch, out: Vec2) {
        return e.getPreviousLocation(out);
    }

    private _getLocation(e: EventTouch | EventMouse | Touch, out: Vec2) {
        return e.getLocation(out);
    }

    private _onTouchMove(t: Touch, e: EventTouch) {
        if (!sys.isMobile) return;

        let touchs = e.getAllTouches();
        if (touchs.length === 1) {
            this._rotateDelta.add(this._calculateRotateDelta(__moveDelta, this._getPreviousLocation(e, __loc0), this._getLocation(e, __loc1)));
            this._objFlag |= Flag.RotateZoom;
        }
        else if (touchs.length > 1) {
            this._getPreviousLocation(touchs[0], __preLoc0);
            this._getPreviousLocation(touchs[1], __preLoc1);
            this._getLocation(touchs[0], __loc0);
            this._getLocation(touchs[1], __loc1);

            this._distanceScale *= this._calculateDistanceScale(Vec2.distance(__preLoc0, __preLoc1) / Vec2.distance(__loc0, __loc1));
            this._objFlag |= Flag.RotateZoom;

            __preLoc0.add(__preLoc1).multiplyScalar(0.5);
            __loc0.add(__loc1).multiplyScalar(0.5);
            this._setPanDelta(this._calculatePanDelta(__moveDelta, __preLoc0, __loc0));
        }
    }

    private _onTouchEnd(t: Touch, e: EventTouch) {
        if (this._panFrame <= 5) {
            this._panEnable = 1;
            this._panDelta.set(this._panDeltaPrevious);
            this._objFlag |= Flag.Pan;
        }
    }

    private _onMouseDown(e: EventMouse) {
        this._button = e.getButton();
    }

    private _onMouseUp(e: EventMouse) {
        this._button = -1;
    }

    private _onMouseWheel(e: EventMouse) {
        if (e.getScrollY() > 0) {
            this._distanceScale *= this._calculateDistanceScale(0.95);
            this._objFlag |= Flag.RotateZoom;
        }
        else if (e.getScrollY() < 0) {
            this._distanceScale *= this._calculateDistanceScale(1 / 0.95);
            this._objFlag |= Flag.RotateZoom;
        }
    }

    private _onMouseMove(e: EventMouse) {
        switch (this._button) {
            case EventMouse.BUTTON_LEFT:
                this._rotateDelta.add(this._calculateRotateDelta(__moveDelta, this._getPreviousLocation(e, __loc0), this._getLocation(e, __loc1)));
                this._objFlag |= Flag.RotateZoom;
                break;
            case EventMouse.BUTTON_MIDDLE:
                this._setPanDelta(this._calculatePanDelta(__moveDelta, this._getPreviousLocation(e, __loc0), this._getLocation(e, __loc1)));
                break;
        }
    }

    private _setPanDelta(delta: Vec2) {
        if (this._objFlag & Flag.Pan || abs(delta.x) + abs(delta.y) > EPSILON) {
            this._objFlag |= Flag.Pan;
            this._panFrame = 0;
            this._panEnable = 0;
            this._panDelta.add(delta);
            this._panDeltaPrevious.set(this._panDelta);
        }
    }

    private _calculateDistanceScale(scale: number) {
        return scale;
    }

    private _calculateRotateDelta(out: Vec2, loc0: Vec2, loc1: Vec2) {
        let freelook = this._vcam.body.freelook;
        Vec2.subtract(out, loc1, loc0).multiplyScalar(freelook.rotateSpeed * 0.1 * Math.PI / view.getVisibleSizeInPixel().height);
        return out;
    }

    private _calculatePanDelta(out: Vec2, loc0: Vec2, loc1: Vec2) {
        let freelook = this._vcam.body.freelook;
        Vec2.subtract(out, loc1, loc0).multiplyScalar(freelook.panSpeed / view.getVisibleSizeInPixel().height);
        return out;
    }

    public updateCamera(deltaTime: number) {
        let vcam = this._vcam;
        let freelook = vcam.body.freelook;
        let followChanged = 0;
        let rotateZoomChanged = 0;

        if (freelook.forbidX) {
            this._rotateDelta.x = 0;
            rotateZoomChanged++;
        }
        if (freelook.forbidY) {
            this._rotateDelta.y = 0;
            rotateZoomChanged++;
        }
        if (freelook.forbidZ) {
            this._distanceScale = 1;
            rotateZoomChanged++;
        }
        if (rotateZoomChanged >= 3) {
            this._objFlag &= ~Flag.RotateZoom;
        }
        if (freelook.forbidPan) {
            this._panDelta.set(0, 0);
            this._objFlag &= ~Flag.Pan;
        }

        if (vcam.lookAt) {
            let composer = vcam.aim.composer;
            Vec3.add(__worldPos, vcam.lookAt.worldPosition, composer.trackedObjectOffset);

            if (this._objFlag & Flag.RotateZoom) {
                Vec3.subtract(__posDelta, vcam.node.worldPosition, __worldPos);

                let length = __posDelta.length() * 2 * tan(toRadian(vcam.lens.fov * 0.5));
                let x = this._rotateDelta.x * length;
                let y = this._rotateDelta.y * length;

                this._spherical.setFromVec3(__posDelta);
                this._spherical.theta = this._spherical.theta - x;
                this._spherical.phi = clamp(this._spherical.phi + y, EPSILON, Math.PI - EPSILON);
                this._spherical.radius = this._spherical.radius * this._distanceScale;

                Vec3_setFromSpherical(__posDelta, this._spherical);
                vcam.node.worldPosition = __posDelta.add(__worldPos);

                this._rotateDelta.multiplyScalar(quarticDamp(1, 0, freelook.rotateSmoothing, deltaTime));
                this._distanceScale = 1;

                if (abs(x) + abs(y) <= EPSILON) {
                    this._objFlag &= ~Flag.RotateZoom;
                }
                followChanged++;
            }
            if (this._objFlag & Flag.Pan) {
                Vec3.subtract(__posDelta, vcam.node.worldPosition, __worldPos);

                Vec3_setFromMatrixColumn(__xAxis, vcam.node.worldMatrix, 0);
                Vec3_setFromMatrixColumn(__yAxis, vcam.node.worldMatrix, 1);

                let length = __posDelta.length() * 2 * tan(toRadian(vcam.lens.fov * 0.5));
                let trackedObjectOffset = composer.trackedObjectOffset;
                trackedObjectOffset.subtract(__xAxis.multiplyScalar(this._panDelta.x * length));
                trackedObjectOffset.subtract(__yAxis.multiplyScalar(this._panDelta.y * length));

                Vec3.add(__worldPos, vcam.lookAt.worldPosition, trackedObjectOffset);
                vcam.node.worldPosition = __posDelta.add(__worldPos);
                this._panDelta.multiplyScalar(quarticDamp(1, 0, freelook.panSmoothing, deltaTime) * this._panEnable);

                if (abs(this._panDelta.x) + abs(this._panDelta.y) <= EPSILON) {
                    this._objFlag &= ~Flag.Pan;
                }
                followChanged++;
            }
            if (this._panFrame < 10) {
                this._panFrame++;
            }
        }
        if (vcam.follow) {
            if (followChanged > 0) {
                Vec3.subtract(freelook.followOffset, vcam.node.worldPosition, vcam.follow.worldPosition);
            }
            Vec3.add(__posDelta, vcam.follow.worldPosition, freelook.followOffset);
            if (freelook.followDamping > 0) {
                this._smoothDamper.Vec3_smoothDamp(__worldPos, vcam.node.worldPosition, __posDelta, freelook.followDamping, deltaTime);
            }
            else {
                __worldPos.set(__posDelta);
            }
            if (!Vec3_closeTo(__worldPos, vcam.node.worldPosition)) {
                vcam.node.worldPosition = __worldPos;
            }
        }
    }
}