import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

/** 策划 Excel 导出的 Json 静态数据 */
export class <%Name%> {
    static TableName: string = "配置表文件名";

    /** 静态表中一条数据 */
    private data: any;

    init(id: number) {
        var table = JsonUtil.get(<%Name%>.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 数据唯一编号 */
    id: number = 0;

    /** 数据 */
    // get test(): number {
    //     return this.data.test;
    // }
}