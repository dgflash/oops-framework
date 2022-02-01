/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 09:59:26
 */
import { Node } from "cc";
import { resLoader } from "../../core/common/loader/ResLoader";
import { AsyncQueue, NextFunction } from "../../core/common/queue/AsyncQueue";
import { engine } from "../../core/Engine";
import { UICallbacks } from "../../core/gui/layer/Defines";
import { ecs } from "../../core/libs/ECS";
import { JsonUtil } from "../../core/utils/JsonUtil";
import { config } from "../common/config/Config";
import { UIID } from "../common/config/GameUIConfig";
import { RoleJobModelComp } from "../role/model/RoleJobModelComp";
import { RoleTableLevelUp } from "../role/model/RoleTableLevelUp";
import { LoadingViewComp } from "./view/LoadingViewComp";

/**
 * 游戏进入初始化模块
 * 1、热更新
 * 2、加载默认资源
 * 3、转到帐号模块
 */
export class Initialize extends ecs.Entity {
    LoadingView!: LoadingViewComp;

    constructor() {
        super();

        // 设置渠道号
        // if (config.query.channelId) SDKPlatform.setChannelId(config.query.channelId);
    }

    /** 打开初始界面 */
    open() {
        var queue: AsyncQueue = new AsyncQueue();

        // 加载多语言包
        this.loadLanguage(queue);
        // 加载TTF字库（可选项）
        this.loadFont(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 加载自定义静态表
        this.loadCustom(queue);
        // 加载游戏主界面资源
        this.onComplete(queue);

        queue.play();
    }

    /** 加载化语言包 */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = engine.storage.get("language");
            if (lan == null) {
                // lan = SDKPlatform.getLanguage();
                lan = "zh";
                engine.storage.set("language", lan!);
            }

            // 设置语言包路径
            engine.i18n.setAssetsPath(config.game.languagePathJson, config.game.languagePathTexture);

            // 加载语言包资源
            engine.i18n.setLanguage(lan!, next);
        });
    }

    /** 加载TTF字库（可选项） */
    private loadFont(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.load("language/font/" + engine.i18n.currentLanguage, next);
        });
    }

    /** 加载公共资源（公用提示、窗口等自定义文件体积交小的资源） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.loadDir("common", next);
        });
    }

    /** 加载自定义静态表 */
    private loadCustom(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            
            next();
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete(queue: AsyncQueue) {
        queue.complete = () => {
            var uic: UICallbacks = {
                onAdded: (node: Node, params: any) => {
                    var comp = node.getComponent(LoadingViewComp) as ecs.Comp;
                    this.add(comp);
                }
            };
            engine.gui.open(UIID.Loading, null, uic);
        };
    }
}