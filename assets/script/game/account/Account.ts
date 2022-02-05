/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 15:04:19
 */

import { Message } from "../../core/common/event/MessageManager";
import { ecs } from "../../core/libs/ECS";
import { GameEvent } from "../common/config/GameEvent";
import { AccountNetDataComp } from "./bll/AccountNetData";
import { AccountModelComp } from "./model/AccountModelComp";

/**
 * 账号模块
 * 1、连接游戏服务器
 * 2、登录玩家帐号，获取玩家信息
 * 3、断线重连接
 * 4、加载游戏资源
 * 5、初始化游戏配置数据表
 * 6、初始化游戏初始用到的模块
 */
export class Account extends ecs.Entity {
    AccountModel!: AccountModelComp;
    AccountNetData!: AccountNetDataComp;

    constructor() {
        super();
        this.addComponents<ecs.Comp>(AccountModelComp);

        this.addEvent();
    }

    destroy(isClearData?: boolean): void {
        this.removeEvent();
        super.destroy(isClearData);
    }

    /** 添加全局消息事件 */
    private addEvent() {
        Message.on(GameEvent.GameServerConnected, this.onHandler, this);
    }

    /** 移除全局消息事件 */
    private removeEvent() {
        Message.off(GameEvent.GameServerConnected, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.GameServerConnected:
                this.requestLoadPlayer();
                break;
        }
    }

    /** 连接游戏服务器 */
    connect() {
        // netChannel.gameCreate();
        // netChannel.gameConnect();

        // 无网状态下测试代码，有网络时会通过触发网络连接成功事件对接后续流程
        this.requestLoadPlayer();
    }

    /** 获取玩家信息 */
    requestLoadPlayer() {
        this.add(AccountNetDataComp);
    }
}