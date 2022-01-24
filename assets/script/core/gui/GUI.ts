/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: H.Joeson
 * @LastEditTime: 2021-12-28 18:22:25
 */
import { Camera, Component, ResolutionPolicy, screen, UITransform, view, _decorator } from "cc";
import { Logger } from "../common/log/Logger";

const { ccclass, menu } = _decorator;

/** 引擎对外接口 */
@ccclass('GUI')
export class GUI extends Component {
    /** 界面层矩形信息组件 */
    public transform!: UITransform;
    /** 游戏二维摄像机 */
    public camera!: Camera;
    /** 是否为竖屏显示 */
    public portrait!: boolean;

    onLoad() {
        this.init();
    }

    /** 初始化引擎 */
    protected init() {
        this.transform = this.getComponent(UITransform)!;
        this.camera = this.getComponentInChildren(Camera)!;
        this.resize();
    }

    public resize() {
        let dr = view.getDesignResolutionSize();
        var s = screen.windowSize//view.getFrameSize();
        var rw = s.width;
        var rh = s.height;
        var finalW = rw;
        var finalH = rh;

        if ((rw / rh) > (dr.width / dr.height)) {
            // 如果更长，则用定高
            finalH = dr.height;
            finalW = finalH * rw / rh;
            this.portrait = false;
        }
        else {
            // 如果更短，则用定宽
            finalW = dr.width;
            finalH = finalW * rh / rw;
            this.portrait = true;
        }

        // 手工修改canvas和设计分辨率，这样反复调用也能生效。
        view.setDesignResolutionSize(finalW, finalH, ResolutionPolicy.UNKNOWN);
        this.transform!.width = finalW;
        this.transform!.height = finalH;

        Logger.trace(dr, "设计尺寸");
        Logger.trace(s, "屏幕尺寸");
    }
}