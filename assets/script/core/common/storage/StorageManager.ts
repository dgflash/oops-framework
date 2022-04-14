import { sys } from "cc";
import { PREVIEW } from "cc/env";
import { md5 } from "../../libs/security/Md5";
import { EncryptUtil } from "./EncryptUtil";

export module storage {
    let _key: string | null = null;
    let _iv: string | null = null;
    let _id: number = -1;

    /**
     * 初始化密钥
     * @param key aes加密的key 
     * @param iv  aes加密的iv
     */
    export function init(key: string, iv: string) {
        _key = md5(key);
        _iv = md5(iv);
    }

    /**
     * 设置用户标识
     * @param id 
     */
    export function setUser(id: number) {
        _id = id;
    }

    /**
     * 存储
     * @param key 存储key
     * @param value 存储值
     * @returns 
     */
    export function set(key: string, value: any) {
        key = `${key}_${_id}`;

        if (null == key) {
            console.error("存储的key不能为空");
            return;
        }
        if (!PREVIEW) {
            key = md5(key);
        }
        if (null == value) {
            console.warn("存储的值为空，则直接移除该存储");
            remove(key);
            return;
        }
        if (typeof value === 'function') {
            console.error("储存的值不能为方法");
            return;
        }
        if (typeof value === 'object') {
            try {
                value = JSON.stringify(value);
            }
            catch (e) {
                console.error(`解析失败，str = ${value}`);
                return;
            }
        }
        else if (typeof value === 'number') {
            value = value + "";
        }
        if (!PREVIEW && null != _key && null != _iv) {
            try {
                value = EncryptUtil.aesEncrypt(value, _key, _iv);
            }
            catch (e) {
                value = null;
            }
        }
        sys.localStorage.setItem(key, value);
    }

    /**
     * 获取
     * @param key 获取的key
     * @param defaultValue 获取的默认值
     * @returns 
     */
    export function get(key: string, defaultValue?: any) {
        if (null == key) {
            console.error("存储的key不能为空");
            return;
        }

        key = `${key}_${_id}`;

        if (!PREVIEW) {
            key = md5(key);
        }
        let str: string | null = sys.localStorage.getItem(key);
        if (null != str && '' !== str && !PREVIEW && null != _key && null != _iv) {
            try {
                str = EncryptUtil.aesDecrypt(str, _key, _iv);
            }
            catch (e) {
                str = null;
            }

        }
        if (null == defaultValue || typeof defaultValue === 'string') {
            return str;
        }
        if (null === str) {
            return defaultValue;
        }
        if (typeof defaultValue === 'number') {
            return Number(str) || 0;
        }
        if (typeof defaultValue === 'boolean') {
            return "true" == str; // 不要使用Boolean("false");
        }
        if (typeof defaultValue === 'object') {
            try {
                return JSON.parse(str);
            }
            catch (e) {
                console.error("解析数据失败,str=" + str);
                return defaultValue;
            }

        }
        return str;
    }

    /**
     * 移除某个值
     * @param key 需要移除的key 
     * @returns 
     */
    export function remove(key: string) {
        if (null == key) {
            console.error("存储的key不能为空");
            return;
        }

        key = `${key}_${_id}`;

        if (!PREVIEW) {
            key = md5(key);
        }
        sys.localStorage.removeItem(key);
    }

    /**
     * 清空整个本地存储
     */
    export function clear() {
        sys.localStorage.clear();
    }
}