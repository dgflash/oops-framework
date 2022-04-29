
export * from '@editor/library-type/packages/builder/@types/protect';
import { appTemplateData, IInternalBuildOptions, IPolyFills } from '@editor/library-type/packages/builder/@types/protect';

export interface IOptions {
    resolution: {
        designHeight: number;
        designWidth: number;
    },
    polyfills?: IPolyFills;
    remoteServerAddress?: string;
}
export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'web-desktop': IOptions;
    };
    appTemplateData: appTemplateData;
}

export interface IBaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;

    required?: boolean;

    native?: string;

    wechatPlugin?: boolean;
}

export interface IModuleItem extends IBaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;

    /**
     * Whether if the feature of options allow multiple selection.
     */
    multi?: boolean;

    /**
     * If have default it will checked
     */
    default?: string[];

    options?: Record<string, IBaseItem>;

    category?: string;

    flags?: Record<string, IFlagBaseItem>;
}

export interface IDisplayModuleItem extends IModuleItem {
    _value: boolean;
    _option?: string;
    options?: Record<string, IDisplayModuleItem>;
}

export interface IDisplayModuleCache {
    _value: boolean;
    _option?: string;
    flags?: Record<string, boolean>;
}