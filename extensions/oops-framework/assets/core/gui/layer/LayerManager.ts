import { Camera, Layers, Node, warn, Widget } from "cc";
import { GUI } from "../GUI";
import { UICallbacks } from "./Defines";
import { DelegateComponent } from "./DelegateComponent";
import { LayerDialog } from "./LayerDialog";
import { LayerNotify } from "./LayerNotify";
import { LayerPopUp } from "./LayerPopup";
import { LayerUI } from "./LayerUI";
import { UIMap } from "./UIMap";

/** 界面层类型 */
export enum LayerType {
    /** 游戏层 */
    Game = "LayerGame",
    /** 主界面层 */
    UI = "LayerUI",
    /** 弹窗层 */
    PopUp = "LayerPopUp",
    /** 模式窗口层 */
    Dialog = "LayerDialog",
    /** 弹窗层 */
    Alert = "LayerAlert",
    /** 通知信息层 */
    Notify = "LayerNotify",
    /** 新手引导层 */
    Guide = "LayerGuide"
}

/** UI配置结构体 */
export interface UIConfig {
    /** 远程包名 */
    bundle?: string;
    /** 窗口层级 */
    layer: LayerType;
    /** 预制资源相对路径 */
    prefab: string;
}

export class LayerManager {
    /** 界面根节点 */
    public root!: Node;
    /** 界面摄像机 */
    public camera!: Camera;
    /** 游戏界面特效层 */
    public game!: Node;
    /** 新手引导层 */
    public guide!: Node;
    /** 界面地图 */
    public uiMap!: UIMap;

    /** 界面层 */
    private ui!: LayerUI;
    /** 弹窗层 */
    private popup!: LayerPopUp;
    /** 只能弹出一个的弹窗 */
    private dialog!: LayerDialog;
    /** 游戏系统提示弹窗（优先显示） */
    private alert!: LayerDialog;
    /** 消息提示控制器，请使用show方法来显示 */
    private notify!: LayerNotify;
    /** UI配置 */
    private configs: { [key: number]: UIConfig } = {};

    /** 是否为竖屏显示 */
    public get portrait() {
        return this.root.getComponent(GUI)!.portrait;
    }

    /**
     * 初始化所有UI的配置对象
     * @param configs 配置对象
     */
    public init(configs: { [key: number]: UIConfig }): void {
        this.configs = configs;
    }

    /**
     * 渐隐飘过提示
     * @param content 文本表示
     * @param useI18n 是否使用多语言
     */
    public toast(content: string, useI18n: boolean = false) {
        this.notify.show(content, useI18n)
    }

    /**
     * 设置界面配置
     * @param uiId   要设置的界面id
     * @param config 要设置的配置
     */
    public setConfig(uiId: number, config: UIConfig): void {
        this.configs[uiId] = config;
    }

    /** 设置界面地图配置 */
    public setUIMap(data: any) {
        if (this.uiMap == null) {
            this.uiMap = new UIMap();
        }
        this.uiMap.init(this, data);
    }

    /**
     * 同步打开一个窗口
     * @param uiId          窗口唯一编号
     * @param uiArgs        窗口参数
     * @param callbacks     回调对象
     * @returns 
     */
    public open(uiId: number, uiArgs: any = null, callbacks?: UICallbacks): void {
        var config = this.configs[uiId];
        if (config == null) {
            warn(`打开编号为【${uiId}】的界面失败，配置信息不存在`);
            return;
        }

        switch (config.layer) {
            case LayerType.UI:
                this.ui.add(config, uiArgs, callbacks);
                break;
            case LayerType.PopUp:
                this.popup.add(config, uiArgs, callbacks);
                break;
            case LayerType.Dialog:
                this.dialog.add(config, uiArgs, callbacks);
                break;
            case LayerType.Alert:
                this.alert.add(config, uiArgs, callbacks);
                break;
        }
    }

    /**
     * 异步打开一个窗口
     * @param uiId          窗口唯一编号
     * @param uiArgs        窗口参数
     * @returns 
     */
    public async openAsync(uiId: number, uiArgs: any = null): Promise<Node | null> {
        return new Promise<Node | null>((resolve, reject) => {
            var callbacks: UICallbacks = {
                onAdded: (node: Node, params: any) => {
                    resolve(node)
                }
            };
            this.open(uiId, uiArgs, callbacks);
        });
    }

    /** 缓存中是否存在指定标识的窗口 */
    public has(uiId: number) {
        var config = this.configs[uiId];
        if (config == null) {
            warn(`编号为【${uiId}】的界面失败，配置信息不存在`);
            return;
        }

        var result = false;
        switch (config.layer) {
            case LayerType.UI:
                result = this.ui.has(config.prefab);
                break;
            case LayerType.PopUp:
                result = this.popup.has(config.prefab);
                break;
            case LayerType.Dialog:
                result = this.dialog.has(config.prefab);
                break;
            case LayerType.Alert:
                result = this.alert.has(config.prefab);
                break;
        }
        return result;
    }

    public remove(uiId: number, isDestroy = true) {
        var config = this.configs[uiId];
        if (config == null) {
            warn(`删除编号为【${uiId}】的界面失败，配置信息不存在`);
            return;
        }

        switch (config.layer) {
            case LayerType.UI:
                this.ui.remove(config.prefab, isDestroy);
                break;
            case LayerType.PopUp:
                this.popup.remove(config.prefab, isDestroy);
                break;
            case LayerType.Dialog:
                this.dialog.remove(config.prefab, isDestroy);
                break;
            case LayerType.Alert:
                this.alert.remove(config.prefab, isDestroy);
                break;
        }
    }

    /** 删除一个通过this框架添加进来的节点 */
    public removeByNode(node: Node, isDestroy: boolean = false) {
        if (node instanceof Node) {
            let comp = node.getComponent(DelegateComponent);
            if (comp && comp.viewParams) {
                // @ts-ignore 注：不对外使用
                (node.parent as LayerUI).removeByUuid(comp.viewParams.uuid, isDestroy);
            }
            else {
                warn(`当前删除的node不是通过界面管理器添加到舞台上`);
                node.destroy();
            }
            return;
        }
    }

    /** 清除所有窗口 */
    public clear(isDestroy: boolean = false) {
        this.ui.clear(isDestroy);
        this.popup.clear(isDestroy);
        this.dialog.clear(isDestroy);
        this.alert.clear(isDestroy);
    }

    public constructor(root: Node) {
        this.root = root;
        this.camera = this.root.getComponentInChildren(Camera)!;

        this.game = this.create_node(LayerType.Game);

        this.ui = new LayerUI(LayerType.UI);
        this.popup = new LayerPopUp(LayerType.PopUp);
        this.dialog = new LayerDialog(LayerType.Dialog);
        this.alert = new LayerDialog(LayerType.Alert);
        this.notify = new LayerNotify(LayerType.Notify);

        this.guide = this.create_node(LayerType.Guide);

        root.addChild(this.game);
        root.addChild(this.ui);
        root.addChild(this.popup);
        root.addChild(this.dialog);
        root.addChild(this.alert);
        root.addChild(this.notify);
        root.addChild(this.guide);
    }

    private create_node(name: string) {
        var node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        var w: Widget = node.addComponent(Widget);
        w.isAlignLeft = w.isAlignRight = w.isAlignTop = w.isAlignBottom = true;
        w.left = w.right = w.top = w.bottom = 0;
        w.alignMode = 2;
        w.enabled = true;
        return node;
    }
}