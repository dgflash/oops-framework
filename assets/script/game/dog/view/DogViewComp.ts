import { _decorator } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Dog } from "../Dog";
import { DogViewController } from "./DogViewController";
import VMParent from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/VMParent";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('DogViewComp')
@ecs.register('DogView', false)
export class DogViewComp extends CCVMParentComp {

    /**角色控制器 */
    controller: DogViewController = null!

    /** VM 组件绑定数据 */
    data: any = {
        /** 加载流程中提示文本 */
        text_name: ""
    };

    /** 视图层逻辑代码分离演示 */
    start() {
        // var entity = this.ent as ecs.Entity;         // ecs.Entity 可转为当前模块的具体实体对象
        // this.on(ModuleEvent.Cmd, this.onHandler, this);


        let entity = this.ent as Dog;

        this.controller = this.node.addComponent(DogViewController);
        this.controller.entity = entity

        this.data.text_name = entity.DogModelBase.name


        // this.node.emit("load", entity);
    }

    /** 全局消息逻辑处理 */
    // private onHandler(event: string, args: any) {
    //     switch (event) {
    //         case ModuleEvent.Cmd:
    //             break;
    //     }
    // }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}