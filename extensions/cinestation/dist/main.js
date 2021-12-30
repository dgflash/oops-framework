/*
 * @Author: dgflash
 * @Date: 2021-12-16 16:50:21
 * @LastEditors: dgflash
 * @LastEditTime: 2021-12-30 10:13:19
 */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = { 
    createVirtualCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createVirtualCamera",
            args: []
        });
    },
    createTrackedCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createTrackedCamera",
            args: []
        });
    },
    createFreeLookCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createFreeLookCamera",
            args: []
        });
    },
    createFollowCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createFollowCamera",
            args: []
        });
    },
    selectNode(type, uuid) {
        if (type === "node") {
            Editor.Message.request("scene", "execute-scene-script", {
                name: "cinestation",
                method: "selectNode",
                args: [uuid]
            });
        }
    },
    async install() {
        let installPath = path_1.default.resolve(__dirname, "../../../assets");
        if (!fs_1.default.existsSync(installPath + "/cinestation")) {
            console.log("[Package] cinestation start installing");
            let resourcePath = path_1.default.resolve(__dirname, "../packages/cinestation.zip");
            await Editor.Utils.File.unzip(resourcePath, installPath);
            console.log("[Package] cinestation installed");
            Editor.Message.request("asset-db", "refresh-asset", "db://assets");
        }
    }
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
const load = function () {
    exports.methods.install();
};
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
const unload = function () {
};
exports.unload = unload;
