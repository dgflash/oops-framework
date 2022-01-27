/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:51:15
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 15:45:44
 */

import { EventTouch, Node, UITransform, v3 } from "cc";
import { SqlUtil } from "../../../core/common/storage/SqlUtil";
import { engine } from "../../../core/Engine";
import { ecs } from "../../../core/libs/ECS";
import { VM } from "../../../core/libs/model-view/ViewModel";
import { ViewUtil } from "../../../core/utils/ViewUtil";
import { SingletonModuleComp } from "../../common/ecs/SingletonModuleComp";
import { RoleNumeric } from "../../role/model/attribute/RoleNumeric";
import { RoleAnimatorType, RoleAttributeType } from "../../role/model/RoleEnum";
import { Role } from "../../role/Role";
import { AccountEntity } from "../Account";
import { AccountModelComp } from "../model/AccountModelComp";

/** 帐号网络数据请求 */
@ecs.register('AccountNetData')
export class AccountNetDataComp extends ecs.Comp {
    reset() { }
}

/** 请求玩家游戏数据 */
export class AccountNetDataSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountNetDataComp, AccountModelComp);
    }

    entityEnter(entities: AccountEntity[]): void {
        for (let e of entities) {
            // var params: any = {
            //     playerId: netConfig.dbid,
            //     sessionKey: netConfig.sessionKey,
            // }

            // let onComplete = {
            //     target: this,
            //     callback: (data: any) => {
            //         console.log("帐号数据", data);
            //         this.setLocalStorage(data.id);
            //     }
            // }

            // // 请求登录游戏获取角色数据
            // netChannel.game.req("LoginAction", "loadPlayer", params, onComplete);

            /** 离线测试代码 */
            var role = new Role();
            role.entity.RoleModel.id = 1;
            role.entity.RoleModel.lv = 10;                          // + 5 hp
            role.entity.RoleModel.name = "玩家";
            role.entity.RoleJobModel.id = 2;                        // + 2 power, + 10 ad

            e.AccountModel.role = role;

            // 角色数据绑定到界面上显示
            role.entity.RoleModel.attributes.forEach((value: RoleNumeric, key: RoleAttributeType, map: Map<RoleAttributeType, RoleNumeric>) => {
                VM.add(value, key);
            });

            // 角色信息界面
            var role_attr = ViewUtil.createPrefabNode("game/battle/role_attr");
            role_attr.parent = engine.gui.root;

            // 角色动画
            role.load();
            role.entity.RoleView.node.parent = engine.gui.root;
            role.entity.RoleView.node.setPosition(0, -200, 0);

            setInterval(() => {
                // 动态修改数据时，VM框架自动刷新界面数值显示
                role.entity.RoleModel.attributes.get(RoleAttributeType.hp).battle++;

                if (role.entity.RoleView) role.entity.RoleView.animator.setAction(RoleAnimatorType.Attack);
            }, 2000);

            setTimeout(() => {
                role.changeJob(9)
            }, 2000);

            engine.gui.root.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

            e.remove(AccountNetDataComp);
        }
    }

    private onTouchEnd(event: EventTouch) {
        var role = ecs.getSingleton(SingletonModuleComp).account.entity.AccountModel.role;
        var uit = role.entity.RoleView.node.parent?.getComponent(UITransform)!;
        role.move(v3(event.getUILocation().x - uit.contentSize.width / 2, event.getUILocation().y - uit.contentSize.height / 2));
    }

    /** 设置本地存储的用户标识 */
    setLocalStorage(uid: number) {
        SqlUtil.setUser(uid);
        SqlUtil.set("account", uid);
    }
}