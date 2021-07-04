import { Component, director, EventTouch, Node, _decorator } from "cc";

const { ccclass, property, menu } = _decorator;

@ccclass("ButtonSimple")
@menu('ui/button/ButtonSimple')
export default class ButtonSimple extends Component {
    @property({
        tooltip: "是否只能触发一次"
    })
    private once: boolean = false;

    @property({
        tooltip: "每次触发间隔"
    })
    private interval: number = 500;

    private touchCount = 0;
    private touchtEndTime = 0;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchtStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /** 触摸开始 */
    protected onTouchtStart(event: EventTouch) { }

    /** 触摸结束 */
    protected onTouchEnd(event: EventTouch) {
        if (this.once) {
            if (this.touchCount > 0) {
                event.propagationStopped = true;
                return;
            }
            this.touchCount++;
        }

        // 防连点500毫秒出发一次事件
        if (this.touchtEndTime && director.getTotalTime() - this.touchtEndTime < this.interval) {
            event.propagationStopped = true;
        }
        else {
            this.touchtEndTime = director.getTotalTime();
        }
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchtStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
