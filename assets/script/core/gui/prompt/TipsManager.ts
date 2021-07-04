import { Node, tween, Vec3 } from "cc";
import { UIID } from "../../../Main";
import { engine } from "../../Engine";
import { PopViewParams } from "../layer/Defines";

class TipsManager {
    private _timeId = ""
    /** 网络恢复 */
    public networkRecovery() {
        if (this._timeId) {
            engine.timer.unschedule(this._timeId);
            this._timeId = "";
        }
        engine.gui.remove(UIID.UILoading_Prompt);
    }
    /** 打开网络不稳定提示 */
    public netInstableOpen() {
        if (!engine.gui.has(UIID.UILoading_Prompt)) {
            engine.gui.open(UIID.UILoading_Prompt);
        }
    }
    public netInstableClose() {
        engine.gui.remove(UIID.UILoading_Prompt);
    }
    /** 网络延时 */
    public networkLatency(time: number) {
        if (this._timeId) {
            engine.timer.unschedule(this._timeId);
        }
        this._timeId = engine.timer.scheduleOnce(this.netInstableOpen, time);
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
        engine.gui.open(UIID.Window, operate, this.getPopCommonEffect());
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