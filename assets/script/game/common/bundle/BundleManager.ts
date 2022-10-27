import { Asset, AudioClip, Font, ImageAsset, JsonAsset, Material, Prefab, Sprite, SpriteFrame, Texture2D } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import BundleConfig from "./BundleConfig";

export type NoInfer<A extends any> = [A][A extends any ? 0 : never];
export type BundleName = keyof BundleConfig["BundleName"];

/** 资源模块化工具 */
export class BundleManager {
    /**
     * 根据资源类型获得对应文件
     * @param assetType 资源类型
     */
    private static getAssetUrl<T extends typeof Asset>(assetType: T) {
        let typeUrl = "";
        switch (assetType as any) {
            case Prefab:
                typeUrl = "prefab";
                break;
            case Material:
                typeUrl = "shader";
                break;
            case AudioClip:
                typeUrl = "sound";
                break;
            case ImageAsset:
            case Texture2D:
            case Sprite:
            case SpriteFrame:
                typeUrl = "texture";
                break;
            case JsonAsset:
                typeUrl = "data";
                break;
            case Font:
                typeUrl = "font";
                break;
            default:
                console.error("没有该资源类型", assetType);
                break;
        }
        return typeUrl;
    }

    /**
     * 加载指定类型资源
     * @param bundleName 外部资源包名
     * @param assetName  目标加载资源名
     */
    public static loadAsset<T extends typeof Asset,
        TBundleName extends BundleName,
        TAssetName = keyof BundleConfig['BundleName'][TBundleName]['prefab'] | keyof BundleConfig['BundleName'][TBundleName]['sound'] | keyof BundleConfig['BundleName'][TBundleName]['texture']>
        (bundleName: TBundleName, assetName: NoInfer<TAssetName>, assetType: T): Promise<InstanceType<T>> {
        let str = this.getAssetUrl(assetType);
        // @ts-ignore
        let url: string = BundleConfig.instance.BundleName[bundleName][str][assetName];
        // 兼容3.x ,加载 SpriteFrame 路径需要添加后缀
        if (assetType as any === SpriteFrame) {
            url += "/spriteFrame";
        }
        else if (assetType as any === Texture2D) {
            url += "/texture";
        }
        return new Promise(async (resolve, reject) => {
            // @ts-ignore
            oops.res.load(bundleName, url, (err: Error, res: any) => {
                if (!err) {
                    // 加载成功
                    resolve(res);
                }
                else {
                    //加载失败
                    reject(err);
                    console.error(`外部资源包${bundleName}，路径${url},加载失败`, err);
                }
            });
        });
    }

    /**
     * 加载预制体
     * @param bundleName ab包名（模块名）
     * @param assetName 资源名
     */
    public static loadPrefab<TBundleName extends BundleName, TAssetName = keyof BundleConfig['BundleName'][TBundleName]['prefab']>
        (bundleName: TBundleName, assetName: NoInfer<TAssetName>): Promise<Prefab> {
        return this.loadAsset(bundleName, assetName, Prefab);

    }

    /**
     * 加载音频
     * @param bundleName ab包名（模块名）
     * @param assetName 资源名
     */
    public static loadAudio<TBundleName extends BundleName, TAssetName = keyof BundleConfig['BundleName'][TBundleName]['sound']>
        (bundleName: TBundleName, assetName: NoInfer<TAssetName>): Promise<AudioClip> {
        return this.loadAsset(bundleName, assetName, AudioClip);
    }

    /**
     * 加载图片
     * @param bundleName ab包名（模块名）
     * @param assetName 资源名
     */
    public static loadTextre<TBundleName extends BundleName, TAssetName = keyof BundleConfig['BundleName'][TBundleName]['texture']>
        (bundleName: TBundleName, assetName: NoInfer<TAssetName>): Promise<SpriteFrame> {
        return this.loadAsset(bundleName, assetName, SpriteFrame);
    }


    /**
     * 通过资源相对路径释放资源
     * @param bundleName     ab包名（模块名）
     * @param assetName      资源名
     */
    public static release<T extends typeof Asset, TBundleName extends BundleName, TAssetName = keyof BundleConfig['BundleName'][TBundleName]['prefab'] | keyof BundleConfig['BundleName'][TBundleName]['sound'] | keyof BundleConfig['BundleName'][TBundleName]['texture']>
        (bundleName: TBundleName, assetName: TAssetName, assetType: T) {
        let str = this.getAssetUrl(assetType);
        // @ts-ignore
        let url: string = BundleConfig.BundleName[bundleName][str][assetName];
        // 兼容3.x ,加载 SpriteFrame 路径需要添加后缀
        if (assetType as any === SpriteFrame) {
            url += "/spriteFrame";
        }
        else if (assetType as any === Texture2D) {
            url += "/texture";
        }
        oops.res.release(url, bundleName);
    }
}