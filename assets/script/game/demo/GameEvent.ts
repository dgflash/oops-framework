/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:28:39
 * @LastEditors: luobao
 * @LastEditTime: 2022-01-04 18:37:32
 */

/** 游戏事件 */
export class GameEvent {
    /** 游戏服务器连接成功 */
    static GameServerConnected: string = "GameServerConnected";

    // 登陆成功
    static LOGIN_SUCCESS: string = "LOGIN_SUCCESS";

    // 请求玩家数据成功
    static REQUEST_PLAYER_SUCCESS: string = "REQUEST_PLAYER_SUCCESS";

    /**所有点击提示事件 */
    static COMMON_TOUCH_TIPS: string = "COMMON_TOUCH_TIPS";

    /**角色属性计算完成刷新所有相关界面*/
    static ALL_UI_REFRESH: string = "ALL_UI_REFRESH";

    /**时间跳转**/
    static GAME_DATE_JUMP: string = "GAME_DATE_JUMP";

    /**设置节日 **/
    static SET_HOLIDAY: string = "SET_HOLIDAY";

    /**购买物品更新背包数据后 **/
    static UPDATE_BAG_GOODS: string = "UPDATE_BAG_GOODS";

    /**建筑升级中 **/
    static BUILDING: string = "BUILDING";
}