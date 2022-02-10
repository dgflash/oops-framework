export class LanguageData {
    /** 当前语言 */
    static current: string = "";
    /** 语言配置 */
    static data: any = {}

    public static getLangByID(labId: string): string {
        return LanguageData.data[labId] || "";
    }
}