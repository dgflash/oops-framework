"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.config = exports.unload = exports.load = void 0;
const ExcelToJson_1 = require("./ExcelToJson");
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() { }
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    async excelToJson() {
        exports.config = await Editor.Profile.getProject("oops-plugin-excel-to-json");
        if (exports.config.PathExcel == null) {
            console.warn("项目->项目设置->Excel To Json->PathExcel 配置路径");
            return;
        }
        if (exports.config.PathJson == null) {
            console.warn("项目->项目设置->Excel To Json->PathJson 配置路径");
            return;
        }
        if (exports.config.PathTs == null) {
            console.warn("项目->项目设置->Excel To Json->PathTs 配置路径");
            return;
        }
        (0, ExcelToJson_1.run)();
    }
};
