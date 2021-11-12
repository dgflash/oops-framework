

/*
 * @Author: dgflash
 * @Date: 2021-11-12 10:02:31
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-12 10:47:38
 */

import { ecs } from "../../core/libs/ECS";
import { JsonUtil } from "../../core/utils/JsonUtil";

/** 静态数据表组件 */
@ecs.register('DemoModelTable')
export class DemoModelTableComp extends ecs.Comp {
    static TableName: string = "NetCode";

    /** 静态数据表 */
    table: any;
    /** 静态表中一条数据 */
    data: any;

    init(id: number) {
        var table = JsonUtil.get(DemoModelTableComp.TableName);
        this.data = table[id];
    }

    get describe(): string {
        return this.data.describe;
    }

    reset() {

    }
}