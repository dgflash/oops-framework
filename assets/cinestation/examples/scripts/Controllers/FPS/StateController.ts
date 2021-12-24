
import { _decorator, Component, Node, Animation, AudioSource, AudioClip, randomRangeInt, game } from 'cc';
import { Nullable } from '../../../../runtime/Common/Types';
const { ccclass, property } = _decorator;

@ccclass('StateController')
export class StateController extends Component {
    public static readonly AIM_IN = "Armature|aim_in";
    public static readonly AIM_OUT = "Armature|aim_out";
    public static readonly AIM_FIRE = "Armature|aim_fire";
    public static readonly AIM_FIRE_POSE = "Armature|aim_fire_pose";
    public static readonly IDLE = "Armature|idle";
    public static readonly WALK = "Armature|walk";
    public static readonly FIRE = "Armature|fire";
    public static readonly RELOAD_OUTOF_AMMO = "Armature|reload_out_of_ammo";

    @property(AudioClip)
    shootSound: Nullable<AudioClip> = null;

    @property(AudioClip)
    walkSound: Nullable<AudioClip> = null;

    @property(AudioClip)
    aimInSound: Nullable<AudioClip> = null;

    @property(AudioClip)
    reloadSound: Nullable<AudioClip> = null;

    @property([AudioClip])
    casingSounds: AudioClip[] = [];

    private _state: string = StateController.IDLE;
    private _values: { [k: string]: any } = {};
    private _animFinshed: boolean = false;
    private _animation: Nullable<Animation> = null;
    private _audioSource: Nullable<AudioSource> = null;

    public onLoad() {
        this._animation = this.getComponent(Animation);
        this._animation?.on(Animation.EventType.FINISHED, () => {
            this._animFinshed = true;
        })
        this._audioSource = this.getComponent(AudioSource);
        game.on("__playCasingSound", this._onPlayCasing, this);
    }

    public onDestroy() {
        game.off("__playCasingSound", this._onPlayCasing, this);
    }

    private _onPlayCasing() {
        if (this._audioSource) {
            let index = randomRangeInt(0, this.casingSounds.length - 1);
            this._audioSource.playOneShot(this.casingSounds[index]);
        }
    }

    public getState() {
        return this._state;
    }

    public setState(state: string, force: boolean = false, duration?: number) {
        if (this._state !== state || force) {
            this._state = state;
            if (this._animation) {
                this._animation.crossFade(state, duration);
                this._animFinshed = false;
            }
            if (this._audioSource) {
                switch (state) {
                    case StateController.WALK:
                        this._audioSource.clip = this.walkSound;
                        this._audioSource.loop = true;
                        this._audioSource.play();
                        break;
                    case StateController.IDLE:
                        this._audioSource.stop();
                        break;
                    case StateController.AIM_FIRE:
                    case StateController.FIRE:
                        this.shootSound && this._audioSource.playOneShot(this.shootSound);
                        break;
                    case StateController.AIM_IN:
                        this.aimInSound && this._audioSource.playOneShot(this.aimInSound);
                        break;
                    case StateController.RELOAD_OUTOF_AMMO:
                        this.reloadSound && this._audioSource.playOneShot(this.reloadSound);
                        break;
                }
            }
        }
    }

    public getValue(k: string) {
        return this._values[k];
    }

    public setValue(k: string, v: any) {
        this._values[k] = v;
    }

    public update() {
        let state = this._state;
        let values = this._values;
        switch (state) {
            case StateController.IDLE:
                if (values.mouseLeft) {
                    state = StateController.FIRE;
                }
                else if (values.mouseRight) {
                    state = StateController.AIM_IN;
                }
                else if (values.moveSpeed > 0.2) {
                    state = StateController.WALK;
                }
                break;
            case StateController.WALK:
                if (values.mouseRight) {
                    state = StateController.AIM_IN;
                }
                else if (values.moveSpeed <= 0.2) {
                    state = StateController.IDLE;
                }
                break;
            case StateController.AIM_IN:
                if (!values.mouseRight) {
                    state = StateController.AIM_OUT;
                }
                else if (values.mouseLeft) {
                    state = StateController.AIM_FIRE;
                }
                break;
            case StateController.AIM_OUT:
                if (values.moveSpeed > 0.2) {
                    state = StateController.WALK;
                }
                else {
                    state = StateController.IDLE;
                }
                break;
            case StateController.FIRE:
                if (!values.mouseLeft) {
                    state = StateController.IDLE;
                }
                break;
            case StateController.AIM_FIRE:
                if (!values.mouseLeft) {
                    if (values.mouseRight) {
                        state = StateController.AIM_FIRE_POSE;
                    }
                    else {
                        state = StateController.IDLE;
                    }
                }
                break;
            case StateController.AIM_FIRE_POSE:
                if (!values.mouseRight) {
                    state = StateController.AIM_OUT;
                }
                break;
            case StateController.RELOAD_OUTOF_AMMO:
                if (this._animFinshed) {
                    state = StateController.IDLE;
                }
                break;
        }
        this.setState(state);
    }
}