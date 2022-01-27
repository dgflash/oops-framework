/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 16:12:49
 */

import { _decorator } from "cc";
import { resLoader } from "../../../core/common/loader/ResLoader";
import { Logger } from "../../../core/common/log/Logger";
import { engine } from "../../../core/Engine";
import { ecs } from "../../../core/libs/ECS";
import { config } from "../../common/config/Config";
import { UIID } from "../../common/config/GameUIConfig";
import { Account } from "../../account/Account";
import { CCVMParentComp } from "../../common/ecs/CCVMParentComp";
import { SingletonModuleComp } from "../../common/ecs/SingletonModuleComp";

const { ccclass, property } = _decorator;

@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCVMParentComp {
    protected data: any = {
        finished: 0,
        total: 0,
        progress: ""
    };

    private progress: number = 0;

    reset(): void {
        engine.gui.remove(UIID.Loading);
        engine.gui.open(UIID.Demo);

        // 进入游戏主界面
        var module = ecs.getSingleton(SingletonModuleComp);
        module.account = new Account();

        resLoader.releaseDir("loading");

        Logger.logView("释放loading资源");
    }

    start() {
        this.loadRes();
    }

    private async loadRes() {
        this.data.progress = 0;
        await this.loadLanguage();
        await this.loadCommonRes();
        this.loadGameRes();
    }

    private loadLanguage() {
        return new Promise((resolve, reject) => {
            engine.i18n.setAssetsPath(config.game.languagePathJson, config.game.languagePathTexture);
            engine.i18n.setLanguage(config.query.lang, resolve);
        });
    }

    private loadCommonRes() {
        return new Promise((resolve, reject) => {
            resLoader.loadDir("common", resolve);
        });
    }

    private loadGameRes() {
        resLoader.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    private onProgressCallback(finished: number, total: number, item: any) {
        this.data.finished = finished;
        this.data.total = total;

        var progress = finished / total;
        if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2);
        }
    }

    private onCompleteCallback() {
        this.ent.remove(LoadingViewComp);
    }
}