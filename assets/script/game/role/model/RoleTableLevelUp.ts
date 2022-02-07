/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 17:25:43
 */
import { JsonUtil } from "../../../core/utils/JsonUtil";

/** 角色经验数据（策划Excel导出的Json静态数据） */
export class RoleTableLevelUp {
    static TableName: string = "herolvup";

    /** 静态表中一条数据 */
    private data: any;

    init(key: number) {
        var table = JsonUtil.get(RoleTableLevelUp.TableName);
        if (key == 0)
            key = 1;
        else if (key > 100)
            key = 100;
        this.data = table[key];
        this.key = key;
    }

    /** 键值 */
    key: number = 0;

    /** 升级所需经验 */
    get needexp(): number {
        return this.data.needexp;
    }
    /** 升级成长生命 */
    get hp(): number {
        return this.data.hp;
    }
}