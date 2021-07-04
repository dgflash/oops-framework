/** ---------- 全局消息事件 ----------  */
export enum EngineMessage {
    /** 中途退出游戏后，再进入游戏 */
    GAME_ENTER = "EngineMessage.GAME_ENTER",
    /** 中途退出游戏 */
    GAME_EXIT = "EngineMessage.GAME_EXIT",
    /** 游戏尺寸修改事件 */
    GAME_RESIZE = "EngineMessage.GAME_RESIZE",
    /** engin开始事件 */
    ENGINE_START = "EngineMessage.ENGINE_START",
    /** 玩家登陆成功 */
    LOGIN_SUCCESS = 'EngineMessage.LOGIN_SUCCESS',
}
