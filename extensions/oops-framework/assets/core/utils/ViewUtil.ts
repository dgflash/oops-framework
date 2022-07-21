/*
 * @Author: dgflash
 * @Date: 2021-08-16 09:34:56
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-21 17:42:14
 */
import { Animation, AnimationClip, EventTouch, instantiate, Node, Prefab, Size, UITransform, v3, Vec3 } from "cc";
import { resLoader } from "../common/loader/ResLoader";

export class ViewUtil {
    /**
     * 把Node当前的节点树结构根据Node命名转成一个js对象,重名的组件会覆盖，
     * Node的name不应该包含空格键，否则将跳过
     * @param parent 被遍历的Node组件
     * @param obj    绑定的js对象 (可选)
     * @param level  遍历层次数 (可选)选择合适的层级可以提升效率
     */
    public static nodeTreeInfoLite(parent: Node, obj?: Map<string, Node>): Map<string, Node> | null {
        let map: Map<string, Node> = obj || new Map();
        let items = parent.children;
        for (let i = 0; i < items.length; i++) {
            let _node = items[i];
            if (_node.name.indexOf(" ") < 0) {
                map.set(_node.name, _node);
            }
            ViewUtil.nodeTreeInfoLite(_node, map);
        }
        return map;
    }

    /**
     * 正则搜索节点名字,符合条件的节点将会返回
     * @param reg     正则表达式
     * @param parent  要搜索的父节点
     * @param _nodes  返回的数组（可选）
     */
    public static findNodes(reg: RegExp, parent: Node, _nodes?: Array<Node>): Array<Node> {
        let nodes: Array<Node> = _nodes || [];
        let items: Array<Node> = parent.children;
        for (let i = 0; i < items.length; i++) {
            let _name: string = items[i].name;
            if (reg.test(_name)) {
                nodes.push(items[i]);
            }
            ViewUtil.findNodes(reg, items[i], nodes);
        }
        return nodes;
    };

    /** 节点之间坐标互转 */
    public static calculateASpaceToBSpacePos(a: Node, b: Node, aPos: Vec3): Vec3 {
        var world: Vec3 = a.getComponent(UITransform)!.convertToWorldSpaceAR(aPos);
        var space: Vec3 = b.getComponent(UITransform)!.convertToNodeSpaceAR(world);
        return space;
    }

    /** 屏幕转空间坐标 */
    public static calculateScreenPosToSpacePos(event: EventTouch, space: Node): Vec3 {
        let uil = event.getUILocation();
        let worldPos: Vec3 = v3(uil.x, uil.y);
        let mapPos: Vec3 = space.getComponent(UITransform)!.convertToNodeSpaceAR(worldPos);
        return mapPos;
    }

    /** 显示对象等比缩放 */
    public static uniformScale(targetWidth: number, targetHeight: number, defaultWidth: number, defaultHeight: number) {
        var widthRatio = defaultWidth / targetWidth;
        var heightRatio = defaultHeight / targetHeight;
        var ratio;
        widthRatio < heightRatio ? ratio = widthRatio : ratio = heightRatio;
        var size = new Size(Math.floor(targetWidth * ratio), Math.floor(targetHeight * ratio));
        return size;
    }

    /** 创建预制节点 */
    public static createPrefabNode(name: string): Node {
        var p: Prefab = resLoader.get(name, Prefab)!;
        var n = instantiate(p);
        return n;
    }

    /** 加载预制并创建预制节点 */
    public static createPrefabNodeAsync(path: string): Promise<Node> {
        return new Promise(async (resolve, reject) => {
            resLoader.load(path, Prefab, (err: Error | null, content: Prefab) => {
                if (err) {
                    console.error(`名为【${path}】的资源加载失败`);
                    return;
                }

                var node = this.createPrefabNode(path);
                resolve(node);
            });
        });
    }

    /** 加载预制节点 */
    public static loadPrefabNode(path: string, callback: Function) {
        resLoader.load(path, Prefab, (err: Error | null, content: Prefab) => {
            if (err) {
                console.error(`名为【${path}】的资源加载失败`);
                return;
            }

            var node = this.createPrefabNode(path);
            callback(node);
        });
    }

    /** 添加节点动画 */
    public static addNodeAnimation(name: string, node: Node, onlyOne: boolean = true, isDefaultClip: boolean = false) {
        if (!node || !node.isValid) {
            return;
        }

        var anim = node.getComponent(Animation);
        if (anim == null) {
            anim = node.addComponent(Animation);
        }

        var clip = resLoader.get(name, AnimationClip) as AnimationClip;
        if (!clip) {
            return;
        }
        if (onlyOne && anim.getState(clip!.name) && anim.getState(clip!.name).isPlaying) {
            return;
        }

        if (isDefaultClip) {
            anim.defaultClip = clip;
            anim!.play();
            return;
        }

        // 播放完成后恢复播放默认动画
        anim.once(Animation.EventType.FINISHED, () => {
            if (anim!.defaultClip) {
                anim!.play();
            }
        }, this);

        if (anim.getState(clip!.name)) {
            anim.play(clip!.name);
            return
        }
        anim.createState(clip, clip!.name);
        anim.play(clip!.name);
    }
}