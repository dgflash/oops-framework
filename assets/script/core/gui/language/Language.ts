import { error, warn } from "cc";
import { EventDispatcher } from "../../common/event/EventDispatcher";
import { Logger } from "../../common/log/Logger";
import { LanguageData } from "./LanguageData";
import { LanguagePack } from "./LanguagePack";

export enum LanguageEvent {
    /** 语种变化事件 */
    CHANGE = 'LanguageEvent.CHANGE',
    /** 语种资源释放事件 */
    RELEASE_RES = "LanguageEvent.RELEASE_RES"
}
const DEFAULT_LANGUAGE = "zh";

export class LanguageManager extends EventDispatcher {
    private _support: Array<string> = ["zh", "en", "tr"];        // 支持的语言
    private _languagePack: LanguagePack = new LanguagePack();    // 语言包  

    /** 设置多语言系统支持哪些语种 */
    public set supportLanguages(supportLanguages: Array<string>) {
        this._support = supportLanguages;
    }

    /**
     * 获取当前语种
     */
    public get current(): string {
        return LanguageData.current;
    }

    /**
     * 获取支持的多语种数组
     */
    public get languages(): string[] {
        return this._support;
    }

    public isExist(lang: string): boolean {
        return this.languages.indexOf(lang) > -1;
    }

    /**
     * 获取下一个语种
     */
    public getNextLang(): string {
        let supportLangs = this.languages;
        let index = supportLangs.indexOf(LanguageData.current);
        let newLanguage = supportLangs[(index + 1) % supportLangs.length];
        return newLanguage;
    }

    /**
     * 改变语种，会自动下载对应的语种，下载完成回调
     * @param language 
     */
    public setLanguage(language: string, callback: (success: boolean) => void) {
        if (!language) {
            language = DEFAULT_LANGUAGE;
        }
        language = language.toLowerCase();
        let index = this.languages.indexOf(language);
        if (index < 0) {
            warn("当前不支持该语种" + language + " 将自动切换到 zh 语种!");
            language = DEFAULT_LANGUAGE;
        }
        if (language === LanguageData.current) {
            callback(false);
            return;
        }

        this.loadLanguageAssets(language, (err: any, lang: string) => {
            if (err) {
                error("语言资源包下载失败", err);
                callback(false);
                return;
            }

            Logger.logConfig(`当前语言为【${language}】`);
            LanguageData.current = language;
            this._languagePack.updateLanguage(language);
            this.dispatchEvent(LanguageEvent.CHANGE, lang);
            callback(true);
        });
    }

    /**
     * 设置多语言资源目录
     * @param langjsonPath 多语言json目录
     * @param langTexturePath 多语言图片目录
     */
    public setAssetsPath(langjsonPath: string, langTexturePath: string) {
        this._languagePack.setAssetsPath(langjsonPath, langTexturePath);
    }

    /**
     * 根据data获取对应语种的字符
     * @param labId 
     * @param arr 
     */
    public getLangByID(labId: string): string {
        return LanguageData.getLangByID(labId);
    }

    /**
     * 下载语言包素材资源
     * 包括语言json配置和语言纹理包
     * @param lang 
     * @param callback 
     */
    public loadLanguageAssets(lang: string, callback: Function) {
        lang = lang.toLowerCase();
        return this._languagePack.loadLanguageAssets(lang, callback);
    }

    /**
     * 释放不需要的语言包资源
     * @param lang 
     */
    public releaseLanguageAssets(lang: string) {
        lang = lang.toLowerCase();
        this._languagePack.releaseLanguageAssets(lang);
        this.dispatchEvent(LanguageEvent.RELEASE_RES, lang);
    }
}