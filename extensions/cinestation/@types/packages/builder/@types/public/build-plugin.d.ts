export interface IBuildPlugin {
    hooks?: string; // relate url about IHook
    options?: IDisplayOptions; // config of options
    verifyRuleMap?: IVerificationRuleMap;
}

export type IVerificationRuleMap = Record<
    string,
    {
        func?: (val: any, ...arg: any[]) => boolean | Promise<boolean>;
        message?: string;
    }
    >;

export type IDisplayOptions = Record<string, IConfigItem>;
export type ArrayItem = {
    label: string;
    value: string;
};
export interface IConfigItem {
    // 配置显示的名字，如果需要翻译，则传入 i18n:${key}
    label?: string;
    // 设置的简单说明
    description?: string;
    // 默认值
    default?: any;
    // 配置的类型
    type?: 'array' | 'object';
    itemConfigs?: IConfigItem[] | Record<string, IConfigItem>;
    verifyRules?: string[];
    attributes?: any;
    render?: {
        ui: string;
        attributes?: any;
        items?: ArrayItem[];
    };
}
