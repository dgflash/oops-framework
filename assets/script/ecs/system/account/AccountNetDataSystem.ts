/*
 * @Author: dgflash
 * @Date: 2021-11-24 15:51:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-24 15:20:41
 */
import { log } from "cc";
import { ecs } from "../../../core/libs/ECS";
import { netChannel } from "../../../game/net/NetChannelManager";
import { netConfig } from "../../../game/net/NetConfig";
import { AccountModelComp } from "../../component/account/AccountModelComp";
import { AccountNetDataComp } from "../../component/account/AccountNetDataComp";
import { AccountEntity } from "../../entity/Account";

/** 请求玩家游戏数据 */
export class AccountNetDataSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountNetDataComp, AccountModelComp);
    }

    entityEnter(entities: AccountEntity[]): void {
        for (let e of entities) {
            // 请求角色登录游戏
            var params: any = {
                playerId: netConfig.dbid,
                sessionKey: netConfig.sessionKey,
            }

            let onComplete = {
                target: this,
                callback: (data: any) => {
                    log("帐号数据", data);
                }
            }

            netChannel.game.req("LoginAction", "loadPlayer", params, onComplete);

            e.remove(AccountNetDataComp);
        }
    }
}