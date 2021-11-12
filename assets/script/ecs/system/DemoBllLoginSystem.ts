import { ecs } from "../../core/libs/ECS";
import { DemoBllLoginComp } from "../component/DemoBllLoginComp";
import { Demo } from "../entity/Demo";

/*
 * @Author: dgflash
 * @Date: 2021-11-11 18:11:13
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 11:49:52
 */
export class DemoBllLoginSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DemoBllLoginComp);
    }

    entityEnter(entities: Demo[]): void {
        for (let e of entities) {
            console.log("用户登录", e.DemoBllLogin.playerId);

            // 获取到的玩过数据存储到对应的ECS组件中，提供其它组件使用
            this.requestLoadPlayer(e.DemoBllLogin.playerId)

            e.remove(DemoBllLoginComp);
        }
    }

    update(entities: ecs.Entity[]): void {

    }

    /** 请求角色登录游戏 */
    private requestLoadPlayer(playerId: number) {
        // var params: any = {
        //     playerId: playerId,
        //     serverId: netConfig.lastLoginServer.id,
        //     gmUid: netConfig.dbid,
        //     sessionKey: netConfig.sessionKey,
        // }

        // var onComplete = {
        //     target: this,
        //     callback: (data: any) => {
        //         console.log(data);
        //     }
        // }

        // netChannel.game.req("LoginAction", "loadPlayer", params, onComplete);
    }
}