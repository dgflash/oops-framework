/**
 * 正则工具
 */
export default class RegexUtil {
    /**
     * 判断字符是否为双字节字符（如中文字符）
     * @param string 原字符串
     */
    public static isDWORD(string: string): boolean {
        return /[^\x00-\xff]/.test(string);
    }
}
