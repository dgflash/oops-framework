/// <reference path="../../../@types/index.d.ts"/>
/// <reference path="@editor/library-type/packages/builder/@types/protect/global.d.ts"/>

export * from "@editor/library-type/packages/builder/@types/protect";
import { IInternalBuildOptions } from "@editor/library-type/packages/builder/@types/protect";

export type IOrientation = 'landscape' | 'portrait';

export interface PlatformSettings {
    runtimeVersion: string,
    deviceOrientation: IOrientation,
    statusbarDisplay: boolean,
    startSceneAssetBundle: false,
    resourceURL: string,
    workerPath: string,
    XHRTimeout: number,
    WSTimeout: number,
    uploadFileTimeout: number,
    downloadFileTimeout: number,
    cameraPermissionHint: string,
    userInfoPermissionHint: string,
    locationPermissionHint: string,
    albumPermissionHint: string
}

export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        "link-sure": PlatformSettings
    }
}
