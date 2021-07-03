import { Enum, _decorator } from 'cc';
import VMBase from './VMBase';

const { ccclass, property, menu, help } = _decorator;

/** 限制值边界范围的模式 */
enum CLAMP_MODE {
    MIN,
    MAX,
    MIN_MAX,
}

/**
 * [VM-Modify]
 * 动态快速的修改模型的数值,使用按钮 绑定该组件上的函数，即可动态调用
 * 修改 Model 的值
 */
@ccclass
@menu('ModelViewer/VM-Modify(修改Model)')
@help('https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMModify.md')
export default class VMModify extends VMBase {
    @property({
        tooltip: "监视对象路径"
    })
    watchPath: string = "";

    @property({
        tooltip: "是不启用取值范围限制"
    })
    valueClamp: boolean = false;

    @property({
        type: Enum(CLAMP_MODE),
        visible: function () { return this.valueClamp === true }
    })
    valueClampMode: CLAMP_MODE = CLAMP_MODE.MIN_MAX;

    @property({
        visible: function () { return this.valueClamp === true && this.valueClampMode !== CLAMP_MODE.MAX }
    })
    valueMin: number = 0;

    @property({
        visible: function () { return this.valueClamp === true && this.valueClampMode !== CLAMP_MODE.MIN }
    })
    valueMax: number = 1;

    // 限制最终结果的取值范围
    private clampValue(res: number): number {
        let min = this.valueMin;
        let max = this.valueMax;
        if (this.valueClamp == false) return res;
        switch (this.valueClampMode) {
            case CLAMP_MODE.MIN_MAX:
                if (res > max) res = max;
                if (res < min) res = min;
                break;
            case CLAMP_MODE.MIN:
                if (res < min) res = min;
                break;
            case CLAMP_MODE.MAX:
                if (res > max) res = max;
                break;
            default:
                break;
        }

        return res;
    }

    /** 加整数 */
    vAddInt(e: Event, data: string) {
        this.vAdd(e, data, true);
    }

    /** 减整数 */
    vSubInt(e: Event, data: string) {
        this.vSub(e, data, true);
    }

    /** 乘整数 */
    vMulInt(e: Event, data: string) {
        this.vMul(e, data, true);
    }

    /** 除整数 */
    vDivInt(e: Event, data: string) {
        this.vDiv(e, data, true);
    }

    /** 加 */
    vAdd(e: Event, data: string, int: boolean = false) {
        let a = parseFloat(data);
        let res = this.VM.getValue(this.watchPath, 0) + a;
        if (int) { res = Math.round(res) }
        this.VM.setValue(this.watchPath, this.clampValue(res));
    }

    /** 减 */
    vSub(e: Event, data: string, int: boolean = false) {
        let a = parseFloat(data);
        let res = this.VM.getValue(this.watchPath, 0) - a;
        if (int) { res = Math.round(res) }
        this.VM.setValue(this.watchPath, this.clampValue(res));
    }

    /** 乘 */
    vMul(e: Event, data: string, int: boolean = false) {
        let a = parseFloat(data);
        let res = this.VM.getValue(this.watchPath, 0) * a;
        if (int) { res = Math.round(res) }
        this.VM.setValue(this.watchPath, this.clampValue(res));
    }

    /** 除 */
    vDiv(e: Event, data: string, int: boolean = false) {
        let a = parseFloat(data);
        let res = this.VM.getValue(this.watchPath, 0) / a;
        if (int) { res = Math.round(res) }
        this.VM.setValue(this.watchPath, this.clampValue(res));
    }

    /** 字符串赋值 */
    vString(e: Event, data: string) {
        let a = data;
        this.VM.setValue(this.watchPath, a);
    }

    /** 整数赋值 */
    vNumberInt(e: Event, data: string) {
        this.vNumber(e, data, true);
    }

    /** 数字赋值 */
    vNumber(e: Event, data: string, int: boolean = false) {
        let a = parseFloat(data);
        if (int) { a = Math.round(a) }
        this.VM.setValue(this.watchPath, this.clampValue(a));
    }
}
