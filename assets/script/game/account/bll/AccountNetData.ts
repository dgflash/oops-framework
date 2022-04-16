/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:51:15
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-15 09:47:36
 */

import { v3 } from "cc";
import { Message } from "../../../core/common/event/MessageManager";
import { storage } from "../../../core/common/storage/StorageManager";
import { ecs } from "../../../core/libs/ECS";
import { oops } from "../../../core/Oops";
import { GameEvent } from "../../common/config/GameEvent";
import { netConfig } from "../../common/net/NetConfig";
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

    entityEnter(e: Account): void {
        var params: any = {
            playerId: netConfig.dbid,
            sessionKey: netConfig.sessionKey,
        }

        let onComplete = {
            target: this,
            callback: (data: any) => {
                // 设置本地存储的用户标识（用于下次登录不输入帐号）
                this.setLocalStorage(data.id);

                // 创建玩家角色对象
                this.createRole(e, data);

                // 玩家登录成功事件
                Message.dispatchEvent(GameEvent.LoginSuccess);
            }
        }
        // 请求登录游戏获取角色数据
        // netChannel.game.req("LoginAction", "loadPlayer", params, onComplete);

        // 离线测试代码开始
        var data = {
            id: 1,
            name: "Oops",
            power: 10,
            agile: 10,
            physical: 10,
            lv: 1,
            jobId: 1
        }
        onComplete.callback(data);
        // 离线测试代码结束

        e.remove(AccountNetDataComp);
    }

    /** 创建角色对象（自定义逻辑） */
    private createRole(e: Account, data: any) {
        var role = ecs.getEntity<Role>(Role);

        // 角色数据
        role.RoleModel.id = data.id;
        role.RoleModel.name = data.name;

        // 角色初始战斗属性
        role.RoleModelBase.power = data.power;
        role.RoleModelBase.agile = data.agile;
        role.RoleModelBase.physical = data.physical;

        // 角色等级数据
        role.upgrade(data.lv);

        // 角色职业数据
        role.RoleModelJob.id = data.jobId;

        // 角色基础属性绑定到界面上显示
        role.RoleModel.vmAdd();
        // 角色等级属性绑定到界面上显示
        role.RoleModelLevel.vmAdd();
        // 角色初始基础属性绑定到界面上显示
        role.RoleModelBase.vmAdd();

        // 角色动画显示对象
        role.load(oops.gui.game, v3(0, -300, 0));

        e.AccountModel.role = role;
    }

    /** 设置本地存储的用户标识 */
    private setLocalStorage(uid: number) {
        storage.setUser(uid);
        storage.set("account", uid);
    }
}