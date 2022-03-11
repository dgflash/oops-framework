/*
 * @Author: dgflash
 * @Date: 2021-11-24 15:51:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-11 17:13:46
 */
import { CCString, Component, Size, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
import { EDITOR } from "cc/env";
import { resLoader } from "../../common/loader/ResLoader";
import { Logger } from "../../common/log/Logger";
import { LanguageData } from "./LanguageData";

const { ccclass, property, menu } = _decorator;

@ccclass("LanguageSprite")
@menu('ui/language/LanguageSprite')
export class LanguageSprite extends Component {
    @property({ serializable: true })
    private _dataID: string = "";
    @property({ type: CCString, serializable: true })
    get dataID(): string {
        return this._dataID || "";
    }
    set dataID(value: string) {
        this._dataID = value;
        if (!EDITOR) {
            this.updateSprite();
        }
    }

    @property({
        tooltip: "是否设置为图片原始资源大小"
    })
    private isRawSize: boolean = true;

    start() {
        this.updateSprite();
    }

    /** 更新语言 */
    language() {
        this.updateSprite(); 
    }

    private updateSprite() {
        // 获取语言标记
        let path = `language/texture/${LanguageData.current}/${this.dataID}/spriteFrame`;
        let res: SpriteFrame | null = resLoader.get(path, SpriteFrame);
        if (!res) {
            Logger.erroring("[LanguageSprite] 资源不存在 " + path);
        }
        else {
            let spcomp: Sprite = this.getComponent(Sprite)!;
            spcomp.spriteFrame = res;

            /** 修改节点为原始图片资源大小 */
            if (this.isRawSize) {
                //@ts-ignore
                let rawSize = res._originalSize as Size;
                spcomp.getComponent(UITransform)?.setContentSize(rawSize);
            }
        }
    }
}