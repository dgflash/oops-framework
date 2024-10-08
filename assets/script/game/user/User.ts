
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { ecs } from '../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { GameEvent } from '../common/config/GameEvent';
import { UserNetDataComp, UserNetDataSystem } from './bll/UserNetData';
import { UserModelComp } from './model/UserModelComp';

@ecs.register('User')
export class User extends ecs.Entity {
    UserModel!: UserModelComp
    UserNetData!: UserNetDataComp


    protected init() {
        this.addComponents<ecs.Comp>(UserModelComp)
        this.addEvent();
    }

    destroy(): void {
        this.removeEvent();
        super.destroy();
    }

    /** 添加全局消息事件 */
    private addEvent() {
        oops.message.on(GameEvent.LoadingSuccess, this.onHandler, this);
    }

    /** 移除全局消息事件 */
    private removeEvent() {
        oops.message.off(GameEvent.LoadingSuccess, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.LoadingSuccess:
                this.addComponents<ecs.Comp>(UserNetDataComp)
                break;
        }
    }

}

// export class EcsUserSystem extends ecs.System {
//     constructor() {
//         super();

//         this.add(new UserNetDataSystem());
//     }
// }
