/// <reference path="../../../@types/index.d.ts"/>
/// <reference path="@editor/library-type/packages/builder/@types/protect/global.d.ts"/>
export * from "@editor/library-type/packages/builder/@types/protect";
import { IInternalBuildOptions } from "@editor/library-type/packages/builder/@types/protect/index";

export type IOrientation = 'landscape' | 'portrait';

export interface ITaskOption extends IInternalBuildOptions {
    packages:{
        'huawei-quick-game': IOptions;
    };
}

export interface IOptions {
    package: string;
    icon: string;
    versionName: string;
    versionCode: string;
    minPlatformVersion: string;
    deviceOrientation: IOrientation;
    tinyPackageServer: string;
    useDebugKey: boolean;
    privatePemPath: string;
    certificatePemPath: string;

    fullScreen: boolean;
    logLevel: string;
    manifestPath?: string;
}

export interface ICompileOptions {
    name: string;
    tinyPackageServer: string;
}
