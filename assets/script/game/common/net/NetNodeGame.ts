/*
 * @Author: dgflash
 * @Date: 2022-06-02 09:38:48
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:52:54
 */

import { CallbackObject, IRequestProtocol } from "../../../../../extensions/oops-framework/assets/core/network/NetInterface";
import { NetNode } from "../../../../../extensions/oops-framework/assets/core/network/NetNode";
import { netConfig } from "./NetConfig";

/** 网络节点扩展 */
export class NetNodeGame extends NetNode {
    private isCompress: boolean = false;

    public req(action: string, method: string, data: any, rspObject: CallbackObject, showTips: boolean = true, force: boolean = false) {
        let protocol: IRequestProtocol = {
            action: action,
            method: method,
            data: JSON.stringify(data),
            isCompress: this.isCompress,
            channelid: netConfig.channelid
        }
        return this.request(protocol, rspObject, showTips, force);
    }

    public reqUnique(action: string, method: string, data: any, rspObject: CallbackObject, showTips: boolean = true, force: boolean = false): boolean {
        let protocol: IRequestProtocol = {
            action: action,
            method: method,
            data: JSON.stringify(data),
            isCompress: this.isCompress,
            channelid: netConfig.channelid
        }
        return super.requestUnique(protocol, rspObject, showTips, force);
    }
}