/*
 * @Author: dgflash
 * @Date: 2022-07-22 17:06:22
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-22 17:09:30
 */
import { resLoader } from "../../../../../extensions/oops-plugin-framework/assets/core/common/loader/ResLoader";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { AsyncQueue, NextFunction } from "../../../../../extensions/oops-plugin-framework/assets/libs/collection/AsyncQueue";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { config } from "../../common/config/Config";
import { UIID } from "../../common/config/GameUIConfig";
import { Initialize } from "../Initialize";
import { LoadingViewComp } from "../view/LoadingViewComp";

/** 初始化游戏公共资源 */
@ecs.register('InitRes')
export class InitResComp extends ecs.Comp {
    reset() { }
}

export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(InitResComp);
    }

    entityEnter(e: Initialize): void {
        var queue: AsyncQueue = new AsyncQueue();

        // 加载自定义资源
        this.loadCustom(queue);
        // 加载多语言包
        this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 加载游戏内容加载进度提示界面
        this.onComplete(queue, e);

        queue.play();
    }

    /** 加载自定义内容（可选） */
    private loadCustom(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
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
                lan = "zh";
                oops.storage.set("language", lan);
            }

            // 设置语言包路径
            oops.language.setAssetsPath(config.game.languagePathJson, config.game.languagePathTexture);

            // 加载语言包资源
            oops.language.setLanguage(lan, next);
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            resLoader.loadDir("common", next);
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete(queue: AsyncQueue, e: Initialize) {
        queue.complete = async () => {
            var node = await oops.gui.openAsync(UIID.Loading);
            if (node) e.add(node.getComponent(LoadingViewComp) as ecs.Comp);
            e.remove(InitResComp);
        };
    }
}