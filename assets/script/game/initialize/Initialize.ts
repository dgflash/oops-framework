/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-27 13:57:33
 */
import { resLoader } from "../../core/common/loader/ResLoader";
import { AsyncQueue, NextFunction } from "../../core/common/queue/AsyncQueue";
import { ecs } from "../../core/libs/ecs/ECS";
import { oops } from "../../core/Oops";
import { config } from "../common/config/Config";
import { UIID } from "../common/config/GameUIConfig";
import { LoadingViewComp } from "./view/LoadingViewComp";

/**
 * 游戏进入初始化模块
 * 1、热更新
 * 2、加载默认资源
 */
export class Initialize extends ecs.Entity {
    LoadingView!: LoadingViewComp;

    protected init() {
        var queue: AsyncQueue = new AsyncQueue();

        // 加载自定义资源
        this.loadCustom(queue);
        // 加载多语言包
        this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 加载游戏内容加载进度提示界面
        this.onComplete();

        queue.play();
    }


    /** 加载自定义内容（可选） */
    private loadCustom(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            // 设置渠道号
            // if (config.query.channelId) SDKPlatform.setChannelId(config.query.channelId);

            // 加载多语言对应字体
            resLoader.load("language/font/" + oops.language.current, next);
        });
    }

    /** 加载化语言包（可选） */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = oops.storage.get("language");
            if (lan == null) {
                // lan = SDKPlatform.getLanguage();
                lan = "zh";
                oops.storage.set("language", lan!);
            }

            // 设置语言包路径
            oops.language.setAssetsPath(config.game.languagePathJson, config.game.languagePathTexture);

            // 加载语言包资源
            oops.language.setLanguage(lan!, next);
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.loadDir("common", next);
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private async onComplete() {
        var node = await oops.gui.openAsync(UIID.Loading);
        if (node) this.add(node.getComponent(LoadingViewComp) as ecs.Comp);
    }
}