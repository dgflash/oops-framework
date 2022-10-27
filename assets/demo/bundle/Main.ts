/*
 * @Author: dgflash
 * @Date: 2022-10-25 17:43:11
 * @LastEditors: dgflash
 * @LastEditTime: 2022-10-26 09:50:36
 */
import { Component, Prefab, Sprite, _decorator } from 'cc';
import { BundleManager } from '../../script/game/common/bundle/BundleManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Sprite)
    icon: Sprite = null!;

    start() {
        this.loadAsset();
    }

    async loadAsset() {
        //自己重新传参，享受下代码提示的快感吧
        let res = await BundleManager.loadPrefab("home", "home1");
        console.log("预制体", res);
        let res1 = await BundleManager.loadAudio("home", "music2");
        console.log("音效", res1);
        let res2 = await BundleManager.loadTextre("game", "game1");
        console.log("图片", res2);
        let res3 = await BundleManager.loadAsset("game", "game1", Prefab);
        console.log("loadAsset预制体", res3);

        this.icon.spriteFrame = res2;
    }
}

