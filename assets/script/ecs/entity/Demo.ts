/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 12:02:25
 */

import { find, Node } from "cc";
import { ecs } from "../../core/libs/ECS";
import { JsonUtil } from "../../core/utils/JsonUtil";
import { DemoBllLoginComp } from "../component/DemoBllLoginComp";
import { DemoModelTableComp } from "../component/DemoModelTableComp";
import { DemoViewComp } from "../component/DemoViewComp";

export class Demo extends ecs.Entity {
    DemoModelTable!: DemoModelTableComp;
    DemoBllLogin!: DemoBllLoginComp;
    DemoView!: DemoViewComp;

    /** 加载模块相关资源 */
    static load(callback: Function) {
        // 模块静态数据
        JsonUtil.load(DemoModelTableComp.TableName, callback);
    }

    constructor() {
        super();
        this.addComponents(DemoModelTableComp);
    }

    /** 初始化数据 */
    init(id: number) {
        var mt = this.get(DemoModelTableComp);
        mt.init(id);
        console.log("静态数据", mt.describe);
    }

    /** 显示视图 */
    show(parent: Node) {
        var d = find("gui/ecs_demo", parent)!;
        var dc = d.getComponent(DemoViewComp)!;
        this.add(dc);
    }

    /** 登录逻辑 */
    login() {
        var dbl = this.add(DemoBllLoginComp);
        dbl.playerId = 123456789;
    }
}