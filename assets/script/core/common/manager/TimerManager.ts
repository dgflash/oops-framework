import { Component } from "cc";
import { nanoid } from "nanoid";
import { EventDispatcher } from "../event/EventDispatcher";

export class TimerManager extends EventDispatcher {
    private static times: any = {};
    private schedules: any = {};
    private _scheduleCount: number = 1;

    private initTime: number = (new Date()).getTime();      // 当前游戏进入的时间毫秒值
    private component: Component;

    // 服务器时间与本地时间间隔
    private _$serverTimeElasped: number = 0;

    constructor(component: Component) {
        super();
        this.component = component;
        this.schedule(this.onUpdate.bind(this), 1);
    }
    /**
     * 设置服务器时间与本地时间间隔
     * @param val 
     */
    public serverTimeElasped(val?: number): number {
        if (val) {
            this._$serverTimeElasped = val;
        }
        return this._$serverTimeElasped;
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

    public schedule(callback: Function, interval: number): string {
        let UUID = `schedule_${this._scheduleCount++}`
        this.schedules[UUID] = callback;
        this.component.schedule(callback, interval);
        return UUID;
    }

    public scheduleOnce(callback: Function, delay: number = 0): string {
        let UUID = `scheduleOnce_${this._scheduleCount++}`;
        this.schedules[UUID] = callback;
        this.component.scheduleOnce(() => {
            let cb = this.schedules[UUID];
            if (cb) {
                cb();
            }
            this.unschedule(UUID);
        }, Math.max(delay, 0));
        return UUID;
    }

    public unschedule(uuid: string) {
        let cb = this.schedules[uuid];
        if (cb) {
            this.component.unschedule(cb);
            delete this.schedules[uuid];
        }
    }

    public unscheduleAllCallbacks() {
        for (let k in this.schedules) {
            this.component.unschedule(this.schedules[k]);
        }
        this.schedules = {};
    }

    onUpdate(dt: number) {
        // 后台管理倒计时完成事件
        for (let key in TimerManager.times) {
            let data = TimerManager.times[key];
            if (data.object[data.field] > 0) {
                data.object[data.field]--;

                if (data.object[data.field] == 0) {
                    this.timerComplete(data);
                }
                else {                             // 修改是否完成状态
                    if (data.onSecond) {
                        data.onSecond.call(data.object);                        // 触发每秒回调事件  
                    }
                }
            }
        }
    }

    /** 游戏最小划时记录时间数据 */
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
                this.timerComplete(data);
            }
            TimerManager.times[key].startTime = null;
        }
    }

    /** 触发倒计时完成事件 */
    private timerComplete(data: any) {
        if (data.onComplete) data.onComplete.call(data.object);
        if (data.event) this.dispatchEvent(data.event);
    }

    /** 注册指定对象的倒计时属性更新 */
    public registerObject(object: any, field: string, onSecond: Function, onComplete: Function) {
        let data: any = {};
        data.id = nanoid();
        data.object = object;                                   // 管理对象
        data.field = field;                                     // 时间字段
        data.onSecond = onSecond;                               // 每秒事件
        data.onComplete = onComplete;                           // 倒计时完成事件
        TimerManager.times[data.id] = data;
        return data.id;
    }

    /** 注消指定对象的倒计时属性更新 */
    public unRegisterObject(id: string) {
        if (TimerManager.times[id])
            delete TimerManager.times[id];
    }

    /** 
     * 注册事件需要管理的实时变化的时间对象 
     * @param event(String)     时间为零时触发的事件
     * @param object(object)    需要管理的数据结构对象
     * @param field(Array)      需要管理的字段
     */
    public register(event: string, object: any, field: Array<string>) {
        let data: any = {};
        data.id = event;
        data.event = event;                                 // 倒计时完成事件
        data.object = object;                               // 管理对象
        data.field = field;                                 // 时间字段
        TimerManager.times[data.id] = data;
    }

    /** 注销定时器 */
    public unRegister(event: string) {
        if (TimerManager.times[event])
            delete TimerManager.times[event];
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