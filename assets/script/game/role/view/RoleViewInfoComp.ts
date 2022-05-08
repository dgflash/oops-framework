import { EventTouch, Node, _decorator } from "cc";
import { ecs } from "../../../core/libs/ecs/ECS";
import { oops } from "../../../core/Oops";
import { UIID } from "../../common/config/GameUIConfig";
import { CCComp } from "../../common/ecs/CCComp";
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
                break;
        }

        event.propagationStopped = true;
    }

    reset() {
        this.node.destroy();
    }
}