import { CCString, Component, error, Label, RichText, warn, _decorator } from "cc";
import { EDITOR } from "cc/env";
import { LanguageData } from "./LanguageData";

const { ccclass, property, menu } = _decorator;

@ccclass("LangLabelParamsItem")
export class LangLabelParamsItem {
    @property
    key: string = "";
    @property
    value: string = "";
}

@ccclass("LanguageLabel")
@menu('ui/language/LanguageLabel')
export class LanguageLabel extends Component {
    @property({
        type: LangLabelParamsItem,
        displayName: "params"
    })
    private _params: Array<LangLabelParamsItem> = [];

    @property({
        type: LangLabelParamsItem,
        displayName: "params"
    })
    set params(value: Array<LangLabelParamsItem>) {
        this._params = value;
        if (!EDITOR) {
            this._needUpdate = true;
        }
    }
    get params(): Array<LangLabelParamsItem> {
        return this._params || [];
    }

    @property({ serializable: true })
    private _dataID: string = "";
    @property({ type: CCString, serializable: true })
    get dataID(): string {
        return this._dataID || "";
    }
    set dataID(value: string) {
        this._dataID = value;
        if (!EDITOR) {
            this._needUpdate = true;
        }
    }

    get string(): string {
        let _string = LanguageData.getLangByID(this._dataID);
        if (_string && this._params.length > 0) {
            this._params.forEach((item: LangLabelParamsItem) => {
                _string = _string.replace(`%{${item.key}}`, item.value)
            })
        }
        if (!_string) {
            warn("[LanguageLabel] 未找到语言标识，使用dataID替换");
            _string = this._dataID;
        }
        return _string;
    }

    /** 更新语言 */
    language() {
        this._needUpdate = true;
    }

    initFontSize: number = 0;

    onLoad() {
        this._needUpdate = true;
        if (!this.getComponent(Label) && !this.getComponent(RichText)) {
            error(this.node.name, this._dataID);
            return;
        }

        if (this.getComponent(RichText)) {
            this.initFontSize = this.getComponent(RichText)!.fontSize;
        }

        if (this.getComponent(Label)) {
            this.initFontSize = this.getComponent(Label)!.fontSize;
        }
    }

    /**
     * 默认文本的系统字体名字
     */
    public getLabelFont(lang: string): string {
        switch (lang) {
            case "zh":
            case "tr": {
                return "SimHei";
            }
        }
        return "Helvetica";
    }

    /**
     * 修改多语言参数，采用惰性求值策略
     * @param key 对于i18n表里面的key值
     * @param value 替换的文本
     */
    setVars(key: string, value: string) {
        let haskey = false;
        for (let i = 0; i < this._params.length; i++) {
            let element: LangLabelParamsItem = this._params[i];
            if (element.key === key) {
                element.value = value;
                haskey = true;
            }
        }
        if (!haskey) {
            let ii = new LangLabelParamsItem();
            ii.key = key;
            ii.value = value;
            this._params.push(ii);
        }
        this._needUpdate = true;
    }
    private _needUpdate: boolean = false;

    update() {
        if (this._needUpdate) {
            this.updateLabel();
            this._needUpdate = false;
        }
    }
    updateLabel() {
        do {
            if (!this._dataID) {
                break;
            }

            let spcomp: any = this.getComponent(Label);
            if (!spcomp) {
                spcomp = this.getComponent(RichText);
                if (!spcomp) {
                    warn("[LanguageLabel], 该节点没有cc.Label || cc.RichText组件");
                    break;
                }
            }

            spcomp.string = this.string;
        }
        while (false);
    }
}
