/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:51:15
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 18:03:33
 */

import { SqlUtil } from "../../../core/common/storage/SqlUtil";
import { engine } from "../../../core/Engine";
import { ecs } from "../../../core/libs/ECS";
import { VM } from "../../../core/libs/model-view/ViewModel";
import { ViewUtil } from "../../../core/utils/ViewUtil";
import { Role } from "../../role/Role";
import { Account } from "../Account";
import { AccountModelComp } from "../model/AccountModelComp";

/** 请求玩家游戏数据 */
@ecs.register('AccountNetData')
export class AccountNetDataComp extends ecs.Comp {
    reset() { }
}

/** 请求玩家游戏数据 */
export class AccountNetDataSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountNetDataComp, AccountModelComp);
    }

    entityEnter(entities: Account[]): void {
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

            this.test(e);

            e.remove(AccountNetDataComp);
        }
    }

    /** 离线测试代码（自定义逻辑） */
    private test(e: Account) {
        var role = new Role();

        // 角色数据
        role.RoleModel.id = 1;
        role.RoleModel.name = "测试角色";

        // 角色初始战斗属性
        role.RoleBaseModel.power = 10;
        role.RoleBaseModel.agile = 10;
        role.RoleBaseModel.physical = 10;

        // 角色等级数据
        role.RoleLevel.lv = 1;                           // + 5 hp

        // 角色职业数据
        role.RoleJobModel.id = 1;                        // + 2 power, + 10 ad

        // 角色基础属性绑定到界面上显示
        VM.add(role.RoleModel.vm, "role");

        // 角色信息界面显示对象
        var role_attr = ViewUtil.createPrefabNode("game/battle/role_attr");
        role_attr.parent = engine.gui.root;

        // 角色动画显示对象
        role.load();
        role.RoleView.node.parent = engine.gui.root;
        role.RoleView.node.setPosition(0, -200, 0);

        e.AccountModel.role = role;
    }

    /** 设置本地存储的用户标识 */
    setLocalStorage(uid: number) {
        SqlUtil.setUser(uid);
        SqlUtil.set("account", uid);
    }
}