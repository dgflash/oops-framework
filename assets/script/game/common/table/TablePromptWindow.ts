
import { JsonUtil } from "../../../core/utils/JsonUtil";

export class TablePromptWindow {
    static TableName: string = "PromptWindow";

    private data: any;

    init(id: number, id_double: number) {
        var table = JsonUtil.get(TablePromptWindow.TableName);
        this.data = table[id][id_double];
        this.id = id;        this.id_double = id_double;
    }

    id: number = 0;    id_double: number = 0;

    get title(): string {
        return this.data.title;
    }
    get describe(): string {
        return this.data.describe;
    }
    get array(): any {
        return this.data.array;
    }
    get hp(): number {
        return this.data.hp;
    }
}
    