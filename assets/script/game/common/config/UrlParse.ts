/*
 * @Author: dgflash
 * @Date: 2022-07-26 15:27:57
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-04 18:21:41
 */
import { sys } from "cc";

/* 地址栏参数处理 */
export class UrlParse {
    private _data: any = null;

    /** URL search参数对象 */
    public get query(): any {
        return this._data;
    }

    constructor() {
        if (!sys.isBrowser) {
            this._data = {};
            return;
        }
        this._data = this.parseUrl();
    }

    private parseUrl() {
        if (typeof window !== "object") return {};
        if (!window.document) return {};

        let url = window.document.location.href.toString();
        let u = url.split("?");
        if (typeof (u[1]) == "string") {
            u = u[1].split("&");
            let get: any = {};
            for (let i = 0, l = u.length; i < l; ++i) {
                let j = u[i];
                let x = j.indexOf("=");
                if (x < 0) {
                    continue;
                }
                let key = j.substring(0, x);
                let value = j.substring(x + 1);
                get[decodeURIComponent(key)] = value && decodeURIComponent(value);
            }
            return get;
        }
        else {
            return {};
        }
    }
}