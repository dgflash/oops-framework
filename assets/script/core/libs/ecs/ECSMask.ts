/*
 * @Author: dgflash
 * @Date: 2022-05-12 14:18:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-24 11:09:49
 */
import { ECSModel } from "./ECSModel";

export class ECSMask {
    private mask: Uint32Array;
    private size: number = 0;

    constructor() {
        let length = Math.ceil(ECSModel.compTid / 31);
        this.mask = new Uint32Array(length);
        this.size = length;
    }

    set(num: number) {
        // https://stackoverflow.com/questions/34896909/is-it-correct-to-set-bit-31-in-javascript
        // this.mask[((num / 32) >>> 0)] |= ((1 << (num % 32)) >>> 0);
        this.mask[((num / 31) >>> 0)] |= (1 << (num % 31));
    }

    delete(num: number) {
        this.mask[((num / 31) >>> 0)] &= ~(1 << (num % 31));
    }

    has(num: number) {
        return !!(this.mask[((num / 31) >>> 0)] & (1 << (num % 31)));
    }

    or(other: ECSMask) {
        for (let i = 0; i < this.size; i++) {
            // &操作符最大也只能对2^30进行操作，如果对2^31&2^31会得到负数。当然可以(2^31&2^31) >>> 0，这样多了一步右移操作。
            if (this.mask[i] & other.mask[i]) {
                return true;
            }
        }
        return false;
    }

    and(other: ECSMask) {
        for (let i = 0; i < this.size; i++) {
            if ((this.mask[i] & other.mask[i]) != this.mask[i]) {
                return false;
            }
        }
        return true;
    }

    clear() {
        for (let i = 0; i < this.size; i++) {
            this.mask[i] = 0;
        }
    }
}