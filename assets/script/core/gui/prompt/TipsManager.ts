/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-14 18:27:49
 */

import { Node, tween, Vec3 } from "cc";
import { UIID } from "../../../game/common/config/GameUIConfig";
import { oops } from "../../Oops";
import { PopViewParams } from "../layer/Defines";

/** 提示窗口管理 */
class TipsManager {
    private _timeId = ""
    /** 网络恢复 */
    public networkRecovery() {
        if (this._timeId) {
            oops.timer.unschedule(this._timeId);
            this._timeId = "";
        }
        oops.gui.remove(UIID.Netinstable);
    }
    /** 打开网络不稳定提示 */
    public netInstableOpen() {
        if (!oops.gui.has(UIID.Netinstable)) {
            oops.gui.open(UIID.Netinstable);
        }
    }
    public netInstableClose() {
        oops.gui.remove(UIID.Netinstable);
    }
    /** 网络延时 */
    public networkLatency(time: number) {
        if (this._timeId) {
            oops.timer.unschedule(this._timeId);
        }
        this._timeId = oops.timer.scheduleOnce(this.netInstableOpen, time);
    }

    public test(callback?: Function) {
        let operate: any = {
            title: 'common_prompt_title_sys',
            content: "common_prompt_content",
            okWord: 'common_prompt_ok',
            cancelWord: 'common_prompt_cancal',
            okFunc: () => {
                console.log("okFunc");
            },
            cancelFunc: () => {
                console.log("cancelFunc");
            },
            needCancel: true
        };
        oops.gui.open(UIID.Window, operate, this.getPopCommonEffect());
    }

    public alert(content: string, cb?: Function, title?: string, okWord?: string) {
        let operate: any = {
            title: title ? title : 'common_prompt_title_sys',
            content: content,
            okWord: okWord ? okWord : 'common_prompt_ok',
            okFunc: () => {
                cb && cb();
            },
            needCancel: false
        };
        oops.gui.open(UIID.Window, operate, tips.getPopCommonEffect());
    }

    public confirm(content: string, cb: Function, okWord: string = "common_prompt_ok") {
        let operate: any = {
            title: 'common_prompt_title_sys',
            content: content,
            okWord: okWord,
            cancelWord: 'common_prompt_cancal',
            okFunc: () => {
                cb && cb()
            },
            cancelFunc: () => {

            },
            needCancel: true
        };
        oops.gui.open(UIID.Window, operate, tips.getPopCommonEffect());
    }

    /** 弹窗动画 */
    private getPopCommonEffect(callbacks?: PopViewParams) {
        let newCallbacks: PopViewParams = {
            // 节点添加动画
            onAdded: (node, params) => {
                node.setScale(0.1, 0.1, 0.1);

                tween(node)
                    .to(0.2, { scale: new Vec3(1, 1, 1) })
                    .start();
            },
            // 节点删除动画
            onBeforeRemove: (node, next) => {
                tween(node)
                    .to(0.2, { scale: new Vec3(0.1, 0.1, 0.1) })
                    .call(next)
                    .start();
            },
        }

        if (callbacks) {
            if (callbacks && callbacks.onAdded) {
                let onAdded = callbacks.onAdded;
                // @ts-ignore
                callbacks.onAdded = (node: Node, params: any) => {
                    onAdded(node, params);

                    // @ts-ignore
                    newCallbacks.onAdded(node, params);
                };
            }

            if (callbacks && callbacks.onBeforeRemove) {
                let onBeforeRemove = callbacks.onBeforeRemove;
                callbacks.onBeforeRemove = (node, params) => {
                    onBeforeRemove(node, params);

                    // @ts-ignore
                    newCallbacks.onBeforeRemove(node, params);
                };
            }
            return callbacks;
        }
        return newCallbacks;
    }
}

export var tips = new TipsManager();