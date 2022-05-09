/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-09 19:34:22
 */
import { Camera, Component, math, ResolutionPolicy, screen, UITransform, view, _decorator } from "cc";
import { Logger } from "../common/log/Logger";

const { ccclass, menu } = _decorator;

/** 引擎对外接口 */
@ccclass('GUI')
export class GUI extends Component {
    /** 界面层矩形信息组件 */
    transform!: UITransform;
    /** 游戏二维摄像机 */
    camera!: Camera;
    /** 是否为竖屏显示 */
    portrait!: boolean;

    /** 竖屏设计尺寸 */
    private portraitDrz: math.Size = null!;
    /** 横屏设计尺寸 */
    private landscapeDrz: math.Size = null!;

    onLoad() {
        this.init();
    }

    /** 初始化引擎 */
    protected init() {
        this.transform = this.getComponent(UITransform)!;
        this.camera = this.getComponentInChildren(Camera)!;

        if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            this.landscapeDrz = view.getDesignResolutionSize();
            this.portraitDrz = new math.Size(this.landscapeDrz.height, this.landscapeDrz.width);
        }
        else {
            this.portraitDrz = view.getDesignResolutionSize();
            this.landscapeDrz = new math.Size(this.portraitDrz.height, this.portraitDrz.width);
        }

        this.resize();
    }

    resize() {
        let dr;
        if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            dr = this.landscapeDrz;
        }
        else {
            dr = this.portraitDrz
        }

        var s = screen.windowSize;
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