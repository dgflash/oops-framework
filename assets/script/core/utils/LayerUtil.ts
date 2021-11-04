import { Node } from "cc";

export class LayerItem {
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
 * 为了方便使用，将编辑器中的层级定义到代码。如果编辑器中有修改，确保同步到这里。
 */
export class LayerUtil {
    public static MAP = new LayerItem(0, 'MAP');
    public static AVATAR = new LayerItem(1, 'AVATAR');

    public static IGNORE_RAYCAST = new LayerItem(20, 'IGNORE_RAYCAST');
    public static GIZMOS = new LayerItem(21, 'GIZMOS');
    public static EDITOR = new LayerItem(22, 'EDITOR');
    public static UI_3D = new LayerItem(23, 'UI_3D');
    public static SCENE_GIZMO = new LayerItem(24, 'SCENE_GIZMO');
    public static UI_2D = new LayerItem(25, 'UI_2D');
    public static PROFILTER = new LayerItem(28, 'PROFILTER');
    public static DEFAULT = new LayerItem(30, 'DEFAULT');

    public static setNodeLayer(item: LayerItem, node: Node) {
        node.layer = item.mask;
        node.children.forEach(n => {
            n.layer = item.mask;
            LayerUtil.setNodeLayer(item, n);
        });
    }
}

