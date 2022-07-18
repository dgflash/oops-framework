/*
 * @Author: dgflash
 * @Date: 2022-07-14 10:57:43
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-18 13:47:16
 */
import { ImageAsset, Node, Sprite, SpriteFrame, Texture2D, _decorator } from 'cc';
import { IRemoteOptions, resLoader } from '../../../extensions/oops-framework/assets/core/common/loader/ResLoader';
import { Root } from '../../../extensions/oops-framework/assets/core/Root';

const { ccclass, property } = _decorator;

/** 
 * 资源管理模块功能演示 oops-framework/assets/core/common/loader  
 * 远程资源其它类型加载可参考 https://docs.cocos.com/creator/manual/zh/asset/dynamic-load-resources.html?h=loadremote
 * SPINE资源加载可参考 https://docs.cocos.com/creator/manual/zh/asset/spine.html?h=loadany
 */
@ccclass('Main')
export class Main extends Root {
    @property({ type: Node })
    sprite: Node = null!;

    private url = "https://oops-1255342636.cos-website.ap-shanghai.myqcloud.com/oops-framework/assets/resources/native/00/0021cb5a-e4f0-4709-b0b6-5e21875720b7.3d6ea.png";
    // private cache: any = {};

    btnLoader() {
        var opt: IRemoteOptions = { ext: ".png" };
        var onComplete = (err: Error | null, data: ImageAsset) => {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = data;
            spriteFrame.texture = texture;
            var sprite = this.sprite.getComponent(Sprite) || this.sprite.addComponent(Sprite);
            sprite.spriteFrame = spriteFrame;
            data.addRef();
            // this.cache[data.nativeUrl] = spriteFrame;
        }
        resLoader.loadRemote<ImageAsset>(this.url, opt, onComplete);
    }

    btnUnLoader() {
        const sprite = this.sprite.getComponent(Sprite);
        if (sprite && sprite.spriteFrame) {
            const spFrame = sprite.spriteFrame;
            sprite.spriteFrame.decRef();
            sprite.spriteFrame = null;

            if (spFrame.refCount <= 0) {
                let texture = spFrame.texture as Texture2D;
                // 有动态合图时先取原始的Texture2D
                if (spFrame.packable) {
                    texture = spFrame.original?._texture as Texture2D;
                }

                if (texture) {
                    // delete this.cache[texture.image!.nativeUrl];
                    texture.image!.decRef();
                    texture.destroy();
                }
                spFrame.destroy();
            }
            sprite.destroy();
        }
    }
}