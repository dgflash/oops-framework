/*
 * @Author: dgflash
 * @Date: 2021-10-12 14:00:43
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-14 19:06:51
 */

import { Component, Node, NodePool, Vec3 } from 'cc';
import { ViewUtil } from '../../utils/ViewUtil';

class EffectData extends Component {
    type: string = null!;
}

/** 全局单例特效 */
export class EffectSingleCase {
    private static _instance: EffectSingleCase;
    public static get instance(): EffectSingleCase {
        if (this._instance == null) {
            this._instance = new EffectSingleCase();
        }
        return this._instance;
    }

    private effects: Map<string, NodePool> = new Map();

    /** 
     * 显示预制对象 
     * @param name    预制对象名称
     * @param parent  父节点
     * @param pos     位置
     */
    show(name: string, parent: Node, pos?: Vec3): Node {
        var np = this.effects.get(name);
        if (np == null) {
            np = new NodePool();
            this.effects.set(name, np);
        }

        var node: Node;
        if (np.size() == 0) {
            node = ViewUtil.createPrefabNode(name);
            node.addComponent(EffectData).type = name;
        }
        else {
            node = np.get()!;
        }
        node.parent = parent;
        if (pos) node.position = pos;

        return node;
    }

    /**
     * 回收对象
     * @param name  预制对象名称
     * @param node  节点
     */
    put(node: Node) {
        var name = node.getComponent(EffectData)!.type;
        var np = this.effects.get(name);
        if (np) {
            np.put(node);
        }
    }

    /**
     * 清除对象池数据
     * @param name  参数为空时，清除所有对象池数据;指定名时，清楚指定数据
     */
    clear(name?: string) {
        if (name) {
            var np = this.effects.get(name)!;
            np.clear();
        }
        else {
            this.effects.forEach(np => {
                np.clear();
            });
            this.effects.clear();
        }
    }
}