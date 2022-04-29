
export * from '@editor/library-type/packages/builder/@types/protect';
import { IInternalBuildOptions, IPolyFills } from '@editor/library-type/packages/builder/@types/protect';

export type IOrientation = 'landscape' | 'portrait';

export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'ios-app-clip': IOptions;
    };
}

export interface IOptions {
    orientation: {
        landscapeRight: boolean;
        landscapeLeft: boolean;
        portrait: boolean;
        upsideDown: boolean;
    };
    polyfills?: IPolyFills;
    mainPackagePath: string;
    embedXcodeprojTarget?: string;
    remoteServerAddress: string;
}
