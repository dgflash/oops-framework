/*
 * @Author: dgflash
 * @Date: 2022-06-02 09:38:48
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-02 14:26:35
 */

import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TablePromptWindow {
    static TableName: string = "PromptWindow";

    private data: any;

    init(id: number, id1: number, id2: number) {
        var table = JsonUtil.get(TablePromptWindow.TableName);
        this.data = table[id][id1][id2];
        this.id = id;
        this.id1 = id1;
        this.id2 = id2;
    }

    id: number = 0;
    id1: number = 0;
    id2: number = 0;

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
