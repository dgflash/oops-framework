/// <reference path="../../../@types/editor/index.d.ts"/>
/// <reference path="@editor/library-type/packages/builder/@types/protect/global.d.ts"/>
export * from "@editor/library-type/packages/builder/@types/protect";
import { IInternalBuildOptions } from "@editor/library-type/packages/builder/@types/protect";

export type IOrientation = 'landscape' | 'portrait';
export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'oppo-mini-game': IOptions;
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
    hasSubPackage?: boolean;
    separateEngine: boolean;
}

export interface ICompileOptions {
    name: string;
    tinyPackageServer: string;
    useDebugKey: boolean;
    hasSubPackage: boolean;
}
