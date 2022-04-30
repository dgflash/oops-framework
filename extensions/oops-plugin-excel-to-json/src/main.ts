import { run } from "./ExcelToJson";

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export function load() { }

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export function unload() { }

export var config: any;

/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    async excelToJson() {
        config = await Editor.Profile.getProject("oops-plugin-excel-to-json");
        if (config.PathExcel == null) {
            console.warn("项目->项目设置->Excel To Json->PathExcel 配置路径");
            return;
        }

        if (config.PathJson == null) {
            console.warn("项目->项目设置->Excel To Json->PathJson 配置路径");
            return;
        }

        if (config.PathTs == null) {
            console.warn("项目->项目设置->Excel To Json->PathTs 配置路径");
            return;
        }

        run();
    }
};
