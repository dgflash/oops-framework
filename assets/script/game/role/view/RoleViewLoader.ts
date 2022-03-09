/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-03-09 18:01:33
 */

import { Component, sp, _decorator } from "cc";
import { resLoader } from "../../../core/common/loader/ResLoader";
import { config } from "../../common/config/Config";
import { RoleViewComp } from "./RoleViewComp";

const { ccclass, property } = _decorator;

/** 角色资源加载 */
@ccclass('RoleViewLoader')
export class RoleViewLoader extends Component {
    spine: sp.Skeleton = null!;

    load(name: string) {
        this.node.active = false;
        this.spine = this.getComponent(RoleViewComp)!.spine!;

        var path = config.game.getRolePath(name);
        resLoader.load(path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
            if (err) {
                console.error(`动画名为【${path}】的角色资源不存在`);
                return;
            }

            this.spine.skeletonData = sd;
            this.spine.skeletonData.addRef();
            this.node.active = true;
        });
    }

    onDestroy() {
        this.spine.skeletonData.decRef();
    }
}