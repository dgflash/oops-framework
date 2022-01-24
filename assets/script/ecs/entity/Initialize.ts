/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 15:11:00
 */
import { Node, sys } from "cc";
import { resLoader } from "../../core/common/loader/ResLoader";
import { AsyncQueue, NextFunction } from "../../core/common/queue/AsyncQueue";
import { engine } from "../../core/Engine";
import { UICallbacks } from "../../core/gui/layer/Defines";
import { ecs } from "../../core/libs/ECS";
import { config } from "../../game/config/Config";
import { UICF, UIID } from "../../game/config/UIConfig";
import { LoadingViewComp } from "../component/initialize/LoadingViewComp";

export class InitializeEntity extends ecs.Entity {
    LoadingView!: LoadingViewComp;
}

/**
 * 游戏进入初始化模块
 * 1、热更新
 * 2、加载默认资源
 * 3、转到帐号模块
 */
export class Initialize {
    private entity: InitializeEntity = null!;

    constructor() {
        engine.gui.init(UICF);
        this.create();
    }

    create() {
        this.entity = ecs.createEntityWithComps();
    }

    /** 打开初始界面 */
    open() {
        var queue: AsyncQueue = new AsyncQueue();
        // 加载多语言包
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置当前的渠道号
            // if (config.query.channelId) SDKPlatform.setChannelId(config.query.channelId);

            // 设置语言包路径
            engine.i18n.setAssetsPath(config.game.languagePathJson, config.game.languagePathTexture);

            // 设置默认语言
            let lan = sys.localStorage.getItem("game_language");
            if (!lan) {
                // lan = SDKPlatform.getLanguage();
                sys.localStorage.setItem("game_language", lan!);
            }
            engine.i18n.setLanguage(lan!, next);
        });
        // 加载ttf字库
        queue.push((next: NextFunction, params: any, args: any) => {
            // resLoader.load("language/font/" + engine.i18n.currentLanguage, next);
            next();
        });
        // 加载公共资源
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.loadDir("common", next);
        });
        // 进入第一个场景
        queue.complete = () => {
            var uic: UICallbacks = {
                onAdded: (node: Node, params: any) => {
                    var comp = node.getComponent(LoadingViewComp) as ecs.Comp;
                    this.entity.add(comp);
                }
            };
            engine.gui.open(UIID.Loading, null, uic);
        };
        queue.play();
    }
}