import { error } from "cc";
import AnimatorController from "./AnimatorController";

/** 参数类型 */
export enum ParamType {
    COMPLETE = 0,
    BOOLEAN = 1,
    NUMBER = 2,
    TRIGGER = 3,
    AUTO_TRIGGER = 4
}

/** 逻辑类型 */
export enum LogicType {
    EQUAL = 0,
    NOTEQUAL = 1,
    GREATER = 2,
    LESS = 3,
    GREATER_EQUAL = 4,
    LESS_EQUAL = 5
}

/**
 * 单项条件
 */
export default class AnimatorCondition {
    private _ac: AnimatorController;
    /** 此条件对应的参数名 */
    private _param: string = "";
    /** 此条件对应的值 */
    private _value: number = 0;
    /** 此条件与值比较的逻辑 */
    private _logic: LogicType = LogicType.EQUAL;

    constructor(data: any, ac: AnimatorController) {
        this._ac = ac;
        this._param = data.param;
        this._value = data.value;
        this._logic = data.logic;
    }

    public getParamName() {
        return this._param;
    }

    public getParamType(): ParamType {
        return this._ac.params.getParamType(this._param);
    }

    /** 判断此条件是否满足 */
    public check(): boolean {
        let type: ParamType = this.getParamType();
        if (type === ParamType.BOOLEAN) {
            return this._ac.params.getBool(this._param) === this._value;
        } else if (type === ParamType.NUMBER) {
            let value: number = this._ac.params.getNumber(this._param);
            switch (this._logic) {
                case LogicType.EQUAL:
                    return value === this._value;
                case LogicType.NOTEQUAL:
                    return value !== this._value;
                case LogicType.GREATER:
                    return value > this._value;
                case LogicType.LESS:
                    return value < this._value;
                case LogicType.GREATER_EQUAL:
                    return value >= this._value;
                case LogicType.LESS_EQUAL:
                    return value <= this._value;
                default:
                    return false;
            }
        } else if (type === ParamType.AUTO_TRIGGER) {
            return this._ac.params.getAutoTrigger(this._param) !== 0;
        } else if (type === ParamType.TRIGGER) {
            return this._ac.params.getTrigger(this._param) !== 0;
        } else {
            error(`[AnimatorCondition.check] 错误的type: ${type}`);
            return false;
        }
    }
}
