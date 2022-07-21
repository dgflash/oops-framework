/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-21 19:24:17
 */
/** ---------- 全局消息事件 ----------  */
export enum EventMessage {
    /** 中途退出游戏后，再进入游戏 */
    GAME_ENTER = "EventMessage.GAME_ENTER",
    /** 中途退出游戏 */
    GAME_EXIT = "EventMessage.GAME_EXIT",
    /** 游戏尺寸修改事件 */
    GAME_RESIZE = "EventMessage.GAME_RESIZE"
}
