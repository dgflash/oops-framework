/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-09 18:34:16
 */
import { sys, _decorator } from "cc";
import { resLoader } from "../../../core/common/loader/ResLoader";
import { ecs } from "../../../core/libs/ecs/ECS";
import { oops } from "../../../core/Oops";
import { JsonUtil } from "../../../core/utils/JsonUtil";
import { Account } from "../../account/Account";
import { GameEvent } from "../../common/config/GameEvent";
import { UIID } from "../../common/config/GameUIConfig";
import { CCVMParentComp } from "../../common/ecs/CCVMParentComp";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { TableRoleJob } from "../../common/table/TableRoleJob";
import { TableRoleLevelUp } from "../../common/table/TableRoleLevelUp";

const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCVMParentComp {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "0",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    private progress: number = 0;

    reset(): void {
        // 获取用户信息的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_player");

        // 关闭加载界面
        oops.gui.remove(UIID.Loading);

        // 释放加载界面资源
        resLoader.releaseDir("loading");

        // 打开游戏主界面（自定义逻辑）
        oops.gui.open(UIID.Demo);
    }

    start() {
        // if (!sys.isNative) {
            this.enter();
        // }
    }

    enter() {
        this.addEvent();
        this.loadRes();
    }

    private addEvent() {
        this.on(GameEvent.LoginSuccess, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.LoginSuccess:
                // 加载流程结束，移除加载提示界面
                this.ent.remove(LoadingViewComp);
                break;
        }
    }

    /** 加载资源 */
    private async loadRes() {
        this.data.progress = 0;
        await this.loadCustom();
        this.loadGameRes();
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadCustom() {
        // 加载游戏本地JSON数据的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_json");

        return new Promise(async (resolve, reject) => {
            await JsonUtil.loadAsync(TableRoleJob.TableName);
            await JsonUtil.loadAsync(TableRoleLevelUp.TableName);
            resolve(null);
        });
    }

    /** 加载初始游戏内容资源 */
    private loadGameRes() {
        // 加载初始游戏内容资源的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_game");

        resLoader.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        this.data.finished = finished;
        this.data.total = total;

        var progress = finished / total;
        if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2);
        }
    }

    /** 加载完成事件 */
    private onCompleteCallback() {
        // 初始化帐号模块
        smc.account = ecs.getEntity<Account>(Account);
        smc.account.connect();
    }
}