import { Logger } from "../log/Logger";

class EventData {
    public event!: string;
    public listener!: (event: string, args: any) => void;
    public obj: any;
}

/**
 * 批量注册、移除全局事件对象
 */
export class MessageEventData {
    private events: any = {};

    on(event: string, listener: (event: string, args: any) => void, thisObj: object) {
        let list: Array<EventData> = this.events[event];
        if (list == null) {
            list = [];
            this.events[event] = list;
        }
        let data: EventData = new EventData();
        data.event = event;
        data.listener = listener;
        data.obj = thisObj;
        list.push(data);

        Message.on(event, listener, thisObj);
    }

    off(event: string) {
        let ebs: Array<EventData> = this.events[event];
        if (!ebs) {
            return;
        }
        for (let eb of ebs) {
            Message.off(event, eb.listener, eb.obj);
        }
        delete this.events[event];
    }

    dispatchEvent(event: string, arg: any = null) {
        Message.dispatchEvent(event, arg);
    }

    removes() {
        for (let event in this.events) {
            this.off(event);
        }
    }
}

class MessageManager {
    public static readonly Instance: MessageManager = new MessageManager();

    private events: any = {};

    /**
     * 注册全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    on(event: string, listener: (event: string, args: any) => void, thisObj: object) {
        if (!event || !listener) {
            Logger.warning(`注册【${event}】事件的侦听器函数为空`);
            return;
        }

        let list: Array<EventData> = this.events[event];
        if (list == null) {
            list = [];
            this.events[event] = list;
        }

        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener == listener && bin.obj == thisObj) {
                Logger.warning(`名为【${event}】的事件重复注册侦听器`);
            }
        }


        let data: EventData = new EventData();
        data.event = event;
        data.listener = listener;
        data.obj = thisObj;
        list.push(data);
    }

    /**
     * 监听一次事件，事件响应后，该监听自动移除
     * @param event 
     * @param listener 
     * @param thisObj 
     */
    once(event: string, listener: (event: string, args: any) => void, thisObj: object) {
        let _listener: any = ($event: string, $args: any) => {
            this.off(event, _listener, thisObj);
            _listener = null;
            listener.call(thisObj, $event, $args);
        }
        this.on(event, _listener, thisObj);
    }

    /**
     * 移除全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    off(event: string, listener: Function, thisObj: object) {
        let list: Array<EventData> = this.events[event];

        if (!list) {
            Logger.warning(`名为【${event}】的事件不存在`);
            return;
        }

        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin: EventData = list[i];
            if (bin.listener == listener && bin.obj == thisObj) {
                list.splice(i, 1);
                break;
            }
        }

        if (list.length == 0) {
            delete this.events[event];
        }
    }

    /** 
     * 触发全局事件 
     * @param event(string)      事件名
     * @param arg(any)           事件参数
     */
    dispatchEvent(event: string, arg: any = null) {
        let list: Array<EventData> = this.events[event];

        if (list != null) {
            let temp: Array<EventData> = list.concat();
            let length = temp.length;
            for (let i = 0; i < length; i++) {
                let eventBin = temp[i];
                eventBin.listener.call(eventBin.obj, event, arg);
            }
        }
    }
}

export const Message = MessageManager.Instance;