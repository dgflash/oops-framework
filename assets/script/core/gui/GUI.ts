/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-04 17:32:16
 */
import { Camera, Component, ResolutionPolicy, UITransform, view, _decorator } from "cc";
import { Logger } from "../common/log/Logger";

const { ccclass, menu } = _decorator;

/** 引擎对外接口 */
@ccclass('GUI')
export class GUI extends Component {
    /** 界面层矩形信息组件 */
    public transform!: UITransform;
    public camera!: Camera;

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
        var s = view.getFrameSize();
        var rw = s.width;
        var rh = s.height;
        var finalW = rw;
        var finalH = rh;

        if ((rw / rh) > (dr.width / dr.height)) {
            // 如果更长，则用定高
            finalH = dr.height;
            finalW = finalH * rw / rh;
        }
        else {
            // 如果更短，则用定宽
            finalW = dr.width;
            finalH = finalW * rh / rw;
        }

        // 手工修改canvas和设计分辨率，这样反复调用也能生效。
        view.setDesignResolutionSize(finalW, finalH, ResolutionPolicy.UNKNOWN);
        this.transform!.width = finalW;
        this.transform!.height = finalH;

        Logger.trace(dr, "设计尺寸");
        Logger.trace(s, "屏幕尺寸");
    }
}
