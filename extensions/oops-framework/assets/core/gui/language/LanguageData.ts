/*
 * @Author: dgflash
 * @Date: 2022-02-11 09:31:52
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-12 19:04:48
 */
export class LanguageData {
    /** 当前语言 */
    static current: string = "";
    /** 语言配置 */
    static data: any = {}

    public static getLangByID(labId: string): string {
        return LanguageData.data[labId] || labId;
    }
}