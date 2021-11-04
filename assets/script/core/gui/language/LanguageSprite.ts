import { Component, Size, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
import { engine } from "../../Engine";
import { resLoader } from "../../common/loader/ResLoader";
import { Logger } from "../../common/log/Logger";

const { ccclass, property, menu } = _decorator;

@ccclass("LanguageSprite")
@menu('ui/language/LanguageSprite')
export class LanguageSprite extends Component {
    @property({
        tooltip: "资源路径（language/texture/内的相对路径）"
    })
    public path: string = "";

    @property({
        tooltip: "是否设置为图片原始资源大小"
    })
    private isRawSize: boolean = true;

    start() {
        this.language = engine.i18n.currentLanguage;
    }

    set language(lang: string) {
        this.updateSprite(lang);
    }

    updateSprite(lang: string) {
        let spcomp: Sprite = this.getComponent(Sprite)!;
        // 获取语言标记
        let path = `language/texture/${lang}/${this.path}/spriteFrame`;
        let res = resLoader.get(path, SpriteFrame);
        if (!res) {
            Logger.erroring("[LanguageSprite] 资源不存在 " + path);
        }
        spcomp.spriteFrame = res;

        /** 修改节点为原始图片资源大小 */
        if (this.isRawSize) {
            //@ts-ignore
            let rawSize = res._originalSize as Size;
            spcomp.getComponent(UITransform)?.setContentSize(rawSize);
        }
    }
}