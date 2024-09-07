import { _decorator } from "cc";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCComp } from "db://oops-framework/module/common/CCComp";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('<%Name%>Comp')
@ecs.register('<%Name%>', false)
export class <%Name%>Comp extends CCComp {
    /** 视图层逻辑代码分离演示 */
    start() {
        // const entity = this.ent as ecs.Entity;         // ecs.Entity 可转为当前模块的具体实体对象
    }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}