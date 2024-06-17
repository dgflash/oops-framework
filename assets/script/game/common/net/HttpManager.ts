import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Logger } from "../../../../../extensions/oops-plugin-framework/assets/core/common/log/Logger";
import { HttpReturn } from "../../../../../extensions/oops-plugin-framework/assets/libs/network/HttpRequest";


type HttpCallback = (ret: HttpReturn) => void;


export class HttpManager {
    get(name: string, onComplete: HttpCallback, params: any = null) {
        Logger.logNet(params, 'http-get:')
        oops.http.get(name, onComplete, params)
    }

    getAsync(name: string, params: any = null): Promise<HttpReturn> {
        Logger.logNet(params, 'http-getAsync:')
        return oops.http.getAsync(name, params)
    }
}

export const http = new HttpManager();
