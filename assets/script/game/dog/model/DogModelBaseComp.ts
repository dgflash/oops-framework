import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";

@ecs.register('DogModelBase')
export class DogModelBaseComp extends ecs.Comp {

    name: string = ''

    /** 提供 VM 组件使用的数据 */
    private vm: any = {};



    vmAdd() {
        VM.add(this.vm, 'Dog')
    }

    vmRemove() {
        VM.remove('Dog')

    }

    reset(): void {
        this.name = ''

        this.vmRemove();

        for (var key in this.vm) {
            this.vm[key] = 0;
        }
    }
}


