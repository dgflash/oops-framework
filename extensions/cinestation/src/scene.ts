declare const cc: any;
declare const cce: any;

/**
 * @en Registration method for the main process of Extension
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    createVirtualCamera() {
        const js = cc.js;
        const scene = cc.director.getScene();
        let camera = scene.getComponentInChildren(cc.Camera);
        if (camera == undefined) {
            console.error("not find Camera");
            return;
        }

        if (camera.node.getComponent(js.getClassByName("CinestationBrain")) == undefined) {
            camera.node.addComponent(js.getClassByName("CinestationBrain"));
        }

        let editorCamera = cce.Camera.camera;
        let vcams = scene.getComponentsInChildren(js.getClassByName("VirtualCamera"));
        let cameraNode = new cc.Node("VCam" + vcams.length); scene.addChild(cameraNode);
        cameraNode.worldPosition = editorCamera.node.worldPosition;
        cameraNode.worldRotation = editorCamera.node.worldRotation;

        let vcam = cameraNode.addComponent(js.getClassByName("VirtualCamera"));
        let lens = vcam.lens;
        lens.fov = camera.fov;
        lens.near = camera.near;
        lens.far = camera.far;

        return vcam;
    },
    createTrackedCamera() {
        const js = cc.js;
        const scene = cc.director.getScene();
        let tracks = scene.getComponentsInChildren(js.getClassByName("CinestationSmoothPath"));
        let editorCamera = cce.Camera.camera;
        let trackNode = new cc.Node("DollyTrack" + tracks.length); scene.addChild(trackNode);
        let path = trackNode.addComponent(js.getClassByName("CinestationSmoothPath"));
        trackNode.worldPosition = editorCamera.node.worldPosition;
        trackNode.addChild(new cc.Node("Node0"));
        trackNode.addChild(new cc.Node("Node1"))

        let vcam = this.createVirtualCamera();
        vcam.body.type = 2;
        vcam.body.tracked.path = path;
        vcam.aim.type = 1;
        return vcam;
    },
    createFreeLookCamera() {
        let vcam = this.createVirtualCamera();
        vcam.body.type = 1;
        vcam.aim.type = 2;
        return vcam;
    },
    createFollowCamera() {
        let vcam = this.createVirtualCamera();
        vcam.body.type = 3;
        vcam.aim.type = 1;
        return vcam;
    },
    selectNode(uuid) {
        const js = cc.js;
        const scene = cc.director.getScene();
        let vcams = scene.getComponentsInChildren(js.getClassByName("VirtualCamera"));
        let selected = null;
        for (let i = 0; i < vcams.length; i++) {
            let vcam = vcams[i];
            if (vcam.node.uuid === uuid) {
                vcam.visible = true;
                vcam._composerChanged = true;
                vcam._editorChanged = true;
                selected = vcam;
            }
            else {
                vcam.visible = false;
            }
        }
        let brain = scene.getComponentInChildren(js.getClassByName("CinestationBrain"));
        if (brain) {
            brain.__selectedCamera = selected;
        }
    },
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function () {

}

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function () {

};

