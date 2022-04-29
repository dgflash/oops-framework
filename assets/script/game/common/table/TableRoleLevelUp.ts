
import { JsonUtil } from "../../../core/utils/JsonUtil";

export class TableRoleLevelUp {
    static TableName: string = "RoleLevelUp";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableRoleLevelUp.TableName);
        this.data = table[id];
        this.id = id;
    }

    id: number = 0;

    get needexp(): string {
        return this.data.needexp;
    }
    get hp(): string {
        return this.data.hp;
    }
}
    