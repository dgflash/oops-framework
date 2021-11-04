import { director, error, JsonAsset, warn } from "cc";
import { resLoader } from "../../common/loader/ResLoader";
import { Logger } from "../../common/log/Logger";
import { LanguageLabel } from "./LanguageLabel";
import { LanguageSprite } from "./LanguageSprite";

export default class LanguagePack {
    private _languageLabels: any = {};

    // 默认资源文件目录
    private _langjsonPath: string = "lang_json";
    private _langTexturePath: string = "lang_texture";

    /**
     * 设置多语言资源目录
     * @param langjsonPath 多语言json目录
     * @param langTexturePath 多语言图片目录
     */
    public setAssetsPath(langjsonPath: string, langTexturePath: string) {
        if (langjsonPath) {
            this._langjsonPath = langjsonPath;
        }
        if (langTexturePath) {
            this._langTexturePath = langTexturePath;
        }
    }

    /**
     * 刷新语言文字
     * @param lang 
     */
    public updateLanguage(lang: string) {
        let lanjson = resLoader.get(`${this._langjsonPath}/${lang}`, JsonAsset);
        if (lanjson && lanjson.json) {
            this._languageLabels = lanjson.json;
            let rootNodes = director.getScene()!.children;
            for (let i = 0; i < rootNodes.length; ++i) {
                // 更新所有的LanguageLabel节点
                let languagelabels = rootNodes[i].getComponentsInChildren(LanguageLabel);
                for (let j = 0; j < languagelabels.length; j++) {
                    languagelabels[j].language = lang;
                }
                // 更新所有的LanguageSprite节点
                let languagesprites = rootNodes[i].getComponentsInChildren(LanguageSprite);
                for (let j = 0; j < languagesprites.length; j++) {
                    languagesprites[j].language = lang;
                }
            }
        }
        else {
            warn("没有找到指定语言内容配置", lang);
        }
    }

    /**
     * 根据dataID，获取对应语言的字符
     * @param uuid 
     */
    public getLangByID(labId: string): string {
        return this._languageLabels[labId] || "";
    }

    /**
     * 下载对应语言包资源
     * @param lang 语言标识
     * @param callback 下载完成回调
     */
    public loadLanguageAssets(lang: string, callback: Function) {
        let lang_texture_path = `${this._langTexturePath}/${lang}`;
        let lang_json_path = `${this._langjsonPath}/${lang}`;
        resLoader.loadDir(lang_texture_path, (err: any) => {
            if (err) {
                error(err);
                callback(err);
                return;
            }
            Logger.logBusiness(lang_texture_path, "下载语言包 textures 资源");
            resLoader.load(lang_json_path, JsonAsset, (err) => {
                if (err) {
                    error(err);
                    callback(err);
                    return;
                }
                Logger.trace(lang_json_path, "下载语言包 json 资源");
                callback(err, lang);
            })
        })
    }
    /**
     * 释放某个语言的语言包资源包括json
     * @param lang 
     */
    public releaseLanguageAssets(lang: string) {
        let langpath = `${this._langTexturePath}/${lang}`;
        resLoader.releaseDir(langpath);
        Logger.logBusiness(langpath, "释放语言图片资源");

        let langjsonpath = `${this._langjsonPath}/${lang}`;
        resLoader.release(langjsonpath);
        Logger.logBusiness(langjsonpath, "释放语言文字资源");
    }
}