import { Component } from "cc";
import { EventDispatcher } from "../event/EventDispatcher";

export const guid = function () {
    let guid: string = "";
    for (let i = 1; i <= 32; i++) {
        let n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}

export class TimerManager extends EventDispatcher {
    private static times: any = {};
    private schedules: any = {};
    private scheduleCount: number = 1;

    private initTime: number = (new Date()).getTime();      // 当前游戏进入的时间毫秒值
    private component: Component;

    // 服务器时间与本地时间同步
    private serverTime: number = 0;

    constructor(component: Component) {
        super();
        this.component = component;
        this.schedule(this.onUpdate.bind(this), 1);
    }

    /**
     * 服务器时间与本地时间同步
     * @param val 
     */
    public setServerTime(val?: number): number {
        if (val) {
            this.serverTime = val;
        }
        return this.serverTime;
    }

    /**
     * 格式化日期显示 format= "yyyy-MM-dd hh:mm:ss"; 
     * @param format 
     * @param date 
     */
    public format(format: string, date: Date): string {
        let o: any = {
            "M+": date.getMonth() + 1,                      // month 
            "d+": date.getDate(),                           // day 
            "h+": date.getHours(),                          // hour 
            "m+": date.getMinutes(),                        // minute 
            "s+": date.getSeconds(),                        // second 
            "q+": Math.floor((date.getMonth() + 3) / 3),    // quarter 
            "S": date.getMilliseconds()                     // millisecond 
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (let k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }

    /** 获取游戏开始到现在逝去的时间 */
    public getTime(): number {
        return this.getLocalTime() - this.initTime;
    }

    /** 获取本地时间刻度 */
    public getLocalTime(): number {
        return Date.now();
    }

    /**
     * 注册一个固定间隔时间的触发器
     * @param callback  触发时的回调方法
     * @param interval  固定间隔触发时间
     * @returns uuid
     */
    public schedule(callback: Function, interval: number): string {
        let uuid = `schedule_${this.scheduleCount++}`
        this.schedules[uuid] = callback;
        this.component.schedule(callback, interval);
        return uuid;
    }

    /**
     * 注册一个只触发一次的延时的触发器
     * @param callback  触发时的回调方法
     * @param delay     延时触发时间
     * @returns uuid
     */
    public scheduleOnce(callback: Function, delay: number = 0): string {
        let uuid = `scheduleOnce_${this.scheduleCount++}`;
        this.schedules[uuid] = callback;
        this.component.scheduleOnce(() => {
            let cb = this.schedules[uuid];
            if (cb) {
                cb();
            }
            this.unschedule(uuid);
        }, Math.max(delay, 0));
        return uuid;
    }

    /**
     * 删除一个时间触发器
     * @param uuid  唯一标识
     */
    public unschedule(uuid: string) {
        let cb = this.schedules[uuid];
        if (cb) {
            this.component.unschedule(cb);
            delete this.schedules[uuid];
        }
    }

    /** 删除所有时间触发器  */
    public unscheduleAll() {
        for (let k in this.schedules) {
            this.component.unschedule(this.schedules[k]);
        }
        this.schedules = {};
    }

    private onUpdate(dt: number) {
        // 后台管理倒计时完成事件
        for (let key in TimerManager.times) {
            let data = TimerManager.times[key];
            if (data.object[data.field] > 0) {
                data.object[data.field]--;

                if (data.object[data.field] == 0) {
                    this.onTimerComplete(data);
                }
                else {                                                          // 修改是否完成状态
                    if (data.onSecond) {
                        data.onSecond.call(data.object);                        // 触发每秒回调事件  
                    }
                }
            }
        }
    }

    /** 触发倒计时完成事件 */
    private onTimerComplete(data: any) {
        if (data.onComplete) data.onComplete.call(data.object);
        if (data.event) this.dispatchEvent(data.event);
    }

    /** 在指定对象上注册一个倒计时的回调管理器 */
    public register(object: any, field: string, onSecond: Function, onComplete: Function) {
        let data: any = {};
        data.id = guid();
        data.object = object;                                   // 管理对象
        data.field = field;                                     // 时间字段
        data.onSecond = onSecond;                               // 每秒事件
        data.onComplete = onComplete;                           // 倒计时完成事件
        TimerManager.times[data.id] = data;
        return data.id;
    }

    /** 在指定对象上注销一个倒计时的回调管理器 */
    public unRegister(id: string) {
        if (TimerManager.times[id])
            delete TimerManager.times[id];
    }

    /** 游戏最小化时记录时间数据 */
    public save() {
        for (let key in TimerManager.times) {
            TimerManager.times[key].startTime = this.getTime();
        }
    }

    /** 游戏最大化时回复时间数据 */
    public load() {
        for (let key in TimerManager.times) {
            let interval = Math.floor((this.getTime() - (TimerManager.times[key].startTime || this.getTime())) / 1000);
            let data = TimerManager.times[key];
            data.object[data.field] = data.object[data.field] - interval;
            if (data.object[data.field] < 0) {
                data.object[data.field] = 0;
                this.onTimerComplete(data);
            }
            TimerManager.times[key].startTime = null;
        }
    }
}

/** 定时跳动组件 */
export class Timer {
    public callback: Function | null = null;

    private _elapsedTime: number = 0;

    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    private _step: number = 0;
    /** 触发间隔时间（秒） */
    get step(): number {
        return this._step;
    }
    set step(step: number) {
        this._step = step;                     // 每次修改时间
        this._elapsedTime = 0;                 // 逝去时间
    }

    public get progress(): number {
        return this._elapsedTime / this._step;
    }

    constructor(step: number = 0) {
        this.step = step;
    }

    public update(dt: number) {
        this._elapsedTime += dt;

        if (this._elapsedTime >= this._step) {
            this._elapsedTime -= this._step;
            this.callback?.call(this);
            return true;
        }
        return false;
    }

    public reset() {
        this._elapsedTime = 0;
    }
}