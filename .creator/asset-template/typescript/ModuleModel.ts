import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";

/** 数据层对象 */
@ecs.register('<%Name%>')
export class <%Name%>Comp extends ecs.Comp {
    /** 提供 MVVM 组件使用的数据 */
    private vm: any = {};

    /** 显示数据添加到 MVVM 框架中监视 */
    vmAdd() {
        VM.add(this.vm, "<%Name%>");
    }

    /** 显示数据从 MVVM 框架中移除 */
    vmRemove() {
        VM.remove("<%Name%>");
    }

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        for (var key in this.vm) {
            delete this.vm[key];
        }
    }
}