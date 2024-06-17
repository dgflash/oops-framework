import { Vec3 } from "cc";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { DogViewComp } from "./view/DogViewComp";
import { ViewUtil } from "../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { MoveToComp } from "../common/ecs/position/MoveTo";
import { DogModelBaseComp } from "./model/DogModelBaseComp";
import { Node } from "cc";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { v3 } from "cc";
import { RigidBody } from "cc";
import { math } from "cc";

@ecs.register('Dog')
export class Dog extends ecs.Entity {


    //数据层
    DogModelBase!: DogModelBaseComp;


    //业务层


    //视图层
    DogView!: DogViewComp;

    static CreateEntity(data: { name: string }) {
        let ent = ecs.getEntity<Dog>(Dog);
        ent.DogModelBase.name = data.name


        ent.load(oops.game.root, v3(math.randomRange(-3, 3), 10, -3))
    }


    protected init() {
        this.addComponents<ecs.Comp>(
            DogModelBaseComp,
        )
    }


    /**
     * 跟随手指
     * @param w_pos 世界坐标
     */
    followFinger(w_pos: Vec3) {
        this.DogView.node.setWorldPosition(w_pos)
    }

    load(parent: Node, pos: Vec3 = Vec3.ZERO) {
        // let node = ViewUtil.createPrefabNode('game/combine/prefab/dog/dog');
        let node = ViewUtil.createPrefabNode('game/slot/prefab/bitcoin');
        let mv = node.getComponent(DogViewComp)

        node.parent = parent;
        node.setPosition(pos);
        node.active = true

        let rg = node.getComponent(RigidBody)
        if (rg) {
            rg.useCCD = true;
        }
        this.add(mv!);

    }

    destroy(): void {
        this.remove(DogViewComp);
        super.destroy();
    }
}


