/*
 * @Date: 2021-08-14 16:17:03
 * @LastEditors: H.Joeson
 * @LastEditTime: 2021-11-25 15:52:12
 */
import { sys } from "cc";

export class PlatformUtil {
    public static isNativeAndroid() {
        if (typeof jsb == "undefined")
            return false
        if (sys.isNative && sys.platform === sys.Platform.ANDROID)
            return true
        return false
    }

    public static isNativeIOS() {
        if (typeof jsb == "undefined")
            return false
        if (sys.isNative && sys.os === sys.OS.IOS)
            return true
        return false
    }

    public static getPlateform() {
        if (this.isNativeAndroid())
            return 'android'
        else if (this.isNativeIOS())
            return 'ios'
        else
            return 'h5'
    }

    public static isIOSwebview = function () {
        //@ts-ignore
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.sdkLoginOut)
            return true
        else
            return false
    }
}
