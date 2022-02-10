/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:51:15
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-10 10:01:34
 */

import { Message } from "../../../core/common/event/MessageManager";
import { storage } from "../../../core/common/storage/SqlUtil";
import { oops } from "../../../core/Oops";
import { ecs } from "../../../core/libs/ECS";
import { VM } from "../../../core/libs/model-view/ViewModel";
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

    entityEnter(entities: Account[]): void {
        for (let e of entities) {
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
    }

    /** 创建角色对象（自定义逻辑） */
    private createRole(e: Account, data: any) {
        var role = new Role();

        // 角色数据
        role.RoleModel.id = data.id;
        role.RoleModel.name = data.name;

        // 角色初始战斗属性
        role.RoleBaseModel.power = data.power;
        role.RoleBaseModel.agile = data.agile;
        role.RoleBaseModel.physical = data.physical;

        // 角色等级数据
        role.upgrade(data.lv);

        // 角色职业数据
        role.RoleJobModel.id = data.jobId;

        // 角色基础属性绑定到界面上显示
        VM.add(role.RoleModel.vm, "Role");
        // 角色等级属性绑定到界面上显示
        VM.add(role.RoleLevelModel.vm, "RoleLevel");
        // 角色初始基础属性绑定到界面上显示
        VM.add(role.RoleBaseModel.vm, "RoleBase");

        // 角色动画显示对象
        role.load();
        role.RoleView.node.parent = oops.gui.game;
        role.RoleView.node.setPosition(0, -300, 0);

        e.AccountModel.role = role;
    }

    /** 设置本地存储的用户标识 */
    private setLocalStorage(uid: number) {
        storage.setUser(uid);
        storage.set("account", uid);
    }
}