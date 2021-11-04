import { Color, Texture2D } from "cc";

/**
 * 图像工具
 */
export default class ImageUtil {
    /**
     * 获取纹理中指定像素的颜色，原点为左上角，从像素 (1, 1) 开始。
     * @param texture 纹理
     * @param x x 坐标
     * @param y y 坐标
     * @example
     * // 获取纹理左上角第一个像素的颜色
     * const color = ImageUtil.getPixelColor(texture, 1, 1);
     * // cc.color(50, 100, 123, 255);
     */
    public static getPixelColor(texture: Texture2D, x: number, y: number): Color {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = texture.width;
        canvas.height = texture.height;
        const image = texture.getHtmlElementObj()!;
        ctx.drawImage(image, 0, 0, texture.width, texture.height);
        const imageData = ctx.getImageData(0, 0, texture.width, texture.height);
        const pixelIndex = ((y - 1) * texture.width * 4) + (x - 1) * 4;
        const pixelData = imageData.data.slice(pixelIndex, pixelIndex + 4);
        const color = new Color(pixelData[0], pixelData[1], pixelData[2], pixelData[3]);
        image.remove();
        canvas.remove();
        return color;
    }

    /**
     * 将图像转为 Base64 字符（仅 png、jpg 或 jpeg 格式资源）（有问题）
     * @param url 图像地址
     * @param callback 完成回调
     */
    public static imageToBase64(url: string, callback?: (dataURL: string) => void): Promise<string> {
        return new Promise(res => {
            let extname = /\.png|\.jpg|\.jpeg/.exec(url)?.[0];
            if (['.png', '.jpg', '.jpeg'].includes(extname)) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                const image = new Image();
                image.src = url;
                image.onload = () => {
                    canvas.height = image.height;
                    canvas.width = image.width;
                    ctx.drawImage(image, 0, 0);
                    extname = extname === '.jpg' ? 'jpeg' : extname!.replace('.', '');
                    const dataURL = canvas.toDataURL(`image/${extname}`);
                    callback && callback(dataURL);
                    res(dataURL);
                    image.remove();
                    canvas.remove();
                }
            }
            else {
                console.warn('Not a jpg/jpeg or png resource!');
                callback && callback("");
                res("");
            }
        });
    }

    /**
     * 将 Base64 字符转为 cc.Texture2D 资源（有问题）
     * @param base64 Base64 字符
     */
    public static base64ToTexture(base64: string): Texture2D {
        const image = document.createElement('img');
        image.src = base64;
        const texture = new Texture2D();
        texture.initWithElement(image);
        image.remove();
        return texture;
    }

    /**
     * 将 Base64 字符转为二进制数据（有问题）
     * @param base64 Base64 字符
     */
    public static base64ToBlob(base64: string): Blob {
        const strings = base64.split(',');
        const type = /image\/\w+|;/.exec(strings[0])[0];
        const data = window.atob(strings[1]);
        const arrayBuffer = new ArrayBuffer(data.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < data.length; i++) {
            uint8Array[i] = data.charCodeAt(i) & 0xff;
        }
        return new Blob([uint8Array], { type: type });
    }
}
