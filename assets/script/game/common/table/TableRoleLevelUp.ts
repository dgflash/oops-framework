
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableRoleLevelUp {
    static TableName: string = "RoleLevelUp";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableRoleLevelUp.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 升级所需经验 */
    get needexp(): number {
        return this.data.needexp;
    }
    /** 升级增加生命 */
    get hp(): number {
        return this.data.hp;
    }
}
    