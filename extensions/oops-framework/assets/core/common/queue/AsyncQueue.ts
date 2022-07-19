import { log, warn } from "cc";

export type NextFunction = (nextArgs?: any) => void;

export type AsyncCallback = (next: NextFunction, params: any, args: any) => void;

interface AsyncTask {
    /**
     * 任务uuid
     */
    uuid: number;
    /**
      * 任务开始执行的回调
      * params: push时传入的参数
      * args: 上个任务传来的参数
      */
    callbacks: Array<AsyncCallback>;
    /**
      * 任务参数
      */
    params: any
}

/** 异步队列处理 */
export class AsyncQueue {
    // 正在运行的任务
    private _runningAsyncTask: AsyncTask | null = null;

    // 任务task的唯一标识
    private static _$uuid_count: number = 1;

    private _queues: Array<AsyncTask> = [];

    public get queues(): Array<AsyncTask> {
        return this._queues;
    }
    // 正在执行的异步任务标识
    private _isProcessingTaskUUID: number = 0;

    private _enable: boolean = true;
    /**
     * 是否开启可用
     */
    public get enable() {
        return this._enable;
    }
    /**
     * 是否开启可用
     */
    public set enable(val: boolean) {
        if (this._enable === val) {
            return;
        }
        this._enable = val;
        if (val && this.size > 0) {
            this.play();
        }
    }

    /**
     * 任务队列完成回调
     */
    public complete: Function | null = null;

    /**
     * push一个异步任务到队列中
     * 返回任务uuid
     */
    public push(callback: AsyncCallback, params: any = null): number {
        let uuid = AsyncQueue._$uuid_count++;
        this._queues.push({
            uuid: uuid,
            callbacks: [callback],
            params: params
        })
        return uuid;
    }

    /**
     * push多个任务，多个任务函数会同时执行,
     * 返回任务uuid
     */
    public pushMulti(params: any, ...callbacks: AsyncCallback[]): number {
        let uuid = AsyncQueue._$uuid_count++;
        this._queues.push({
            uuid: uuid,
            callbacks: callbacks,
            params: params
        })
        return uuid;
    }

    /** 移除一个还未执行的异步任务 */
    public remove(uuid: number) {
        if (this._runningAsyncTask?.uuid === uuid) {
            warn("正在执行的任务不可以移除");
            return;
        }
        for (let i = 0; i < this._queues.length; i++) {
            if (this._queues[i].uuid === uuid) {
                this._queues.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 队列长度
     */
    public get size(): number {
        return this._queues.length;
    }

    /**
     * 是否有正在处理的任务
     */
    public get isProcessing(): boolean {
        return this._isProcessingTaskUUID > 0;
    }

    /**
     * 队列是否已停止
     */
    public get isStop(): boolean {
        if (this._queues.length > 0) {
            return false;
        }
        if (this.isProcessing) {
            return false;
        }
        return true;
    }

    /** 正在执行的任务参数 */
    public get runningParams() {
        if (this._runningAsyncTask) {
            return this._runningAsyncTask.params;
        }
        return null;
    }

    /**
     * 清空队列
     */
    public clear() {
        this._queues = [];
        this._isProcessingTaskUUID = 0;
        this._runningAsyncTask = null;
    }

    protected next(taskUUID: number, args: any = null) {
        if (this._isProcessingTaskUUID === taskUUID) {
            this._isProcessingTaskUUID = 0;
            this._runningAsyncTask = null;
            this.play(args);
        }
        else {
            if (this._runningAsyncTask) {
                log(this._runningAsyncTask);
            }
        }
    }

    /**
     * 跳过当前正在执行的任务
     */
    public step() {
        if (this.isProcessing) {
            this.next(this._isProcessingTaskUUID);
        }
    }

    /**
     * 开始运行队列
     */
    public play(args: any = null) {
        if (this.isProcessing) {
            return;
        }

        if (!this._enable) {
            return;
        }

        let actionData: AsyncTask = this._queues.shift()!;
        if (actionData) {
            this._runningAsyncTask = actionData;
            let taskUUID: number = actionData.uuid;
            this._isProcessingTaskUUID = taskUUID;
            let callbacks: Array<AsyncCallback> = actionData.callbacks;

            if (callbacks.length == 1) {
                let nextFunc: NextFunction = (nextArgs: any = null) => {
                    this.next(taskUUID, nextArgs);
                }
                callbacks[0](nextFunc, actionData.params, args);
            }
            else {
                // 多个任务函数同时执行
                let fnum: number = callbacks.length;
                let nextArgsArr: any[] = [];
                let nextFunc: NextFunction = (nextArgs: any = null) => {
                    --fnum;
                    nextArgsArr.push(nextArgs || null);
                    if (fnum === 0) {
                        this.next(taskUUID, nextArgsArr);
                    }
                }
                let knum = fnum;
                for (let i = 0; i < knum; i++) {
                    callbacks[i](nextFunc, actionData.params, args);
                }
            }
        }
        else {
            this._isProcessingTaskUUID = 0;
            this._runningAsyncTask = null;
            // cc.log("任务完成")
            if (this.complete) {
                this.complete(args);
            }
        }
    }

    /**
     * 【比较常用，所以单独提出来封装】往队列中push一个延时任务
     * @param time 毫秒时间
     * @param callback （可选参数）时间到了之后回调
     */
    public yieldTime(time: number, callback: Function | null = null) {
        let task = function (next: Function, params: any, args: any) {
            let _t = setTimeout(() => {
                clearTimeout(_t);
                if (callback) {
                    callback();
                }
                next(args);
            }, time);
        }
        this.push(task, { des: "AsyncQueue.yieldTime" });
    }

    /**
     * 返回一个执行函数，执行函数调用count次后，next将触发
     * @param count 
     * @param next 
     * @return 返回一个匿名函数
     */
    public static excuteTimes(count: number, next: Function | null = null): Function {
        let fnum: number = count;
        let tempCall = () => {
            --fnum;
            if (fnum === 0) {
                next && next();
            }
        }
        return tempCall;
    }
}