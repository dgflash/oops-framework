/*
 * @Author: dgflash
 * @Date: 2021-12-02 11:08:00
 * @LastEditors: luobao
 * @LastEditTime: 2021-12-13 11:30:15
 */

import { JsonUtil } from "../../../core/utils/JsonUtil";

/** 角色经验数据 */
export class RoleTableLevelUp {
    static TableName: string = "herolvup";

    constructor(key: number) {
        this.init(key);
    }

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