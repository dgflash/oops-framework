export class StringFormat {
    /** 123456789 = 123,456,789 */
    public static numberConvertPermil(num: number): string {
        return num.toLocaleString();
    }

    /** 12345 = 12.35K */
    public static numberConvertThousand(value: number, fixed: number = 2): string {
        var k = 1000;
        var sizes = ['', 'K', 'M', 'G'];
        if (value < k) {
            return value.toString();
        }
        else {
            var i = Math.floor(Math.log(value) / Math.log(k));
            var r = ((value / Math.pow(k, i)));
            return r.toFixed(fixed) + sizes[i];
        }
    }

    /** 12345 = 1.23万 */
    public static numberConvertTenThousand(value: number, fixed: number = 2): string {
        var k = 10000;
        var sizes = ['', '万', '亿', '万亿'];
        if (value < k) {
            return value.toString();
        }
        else {
            var i = Math.floor(Math.log(value) / Math.log(k));
            return ((value / Math.pow(k, i))).toFixed(fixed) + sizes[i];
        }
    }

    /** yyyy-MM-dd hh:mm:ss S */
    public static format(date: Date, fmt: string) {
        var o: any = {
            "M+": date.getMonth() + 1,                   // 月份 
            "d+": date.getDate(),                        // 日 
            "h+": date.getHours(),                       // 小时 
            "m+": date.getMinutes(),                     // 分 
            "s+": date.getSeconds(),                     // 秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度 
            "S": date.getMilliseconds()                  // 毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
}
