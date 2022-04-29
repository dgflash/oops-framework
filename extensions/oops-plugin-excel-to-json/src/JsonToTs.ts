const fs = require('fs')

export async function createTs(name: string, fieldType: any, data: any, ts: string) {
    var field = "";

    for (var id in data) {
        var d = data[id];

        for (var key in d) {
            field += `
    get ${key}(): ${fieldType[key]} {
        return this.data.${key};
    }`;
        }
        break;
    }

    var script = `
import { JsonUtil } from "../../../core/utils/JsonUtil";

export class Table${name} {
    static TableName: string = "${name}";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(Table${name}.TableName);
        this.data = table[id];
        this.id = id;
    }

    id: number = 0;
${field}
}
    `;

    await fs.writeFileSync(`${ts + "\\Table" + name}.ts`, script);
}