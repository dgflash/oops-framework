import { CCString, error, _decorator } from 'cc';
import { EDITOR } from 'cc/env';
import { StringFormatFunction } from './StringFormat';
import VMBase from './VMBase';

const { ccclass, property, menu, executeInEditMode, help } = _decorator;

const LABEL_TYPE = {
    CC_LABEL: 'cc.Label',
    CC_RICH_TEXT: 'cc.RichText',
    CC_EDIT_BOX: 'cc.EditBox'
}

/**
 *  [VM-Label]
 *  专门处理 Label 相关 的组件，如 ccLabel,ccRichText,ccEditBox
 *  可以使用模板化的方式将数据写入,可以处理字符串格式等
 *  todo 加入stringFormat 可以解析转换常见的字符串格式
 */
@ccclass
@executeInEditMode
@menu('ModelViewer/VM-Label(文本VM)')
@help('https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMLabel.md')
export default class VMLabel extends VMBase {
    @property({
        tooltip: '是否启用模板代码,只能在运行时之前设置,\n将会动态解析模板语法 {{0}},并且自动设置监听的路径'
    })
    public templateMode: boolean = false;

    @property({
        readonly: true
    })
    private labelType: string = LABEL_TYPE.CC_LABEL;

    @property({
        visible: function () { return this.templateMode === false; }
    })
    watchPath: string = "";

    // 按照匹配参数顺序保存的 path 数组 （固定）
    @property({
        type: [CCString],
        visible: function () { return this.templateMode === true }
    })
    protected watchPathArr: string[] = [];

    // 按照路径参数顺序保存的 值的数组（固定）
    protected templateValueArr: any[] = [];

    // 保存着字符模板格式的数组 (只会影响显示参数)
    private templateFormatArr: string[] = [];

    // 源字符串
    private originText: string | null = null;

    onRestore() {
        this.checkLabel();
    }

    onLoad() {
        super.onLoad();
        this.checkLabel();
        if (!EDITOR) {
            if (this.templateMode) {
                this.originText = this.getLabelValue();
                this.parseTemplate();
            }
        }
    }

    start() {
        if (EDITOR) return;
        this.onValueInit();
    }

    // 解析模板 获取初始格式化字符串格式 的信息
    parseTemplate() {
        let regexAll = /\{\{(.+?)\}\}/g;                // 匹配： 所有的{{value}}
        let regex = /\{\{(.+?)\}\}/;                    // 匹配： {{value}} 中的 value
        let res = this.originText!.match(regexAll);     // 匹配结果数组
        if (res == null) return;
        for (let i = 0; i < res.length; i++) {
            const e = res[i];
            let arr = e.match(regex);
            let matchName = arr![1];
            // let paramIndex = parseInt(matchName) || 0;
            let matchInfo = matchName.split(':')[1] || '';
            this.templateFormatArr[i] = matchInfo;
        }
    }

    /**获取解析字符串模板后得到的值 */
    getReplaceText() {
        if (!this.originText) return "";
        let regexAll = /\{\{(.+?)\}\}/g;                    // 匹配： 所有的{{value}}
        let regex = /\{\{(.+?)\}\}/;                        // 匹配： {{value}} 中的 value
        let res = this.originText.match(regexAll);          // 匹配结果数组 [{{value}}，{{value}}，{{value}}]
        if (res == null) return '';                         // 未匹配到文本
        let str = this.originText;                          // 原始字符串模板 "name:{{0}} 或 name:{{0:fix2}}"

        for (let i = 0; i < res.length; i++) {
            const e = res[i];
            let getValue;
            let arr = e.match(regex);                       // 匹配到的数组 [{{value}}, value]
            let indexNum = parseInt(arr![1] || '0') || 0;   // 取出数组的 value 元素 转换成整数
            let format = this.templateFormatArr[i];         // 格式化字符 的 配置参数
            getValue = this.templateValueArr[indexNum];
            str = str.replace(e, this.getValueFromFormat(getValue, format));//从路径缓存值获取数据
        }
        return str;
    }

    /** 格式化字符串 */
    getValueFromFormat(value: number | string, format: string): string {
        return StringFormatFunction.deal(value, format);
    }

    /** 初始化获取数据 */
    onValueInit() {
        //更新信息
        if (this.templateMode === false) {
            this.setLabelValue(this.VM.getValue(this.watchPath)); //
        }
        else {
            let max = this.watchPathArr.length;
            for (let i = 0; i < max; i++) {
                this.templateValueArr[i] = this.VM.getValue(this.watchPathArr[i], '?');
            }
            this.setLabelValue(this.getReplaceText()); // 重新解析
        }
    }

    /** 监听数据发生了变动的情况 */
    onValueChanged(n: any, o: any, pathArr: string[]) {
        if (this.templateMode === false) {
            this.setLabelValue(n);
        }
        else {
            let path = pathArr.join('.');
            // 寻找缓存位置
            let index = this.watchPathArr.findIndex(v => v === path);

            if (index >= 0) {
                //如果是所属的路径，就可以替换文本了
                this.templateValueArr[index] = n;          // 缓存值
                this.setLabelValue(this.getReplaceText()); // 重新解析文本
            }

        }
    }

    setLabelValue(value: string) {
        var component: any = this.getComponent(this.labelType);
        component.string = value + '';
    }

    getLabelValue(): string {
        var component: any = this.getComponent(this.labelType);
        return component.string;
    }

    private checkLabel() {
        let checkArray = [
            'cc.Label',
            'cc.RichText',
            'cc.EditBox',
        ];

        for (let i = 0; i < checkArray.length; i++) {
            const e = checkArray[i];
            let comp = this.node.getComponent(e);
            if (comp) {
                this.labelType = e;
                return true;
            }
        }

        error('没有挂载任何label组件');

        return false;
    }
}
