import fs from "fs";
import path from "path";

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    createVirtualCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createVirtualCamera",
            args: []
        })
    },
    createTrackedCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createTrackedCamera",
            args: []
        })
    },
    createFreeLookCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createFreeLookCamera",
            args: []
        })
    },
    createFollowCamera() {
        Editor.Message.request("scene", "execute-scene-script", {
            name: "cinestation",
            method: "createFollowCamera",
            args: []
        })
    },
    selectNode(type: string, uuid: string) {
        if (type === "node") {
            Editor.Message.request("scene", "execute-scene-script", {
                name: "cinestation",
                method: "selectNode",
                args: [uuid]
            })
        }
    },
    async install() {
        let installPath = path.resolve(__dirname, "../../../assets");
        if (!fs.existsSync(installPath + "/cinestation")) {
            console.log("[Package] cinestation start installing");
            let resourcePath = path.resolve(__dirname, "../packages/cinestation.zip");
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
export const load = function () {
    methods.install();
};

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function () {
};
