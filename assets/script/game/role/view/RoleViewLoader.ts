/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-11 15:04:39
 */

import { Component, sp, _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { GameResPath } from "../../common/config/GameResPath";
import { Role } from "../Role";

const { ccclass, property } = _decorator;

/** 角色资源加载 */
@ccclass('RoleViewLoader')
export class RoleViewLoader extends Component {
    spine: sp.Skeleton = null!;

    onLoad() {
        this.node.on("load", this.onEmitLoad, this);
    }

    private onEmitLoad(role: Role) {
        this.spine = role.RoleView.spine;
        this.load(role.RoleModel.anim);
    }

    private load(name: string) {
        this.node.active = false;

        var path = GameResPath.getRolePath(name);
        oops.res.load(path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
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
        if (this.spine.skeletonData) this.spine.skeletonData.decRef();
    }
}