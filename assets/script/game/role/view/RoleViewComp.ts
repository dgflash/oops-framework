/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 15:45:07
 */

import { sp, _decorator } from "cc";
import { resLoader } from "../../../core/common/loader/ResLoader";
import { ecs } from "../../../core/libs/ECS";
import { config } from "../../common/config/Config";
import { CCComp } from "../../common/ecs/CCComp";
import { RoleModelComp } from "../model/RoleModelComp";
import { RoleViewAnimatorComp } from "./RoleViewAnimatorComp";

const { ccclass, property } = _decorator;

/** 角色显示组件 */
@ccclass('RoleViewComp')
@ecs.register('RoleView', false)
export class RoleViewComp extends CCComp {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton | null = null;

    animator: RoleViewAnimatorComp = null!;

    onLoad() {
        this.node.active = false;

        this.animator = this.spine!.getComponent(RoleViewAnimatorComp)!;
        this.animator.role = this.ent.get(RoleModelComp).facade;
    }

    load() {
        var name = "model1";
        var path = config.game.getRolePath(name);
        resLoader.load(path, sp.SkeletonData, (err, sd: sp.SkeletonData) => {
            if (err) {
                console.error(`动画名为【${path}】的角色资源不存在`);
                return;
            }

            var spsd = new sp.SkeletonData();
            spsd.skeletonJson = sd.skeletonJson;
            spsd.atlasText = sd.atlasText;
            spsd.textures = sd.textures;
            spsd.textureNames = sd.textureNames;
            spsd.scale = sd.scale;
            spsd.name = sd.name;

            this.spine!.skeletonData = spsd;
            this.node.active = true;
        });
    }

    reset() {
        this.node.destroy();
    }
}