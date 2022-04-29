
export * from '@editor/library-type/packages/builder/@types/protect';
import { IInternalBuildOptions, ISettings } from '@editor/library-type/packages/builder/@types/protect';

export type IOrientation = 'landscape' | 'portrait';

export interface ITaskOption extends IInternalBuildOptions {
    packages:{
        'xiaomi-quick-game': IOptions;
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
    logLevel: string;

    encapsulation: boolean;
    makeAfterBuild: boolean;
}

export interface ICompileOption {
    name: string;
    useDebugKey: boolean;
    tinyPackageServer: string;
}

export interface IUserSettings extends ISettings {
    orientation: IOrientation;
}
