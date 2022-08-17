
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableRoleJob {
    static TableName: string = "RoleJob";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableRoleJob.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 职业名 */
    get armsName(): string {
        return this.data.armsName;
    }
    /** 武器类型 */
    get weaponType(): any {
        return this.data.weaponType;
    }
    /** 力量 */
    get power(): number {
        return this.data.power;
    }
    /** 敏捷 */
    get agile(): number {
        return this.data.agile;
    }
}
    