/*
 * @Author: dgflash
 * @Date: 2022-07-21 17:30:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-21 17:30:59
 */
import { Node } from "cc";

export class GroupItem {
    private _value: number;
    public get value(): number {
        return this._value;
    }

    private _name!: string;
    public get name(): string {
        return this._name;
    }

    public get mask(): number {
        return 1 << this._value;
    }

    constructor(value: number, name: string) {
        this._value = value;
        this._name = name;
    }
}

/***
 * 为了方便使用，将编辑器中的物理分组定义到代码。如果编辑器中有修改，确保同步到这里。
 */
export class PhysicsUtil {
    public static DEFAULT = new GroupItem(0, 'DEFAULT');
    /** 能通过屏幕触摸中发出的射线检查到的游戏对象 */
    public static GAME_OBJECT_SELECT = new GroupItem(1, 'GAME_OBJECT_SELECT');
    /** 玩家自己 */
    public static GAME_OWNER = new GroupItem(2, 'GAME_OWNER');

    public static setNodeLayer(item: GroupItem, node: Node) {
        node.layer = item.mask;
        node.children.forEach(n => {
            n.layer = item.mask;
            PhysicsUtil.setNodeLayer(item, n);
        });
    }
}