/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2021-11-04 17:33:12
 */
import * as buildTimeConstants from 'cc/env';
import { Logger } from '../../core/common/log/Logger';

const keys = (Object.keys(buildTimeConstants) as (keyof typeof buildTimeConstants)[]).sort();

/*
 * 游戏运行环境
 */
export class BuildTimeConstants {
    constructor() {
        const keyNameMaxLen = keys.reduce((len, key) => Math.max(len, key.length), 0);
        var enviroment = `${keys.map((key) => {
            const value = buildTimeConstants[key];
            const valueRep = typeof value === 'boolean' ? (value ? 'true' : 'false') : value;
            return `\n${key.padStart(keyNameMaxLen, ' ')} : ${valueRep}`;
        })}`;

        Logger.logConfig(enviroment, "游戏运行环境");
    }
}