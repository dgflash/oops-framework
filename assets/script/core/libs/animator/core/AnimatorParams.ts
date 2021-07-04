import { ParamType } from "./AnimatorCondition";

/**
 * 参数结构
 */
interface Param {
    type: ParamType;
    value: number;
}

/**
 * 状态机参数
 */
export default class AnimatorParams {
    private _paramMap: Map<string, Param> = new Map();

    constructor(dataArr: any[]) {
        dataArr.forEach((data: any) => {
            let param: Param = {
                type: data.type,
                value: data.init
            };
            this._paramMap.set(data.param, param);
        });
    }

    public getParamType(key: string): ParamType {
        let param: Param = this._paramMap.get(key)!;
        if (param) {
            return param.type;
        } else {
            return null!;
        }
    }

    public setNumber(key: string, value: number) {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.NUMBER) {
            param.value = value;
        }
    }

    public setBool(key: string, value: boolean) {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.BOOLEAN) {
            param.value = value ? 1 : 0;
        }
    }

    public setTrigger(key: string) {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.TRIGGER) {
            param.value = 1;
        }
    }

    public resetTrigger(key: string) {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.TRIGGER) {
            param.value = 0;
        }
    }

    public autoTrigger(key: string) {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.AUTO_TRIGGER) {
            param.value = 1;
        }
    }

    public resetAutoTrigger(key: string) {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.AUTO_TRIGGER) {
            param.value = 0;
        }
    }

    public resetAllAutoTrigger() {
        this._paramMap.forEach((param: Param, key: string) => {
            if (param.type === ParamType.AUTO_TRIGGER) {
                param.value = 0;
            }
        });
    }

    public getNumber(key: string): number {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.NUMBER) {
            return param.value;
        } else {
            return 0;
        }
    }

    public getBool(key: string): number {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.BOOLEAN) {
            return param.value;
        } else {
            return 0;
        }
    }

    public getTrigger(key: string): number {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.TRIGGER) {
            return param.value;
        } else {
            return 0;
        }
    }

    public getAutoTrigger(key: string): number {
        let param: Param = this._paramMap.get(key)!;
        if (param && param.type === ParamType.AUTO_TRIGGER) {
            return param.value;
        } else {
            return 0;
        }
    }
}
