import { error, log, warn } from "cc";

export namespace Logger {
    var tags: Map<string, boolean> = new Map<string, boolean>();

    enum Key {
        /** 网络层日志 */
        Net = 'Net',
        /** 数据结构层日志 */
        Model = "Model",
        /** 业务逻辑层日志 */
        Business = "Business",
        /** 视图层日志 */
        View = "View",
        /** 配置数据 */
        Config = "Config",
        /** 登录日志 */
        Trace = 'Trace'
    }

    export function init() {
        register(Key.Net);
        register(Key.Model);
        register(Key.Business);
        register(Key.View);
        register(Key.Config);
        register(Key.Trace);
    }

    /** 开始计时 */
    export function start() {
        console.time("Time");
    }

    /** 打印范围内时间消耗 */
    export function end() {
        console.timeEnd("Time");
    }

    /** 打印表格 */
    export function table(msg: any, describe?: string) {
        if (!tags.has(Key.Trace)) {
            return;
        }
        console.table(msg);
    }

    /** 无颜色日志 */
    export function trace(msg: any, describe?: string) {
        print(Key.Trace, msg, "", describe)
    }

    /** 网络层数据日志 */
    export function logNet(msg: any, describe?: string) {
        orange(Key.Net, msg, describe);
    }

    /** 客户端数据结构层日志 */
    export function logModel(msg: any, describe?: string) {
        violet(Key.Model, msg, describe);
    }

    /** 客户端数据结构层日志 */
    export function logBusiness(msg: any, describe?: string) {
        blue(Key.Business, msg, describe);
    }

    /** 客户端数据结构层日志 */
    export function logView(msg: any, describe?: string) {
        green(Key.View, msg, describe);
    }

    /** 客户端配置数据 */
    export function logConfig(msg: any, describe?: string) {
        gray(Key.Config, msg, describe);
    }

    export function erroring(msg: string) {
        error('[ERROR]' + msg);
    }

    export function warning(msg: string) {
        warn('[WARN]:' + msg);
    }

    // 橙色
    function orange(tag: string, msg: any, describe?: string) {
        print(tag, msg, "color:#ee7700;", describe)
    }

    // 紫色
    function violet(tag: string, msg: any, describe?: string) {
        print(tag, msg, "color:Violet;", describe)
    }

    // 蓝色
    function blue(tag: string, msg: any, describe?: string) {
        print(tag, msg, "color:#3a5fcd;", describe)
    }

    // 绿色
    function green(tag: string, msg: any, describe?: string) {
        print(tag, msg, "color:green;", describe)
    }

    // 灰色
    function gray(tag: string, msg: any, describe?: string) {
        print(tag, msg, "color:gray;", describe)
    }

    function register(tag: Key) {
        if (!tags.has(tag)) {
            tags.set(tag, true);
        }
    }

    function print(tag: string, msg: any, color: string, describe?: string) {
        // 标记没有打开，不打印该日志
        if (!tags.has(tag)) {
            return;
        }
        var backLog = console.log || log;
        if (describe) {
            backLog.call(null, "%c%s%s%s:%s%o", color, getDateString(), '[' + tag + ']', stack(5), describe, msg);
        }
        else {
            backLog.call(null, "%c%s%s%s:%o", color, getDateString(), '[' + tag + ']', stack(5), msg);
        }
    }

    function stack(index: number): string {
        var e = new Error();
        var lines = e.stack!.split("\n");
        var result: Array<any> = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            }
            else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });

        var list: string[] = [];
        var splitList: Array<string> = [];
        if (index < result.length - 1) {
            var value: string;
            for (var a in result[index]) {
                var splitList = a.split(".");

                if (splitList.length == 2) {
                    list = splitList.concat();
                }
                else {
                    value = result[index][a];
                    var start = value!.lastIndexOf("/");
                    var end = value!.lastIndexOf(".");
                    if (start > -1 && end > -1) {
                        var r = value!.substring(start + 1, end);
                        list.push(r);
                    }
                    else {
                        list.push(value);
                    }
                }
            }
        }

        if (list.length == 1) {
            return "[" + list[0] + ".ts]";
        }
        else if (list.length == 2) {
            return "[" + list[0] + ".ts->" + list[1] + "]";
        }
        return "";
    }

    function getDateString(): string {
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = "[" + timeStr + "]";
        return timeStr;
    }
}

Logger.init();