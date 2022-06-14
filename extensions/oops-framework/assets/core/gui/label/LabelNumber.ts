/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-14 18:23:46
 */
import { error, Label, _decorator } from "cc";

const { ccclass, property, menu } = _decorator;

/** 只能显示数字的标签组件 */
@ccclass("LabelNumber")
@menu('ui/label/LabelNumber')
export default class LabelNumber extends Label {
    @property
    _num: number = 0;

    @property({
        tooltip: "是否显示货币符号"
    })
    _showSym: string = "";

    @property
    public set num(value: number) {
        this._num = value;
        this.updateLabel();
    }

    public get num(): number {
        return this._num;
    }

    @property
    public set showSym(value: string) {
        if (value) {
            this._showSym = value;
            this.updateLabel();
        }
    }

    public get showSym(): string {
        return this._showSym;
    }

    @property
    useFix: boolean = true;

    /** 刷新lab */
    protected updateLabel() {
        if (typeof (this._num) != "number") {
            error("[LabelNumber] num不是一个合法数字");
        }
        this.string = this.num.toString();
    }
}