/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 10:05:12
 */
/** ---------- 全局消息事件 ----------  */
export enum EngineMessage {
    /** 中途退出游戏后，再进入游戏 */
    GAME_ENTER = "EngineMessage.GAME_ENTER",
    /** 中途退出游戏 */
    GAME_EXIT = "EngineMessage.GAME_EXIT",
    /** 游戏尺寸修改事件 */
    GAME_RESIZE = "EngineMessage.GAME_RESIZE"
}
