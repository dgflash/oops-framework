/*
 * @Author: dgflash
 * @Date: 2022-04-21 13:45:51
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-21 13:51:33
 */
import { IProtocolHelper, IRequestProtocol, IResponseProtocol, NetData } from "./NetInterface";

var unzip = function (str: string) {
    let charData = str.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    let binData = new Uint8Array(charData);
    //@ts-ignore
    let data = pako.inflate(binData, { to: 'string' });
    return data;
}

var zip = function (str: string) {
    //@ts-ignore
    let binaryString = pako.gzip(str, { to: 'string' });
    return binaryString;
}

/** Pako.js 数据压缩协议 */
export class NetProtocolPako implements IProtocolHelper {
    getHeadlen(): number {
        return 0;
    }

    getHearbeat(): NetData {
        return "";
    }

    getPackageLen(msg: NetData): number {
        return msg.toString().length;
    }

    checkResponsePackage(respProtocol: IResponseProtocol): boolean {
        return true;
    }

    handlerResponsePackage(respProtocol: IResponseProtocol): boolean {
        if (respProtocol.code == 1) {
            if (respProtocol.isCompress) {
                respProtocol.data = unzip(respProtocol.data);
            }
            respProtocol.data = JSON.parse(respProtocol.data);

            return true;
        }
        else {
            return false;
        }
    }

    handlerRequestPackage(reqProtocol: IRequestProtocol): string {
        var rspCmd = reqProtocol.action + "_" + reqProtocol.method;
        reqProtocol.callback = rspCmd;
        if (reqProtocol.isCompress) {
            reqProtocol.data = zip(reqProtocol.data);
        }
        return rspCmd;
    }

    getPackageId(respProtocol: IResponseProtocol): string {
        return respProtocol.callback!;
    }
}