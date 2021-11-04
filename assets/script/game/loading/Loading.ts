import { _decorator } from 'cc';
import { engine } from '../../core/Engine';
import VMParent from '../../core/libs/model-view/VMParent';
import { resLoader } from '../../core/common/loader/ResLoader';
import { UIID } from '../../Main';
import { config } from '../config/Config';

const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends VMParent {
    protected data: any = {
        finished: 0,
        total: 0,
        progress: ""
    };

    private progress: number = 0;

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
        engine.gui.remove(UIID.UILoading);
        engine.gui.open(UIID.Demo);
    }

    onDestroy() {
        resLoader.releaseDir("loading");
    }
}
