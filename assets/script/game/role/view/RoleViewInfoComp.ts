/*
 * @Author: dgflash
 * @Date: 2022-06-02 09:38:48
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 10:32:57
 */
import { EventTouch, Node, _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { UIID } from "../../common/config/GameUIConfig";
import { SingletonModuleComp } from "../../common/ecs/SingletonModuleComp";

const { ccclass, property } = _decorator;

/** 角色信息界面 */
@ccclass('RoleViewInfoComp')
@ecs.register('RoleViewInfo', false)
export class RoleViewInfoComp extends CCComp {
    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchEnd(event: EventTouch) {
        switch (event.target.name) {
            case "btn_levelup":
                var role = ecs.getSingleton(SingletonModuleComp).account.AccountModel.role;
                role.upgrade();
                break;
            case "btn_close":
                oops.gui.remove(UIID.Demo_Role_Info);

                // 注：模拟二次删除清理缓存
                setTimeout(() => {
                    oops.gui.remove(UIID.Demo_Role_Info);
                }, 1000);
                break;
        }

        event.propagationStopped = true;
    }

    reset() {
        this.node.destroy();
    }
}