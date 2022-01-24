/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 15:04:19
 */

import { ecs } from "../../core/libs/ECS";
import { netChannel } from "../../game/net/NetChannelManager";
import { AccountModelComp } from "../component/account/AccountModelComp";
import { AccountNetDataComp } from "../component/account/AccountNetDataComp";

export class AccountEntity extends ecs.Entity {
    AccountModel!: AccountModelComp;
    AccountNetData!: AccountNetDataComp;
}

/**
 * 账号模块
 * 1、连接游戏服务器
 * 2、登录玩家帐号，获取玩家信息
 * 3、断线重连接
 * 4、加载游戏资源
 * 5、初始化游戏配置数据表
 * 6、初始化游戏初始用到的模块
 */
export class Account {
    public entity: AccountEntity = null!;

    constructor() {
        this.create();
    }

    create() {
        this.entity = ecs.createEntityWithComps(AccountModelComp);
    }

    /** 连接游戏服务器 */
    connect() {
        netChannel.gameCreate();
        netChannel.gameConnect();
    }

    // 登录游戏
    requestLoadPlayer() {
        this.entity.add(AccountNetDataComp);
    }
}