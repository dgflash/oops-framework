/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-01 13:49:37
 */

import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { GameEvent } from "../common/config/GameEvent";
import { AccountNetDataComp, AccountNetDataSystem } from "./bll/AccountNetData";
import { AccountModelComp } from "./model/AccountModelComp";

/**
 * 账号模块
 * 1、连接游戏服务器
 * 2、登录玩家帐号，获取玩家信息
 * 3、断线重连接
 */
@ecs.register('Account')
export class Account extends ecs.Entity {
    AccountModel!: AccountModelComp;
    AccountNetData!: AccountNetDataComp;

    protected init() {
        this.addComponents<ecs.Comp>(AccountModelComp);
        this.addEvent();
    }

    destroy(): void {
        this.removeEvent();
        super.destroy();
    }

    /** 添加全局消息事件 */
    private addEvent() {
        oops.message.on(GameEvent.GameServerConnected, this.onHandler, this);
    }

    /** 移除全局消息事件 */
    private removeEvent() {
        oops.message.off(GameEvent.GameServerConnected, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.GameServerConnected:
                this.getPlayer();
                break;
        }
    }

    /** 连接游戏服务器 */
    connect() {
        // netChannel.gameCreate();
        // netChannel.gameConnect();

        // 无网状态下测试代码，有网络时会通过触发网络连接成功事件对接后续流程
        oops.message.dispatchEvent(GameEvent.GameServerConnected)
    }

    /** 获取玩家信息 */
    getPlayer() {
        this.add(AccountNetDataComp);
    }
}

// export class EcsAccountSystem extends ecs.System {
//     constructor() {
//         super();

//         this.add(new AccountNetDataSystem());
//     }
// }
