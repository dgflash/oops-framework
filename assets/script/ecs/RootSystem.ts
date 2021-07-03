import { ecs } from "../core/libs/ECS";

export class RootSystem extends ecs.RootSystem {
    constructor() {
        super();

        // this.add(new AutoCreateEnemySystem());
        // this.add(new AutoMoveToSystem());
        // this.add(new EcsMgobeSystem());
        // this.add(new EcsInputSystem());
        // this.add(new EcsRotationSystem());
        // this.add(new EcsPositionSystem());
    }
}
