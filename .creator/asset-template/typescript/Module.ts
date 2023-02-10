import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";

/** <%Name%> 模块 */
@ecs.register(`<%Name%>`)
export class <%Name%> extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    // <%Name%>Model!: <%Name%>ModelComp;

    /** ---------- 业务层 ---------- */
    // <%Name%>Bll!: <%Name%>BllComp;

    /** ---------- 视图层 ---------- */
    // <%Name%>View!: <%Name%>ViewComp;

    /** 初始添加的数据层组件 */
    protected init() {
        // this.addComponents<ecs.Comp>();
    }

    /** 模块资源释放 */
    destroy() {
        // 注: 自定义释放逻辑，视图层实现 ecs.IComp 接口的 ecs 组件需要手动释放
        super.destroy();
    }
}

/** <%Name%> 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class Ecs<%Name%>System extends ecs.System {
    constructor() {
        super();

        // this.add(new ecs.ComblockSystem());
    }
}
