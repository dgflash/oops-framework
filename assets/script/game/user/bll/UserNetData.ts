import { v3 } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { http } from "../../common/net/HttpManager";
import { Dog } from "../../dog/Dog";
import { User } from "../User";
import { NUser } from "../model/UserConstant";
import { UserModelComp } from "../model/UserModelComp";
import { setInterval } from "timers";
import { find } from "cc";
import { RigidBody } from "cc";
import { Vec3 } from "cc";
import { tween } from "cc";

@ecs.register('UserNetData')
export class UserNetDataComp extends ecs.Comp {
    loginData!: NUser.IUserLoginData

    reset(): void {

    }
}

@ecs.register('User')
export class UserNetDataSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {

    filter(): ecs.IMatcher {
        return ecs.allOf(UserNetDataComp, UserModelComp)
    }

    entityEnter(entity: User): void {
        this.login(entity);
    }

    async login(entity: User) {
        let result = await http.getAsync('/login', {
            account: 'tzj',
            password: 't123456',
        })

        oops.log.logNet(result, 'login-result:')

        if (result.isSucc) {
            entity.UserNetData.loginData = result.res;
        }
        this.creatDog()
    }

    async creatDog() {
        let count = 0
        let create = () => {
            count++
            Dog.CreateEntity({
                name: 'dog_' + count,
            })
            if (count < 1000) {
                setTimeout(create, 1000)
            }
        }

        create();

        let v3 = new Vec3(0, 1, -8)
        let d = 2
        let nodePush = find('table/push', oops.game.root)
        let rg = nodePush?.getComponent(RigidBody);
        if (rg) {
            rg.useCCD = true;
        }
        let push = () => {
            v3.z = v3.z > -6 ? -8 : -4;
            tween()
                .target(nodePush)
                .to(2.0, { position: v3 })
                .start()
            setTimeout(() => {
                push();
            }, 2500)
        }
        push();
    }
}


