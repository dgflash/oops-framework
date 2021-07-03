import { EventTouch, _decorator } from "cc";
import ButtonEffect from "./ButtonEffect";

const { ccclass, property, menu } = _decorator;

@ccclass("ButtonTouchLong")
@menu('ui/button/ButtonTouchLong')
export class ButtonTouchLong extends ButtonEffect {
    @property({
        tooltip: "长按时间（秒）"
    })
    time: number = 1;

    protected _passTime = 0;
    protected _isTouchLong: boolean = true;
    protected _event: EventTouch | null = null;
    public onLongTouchCallback!: Function | null;

    onLoad() {
        this._isTouchLong = false;
        super.onLoad();
    }

    /** 触摸开始 */
    onTouchtStart(event: EventTouch) {
        this._event = event;
        this._passTime = 0;
        super.onTouchtStart(event);
    }

    /** 触摸结束 */
    onTouchEnd(event: EventTouch) {
        if (this._passTime > this.time) {
            event.propagationStopped = true;
        }
        this._event = null;
        this._passTime = 0;
        this._isTouchLong = false;

        super.onTouchEnd(event);
    }

    removeTouchLong() {
        this._event = null;
        this._isTouchLong = false;
    }

    /** 引擎更新事件 */
    update(dt: number) {
        if (this._event && !this._isTouchLong) {
            this._passTime += dt;

            if (this._passTime >= this.time) {
                this._isTouchLong = true;
                if (this.onLongTouchCallback)
                    this.onLongTouchCallback(this._event);
                this.removeTouchLong();
            }
        }
    }
}
