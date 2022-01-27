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
        // 设置渠道号
        // if (config.query.channelId) SDKPlatform.setChannelId(config.query.channelId);

        this.entity = ecs.createEntityWithComps();
    }

    /** 打开初始界面 */
    open() {
        var queue: AsyncQueue = new AsyncQueue();
        // 加载多语言包
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = engine.storage.get("game_language");
            if (lan == null) {
                // lan = SDKPlatform.getLanguage();
                engine.storage.set("game_language", lan!);
            }

            // 设置语言包路径
            engine.i18n.setAssetsPath(config.game.languagePathJson, config.game.languagePathTexture);

            // 加载语言包资源
            engine.i18n.setLanguage(lan!, next);
        });
        // 加载TTF字库（可选项）
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.load("language/font/" + engine.i18n.currentLanguage, next);
        });
        // 加载公共资源（公用提示、窗口等自定义文件体积交小的资源）
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.loadDir("common", next);
        });
        // 进入第一个加载游戏主界面资源的界面
        queue.complete = () => {
            this.loadDataTable();

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

    /** 加载静态表 */
    async loadDataTable() {
        await JsonUtil.loadAsync(RoleJobModelComp.TableName);
        await JsonUtil.loadAsync(RoleTableLevelUp.TableName);
    }
}