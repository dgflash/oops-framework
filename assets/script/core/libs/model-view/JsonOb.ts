/**
 * 实现动态绑定的核心部分，
 * 每次修改属性值，都会调用对应函数，并且获取值的路径
 */

const OP = Object.prototype;
const types = {
    obj: '[object Object]',
    array: '[object Array]'
}
const OAM = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];

/**
 * 实现属性拦截的类
 */
export class JsonOb<T> {
    constructor(obj: T, callback: (newVal: any, oldVal: any, pathArray: string[]) => void) {
        if (OP.toString.call(obj) !== types.obj && OP.toString.call(obj) !== types.array) {
            console.error('请传入一个对象或数组');
        }
        this._callback = callback;
        this.observe(obj);
    }

    private _callback;
    /**对象属性劫持 */
    private observe<T>(obj: T, path?: any) {
        if (OP.toString.call(obj) === types.array) {
            this.overrideArrayProto(obj, path);
        }

        Object.keys(obj).forEach((key) => {
            let self = this;
            // @ts-ignore
            let oldVal = obj[key];
            let pathArray = path && path.slice();
            if (pathArray) {
                pathArray.push(key);
            }
            else {
                pathArray = [key];
            }
            Object.defineProperty(obj, key, {
                get: function () {
                    return oldVal;
                },
                set: function (newVal) {
                    //cc.log(newVal);
                    if (oldVal !== newVal) {
                        if (OP.toString.call(newVal) === '[object Object]') {
                            self.observe(newVal, pathArray);
                        }
                        self._callback(newVal, oldVal, pathArray);
                        oldVal = newVal;
                    }
                }
            })

            // @ts-ignore
            if (OP.toString.call(obj[key]) === types.obj || OP.toString.call(obj[key]) === types.array) {
                // @ts-ignore
                this.observe(obj[key], pathArray);
            }
        }, this)
    }

    /**
     * 对数组类型进行动态绑定
     * @param array 
     * @param path 
     */
    private overrideArrayProto(array: any, path: any) {
        // 保存原始 Array 原型  
        var originalProto = Array.prototype;
        // 通过 Object.create 方法创建一个对象，该对象的原型是Array.prototype  
        var overrideProto = Object.create(Array.prototype);
        var self = this;
        var result;

        // 遍历要重写的数组方法  
        OAM.forEach((method: any) => {
            Object.defineProperty(overrideProto, method, {
                value: function () {
                    var oldVal = this.slice();
                    //调用原始原型上的方法  
                    result = originalProto[method].apply(this, arguments);
                    //继续监听新数组  
                    self.observe(this, path);
                    self._callback(this, oldVal, path);
                    return result;
                }
            })
        });

        // 最后 让该数组实例的 __proto__ 属性指向 假的原型 overrideProto  
        array['__proto__'] = overrideProto;
    }
}