/*
 * @Author: dgflash
 * @Date: 2022-07-22 15:54:51
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-22 16:23:42
 */

/** 
 * 集合对象
 * 1、Map与Array集合体
 */
export class Collection<K, V> extends Map<K, V>{
    private _array: V[] = [];

    get array() {
        return this._array;
    }

    set(key: K, value: V) {
        if (!this.has(key)) {
            this._array.push(value);
        }

        return super.set(key, value);
    }

    delete(key: K): boolean {
        var value = this.get(key);
        if (value) {
            var index = this._array.indexOf(value);
            if (index > -1) this._array.splice(index, 1);
            return super.delete(key);
        }
        return false;
    }
}