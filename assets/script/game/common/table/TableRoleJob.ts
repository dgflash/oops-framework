/*
 * @Author: dgflash
 * @Date: 2022-06-02 09:38:48
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:53:26
 */

import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableRoleJob {
    static TableName: string = "RoleJob";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableRoleJob.TableName);
        this.data = table[id];
        this.id = id;
    }

    id: number = 0;

    get armsName(): string {
        return this.data.armsName;
    }
    get weaponType(): any {
        return this.data.weaponType;
    }
    get power(): number {
        return this.data.power;
    }
    get agile(): number {
        return this.data.agile;
    }
}
    