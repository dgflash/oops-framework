
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TablePromptWindow {
    static TableName: string = "PromptWindow";

    private data: any;

    init(id: number, id1: number, id2: number) {
        var table = JsonUtil.get(TablePromptWindow.TableName);
        this.data = table[id][id1][id2];
        this.id = id;        this.id1 = id1;        this.id2 = id2;
    }

    /** 编号【KEY】 */
    id: number = 0;    /** 双主键【KEY】 */
    id1: number = 0;    /** 双主键【KEY】 */
    id2: number = 0;

    /** 标题 */
    get title(): string {
        return this.data.title;
    }
    /** 描述 */
    get describe(): string {
        return this.data.describe;
    }
    /** 描述 */
    get array(): any {
        return this.data.array;
    }
    /** 生命 */
    get hp(): number {
        return this.data.hp;
    }
}
    