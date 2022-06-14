import { Camera, Vec3, view } from "cc";

export class CameraUtil {
    /**
     * 当前世界坐标是否在摄像机显示范围内
     * @param camera    摄像机
     * @param worldPos  坐标
     * @returns 
     */
    public static isInView(camera: Camera, worldPos: Vec3) {
        var cameraPos = camera.node.getWorldPosition();
        var viewPos = camera.worldToScreen(worldPos);
        var dir = Vec3.normalize(new Vec3(), worldPos.subtract(cameraPos));
        var forward = camera.node.forward;
        var dot = Vec3.dot(forward, dir);

        const viewportRect = view.getViewportRect();

        // 判断物体是否在相机前面
        if (dot > 0
            // 判断物体是否在视窗内
            && (viewPos.x <= viewportRect.width) && (viewPos.x >= 0)
            && (viewPos.y <= viewportRect.height) && (viewPos.y >= 0))
            return true;
        else
            return false;
    }
}