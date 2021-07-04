declare namespace MGOBE {
    /********************************* 玩家信息 ************************************/
    /**
     * @name 玩家信息
     * @description 该对象记录了玩家的基本信息，默认全部为空。成功初始化Listener之后，id、openId 属性将生效。
     * @description 玩家进入房间后，该对象的属性与 roomInfo.playerList 中当前玩家信息保持一致。
     * @description 玩家 ID 是 MGOBE 后台生成的 ID，openId 是开发者初始化时候使用的 ID。openId 只有初始化 Listener 的时候使用，其它接口的“玩家 ID”均指后台生成的 ID。
     * @field {string}  id  玩家ID
     * @field {string}  openId  玩家openId
     * @field {string}  name  玩家昵称
     * @field {string}  teamId  队伍ID
     * @field {number}  customPlayerStatus  自定义玩家状态
     * @field {string}  customProfile  自定义玩家属性
     * @field {MGOBE.types.NetworkState}  commonNetworkState  房间网络状态
     * @field {MGOBE.types.NetworkState}  relayNetworkState  帧同步网络状态
     */
    export const Player: {
        readonly id: string;
        readonly openId: string;
        readonly name: string;
        readonly teamId: string;
        readonly customPlayerStatus: number;
        readonly customProfile: string;
        readonly commonNetworkState: MGOBE.types.NetworkState;
        readonly relayNetworkState: MGOBE.types.NetworkState;
    };

    /********************************* SDK 枚举 *********************************/
    /**
     * @name 操作类型枚举
     * @enum {MGOBE.types.CreateRoomType}  CreateRoomType  创建房间方式
     * @enum {MGOBE.types.MatchType}  MatchType  匹配类型
     * @enum {MGOBE.types.NetworkState}  NetworkState  网络状态
     * @enum {MGOBE.types.FrameSyncState}  FrameSyncState  房间帧同步状态
     * @enum {MGOBE.types.RecvType}  RecvType  房间内消息接收者范围
     * @enum {MGOBE.types.GroupRecvType}  GroupRecvType  队组内消息接收者范围
     * @enum {MGOBE.types.GroupType}  GroupType  队组类型
     */
    export const ENUM: {
        readonly CreateRoomType: typeof MGOBE.types.CreateRoomType;
        readonly MatchType: typeof MGOBE.types.MatchType;
        readonly NetworkState: typeof MGOBE.types.NetworkState;
        readonly FrameSyncState: typeof MGOBE.types.FrameSyncState;
        readonly RecvType: typeof MGOBE.types.RecvType;
        readonly GroupRecvType: typeof MGOBE.types.GroupRecvType;
        readonly GroupType: typeof MGOBE.types.GroupType;
    };

    /********************************* SDK 随机数工具 *********************************/
    export const RandomUtil: {
        /**
         * @name 初始化随机数
         * @description init 方法接受一个 seed 为参数，RandomUtil 在后续生成随机数的过程中将以 seed 为种子。使用相同的 seed 初始化，调用 random 方法生成的随机数序列相同。
         * @param {number} seed 随机数种子
         * @returns {void}
         */
        init(seed: number): void;
        /**
         * @name 生成随机数
         * @description 如果种子相同、初始化后调用次数相同，生成的随机数将相同。
         * @returns {number} 随机数，范围为[0,1)
         */
        random(): number;
    };

    /********************************* SDK 日志打印 ************************************/
    export class DebuggerLog {
        static enable: boolean;
        static callback: (...logs: any[]) => any;
    }

    export const StatCallbacks: {
        onPingTime(time: number): any;
        onFitFrameTime(deltaTime: number): any;
        onBstFrameRate(deltaTime: number): any;
        onRenderFrameRate(deltaTime: number): any;
    };

    /********************************* Group 广播回调 *********************************/
    class GroupBroadcastHandler {
        /**
         * @name 新玩家加入队组广播回调接口
         * @description onJoinGroup 广播表示该队组有新玩家加入。队组内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.JoinGroupBst>} event 回调参数
         * @returns {void}
         */
        onJoinGroup: (event: MGOBE.types.BroadcastEvent<MGOBE.types.JoinGroupBst>) => any;
        /**
         * @name 玩家退出队组广播回调接口
         * @description onLeaveGroup 广播表示该队组有玩家退出。队组内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.LeaveGroupRsp>} event 回调参数
         * @returns {void}
         */
        onLeaveGroup: (event: MGOBE.types.BroadcastEvent<MGOBE.types.LeaveGroupRsp>) => any;
        /**
         * @name 队组被解散广播回调接口
         * @description onDismissGroup 广播表示队长解散了该队组。队组内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.DismissGroupBst>} event 回调参数
         * @returns {void}
         */
        onDismissGroup: (event: MGOBE.types.BroadcastEvent<MGOBE.types.DismissGroupBst>) => any;
        /**
         * @name 更新队组广播回调接口
         * @description onChangeGroup 广播表示修改了该队组属性。队组内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangeGroupBst>} event 回调参数
         * @returns {void}
         */
        onChangeGroup: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangeGroupBst>) => any;
        /**
         * @name 队组内玩家被移除广播回调接口
         * @description onRemoveGroupPlayer 广播表示有玩家被队长移除。队组内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.RemoveGroupPlayerBst>} event 回调参数
         * @returns {void}
         */
        onRemoveGroupPlayer: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RemoveGroupPlayerBst>) => any;
        /**
         * @name 队组内玩家网络状态变化广播回调接口
         * @description onChangeGroupPlayerNetworkState 广播表示 ID 为 changePlayerId 的玩家网络状态发生变化。
         * @description 玩家在队组中的网络变化都会触发该广播，因此 networkState 将有两种情况，分别表示队组中上下线。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangeGroupPlayerNetworkStateBst>} event 回调参数
         * @returns {void}
         */
        onChangeGroupPlayerNetworkState: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangeGroupPlayerNetworkStateBst>) => any;
        /**
         * @name 玩家自定义状态变化广播回调接口
         * @description onChangeCustomGroupPlayerStatus 广播表示队组内 ID 为 changePlayerId 的玩家状态发生变化。玩家状态由开发者自定义。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangeCustomGroupPlayerStatusBst>} event 回调参数
         * @returns {void}
         */
        onChangeCustomGroupPlayerStatus: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangeCustomGroupPlayerStatusBst>) => any;
        /**
         * @name 玩家自定义属性变化广播回调接口
         * @description onChangeGroupPlayerProfile 广播表示队组内 ID 为 changePlayerId 的玩家属性发生变化。玩家属性由开发者自定义。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangeGroupPlayerProfileBst>} event 回调参数
         * @returns {void}
         */
        onChangeGroupPlayerProfile: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangeCustomGroupPlayerStatusBst>) => any;
        /**
         * @name 收到队组内其他玩家消息广播回调接口
         * @description onRecvFromGroupClient 广播表示在队组内收到来自 ID 为 sendPlayerId 的玩家消息。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.RecvFromGroupClientBst>} event 回调参数
         * @returns {void}
         */
        onRecvFromGroupClient: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFromGroupClientBst>) => any;
    }
    /********************************* SDK Group对象 *********************************/
    export class Group extends GroupBroadcastHandler {

        /**
         * @name 构造器
         * @description 实例化 Group 对象时可以传入一个 MGOBE.types.GroupInfo 对象 groupInfo，后续接口调用都将基于该 groupInfo，例如修改该队组的属性、接收该队组的广播。
         * @description 如果不传 groupInfo 参数，开发者可以通过直接调用 initGroup、createGroup、joinGroup 等方法获取 groupInfo。
         * @description Group 对象会自动维护内部的 groupInfo 属性保持最新，开发者可以直接通过访问该属性获得最新的队组信息。
         * @param {MGOBE.types.GroupInfo} groupInfo 队组信息（可选）
         * @returns {void}
         */
        constructor(groupInfo?: MGOBE.types.GroupInfo);
        /**
         * @name 队组信息
         * @description groupInfo 为 Group 实例的属性，类型为 MGOBE.types.GroupInfo，调用 Group 相关的接口会导致该属性发生变化。
         */
        groupInfo: MGOBE.types.GroupInfo;
        /**
         * @name 初始化 Group 实例的队组信息，即更新 groupInfo 属性
         * @description initGroup 会更新 Group 实例的 groupInfo，接受 MGOBE.types.GroupInfo 或 { id: string; } 类型的参数。
         * @description 如果不传参数，该方法将清空 Group 实例的 groupInfo 属性。
         * @description 当玩家需要加入指定 id 队组时，需要使用该接口初始化 Group 实例的 groupInfo 属性，然后才能通过调用 joinGroup 方法加入该 Group 实例所代表的队组。
         * @param {MGOBE.types.GroupInfo 或 { id: string }} groupInfo  初始化参数，id表示队组ID（可选）
         * @returns {void}
         */
        initGroup(groupInfo?: MGOBE.types.GroupInfo | {
            id: string;
        }): void;
        /**
         * @name 队组信息更新回调接口
         * @description onUpdate 表明 Group 实例的 groupInfo 信息发生变化，这种变化原因包括各种队组操作、广播、本地网络状态变化等。
         * @param {Group} group 更新的Group实例（可选）
         * @returns {void}
         */
        onUpdate(group?: Group): void;
        /**
         * @name 通过队组 ID 获取队组信息
         * @description 调用结果将在 callback 中异步返回。
         * @description 该接口为 Group 的静态方法，只能通过 Group.getGroupByGroupId 方式调用，Group 实例无法直接访问该方法。
         * @param {MGOBE.types.GetGroupByGroupIdPara} getGroupByGroupIdPara 获取队组参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.GetGroupByGroupIdRsp>} callback  响应回调函数
         * @returns {void}
         */
        static getGroupByGroupId(getGroupByGroupIdPara: MGOBE.types.GetGroupByGroupIdPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.GetGroupByGroupIdRsp>): void;
        /**
         * @name 获取当前玩家队组信息
         * @description 调用结果将在 callback 中异步返回。
         * @description 该接口为 Group 的静态方法，只能通过 Group.getMyGroups 方式调用，Group 实例无法直接访问该方法。
         * @param {MGOBE.types.ReqCallback<MGOBE.types.GetMyGroupsRsp>} callback  响应回调函数
         * @returns {void}
         */
        static getMyGroups(callback?: MGOBE.types.ReqCallback<MGOBE.types.GetMyGroupsRsp>): void;
        /**
         * @name 创建队组
         * @description 调用结果将在 callback 中异步返回。操作成功后，groupInfo 属性将更新。
         * @param {MGOBE.types.CreateGroupPara} createGroupPara 创建队组参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.CreateGroupRsp>} callback  响应回调函数
         * @returns {void}
         */
        createGroup(createGroupPara: MGOBE.types.CreateGroupPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.CreateGroupRsp>): void;
        /**
         * @name 获取Group实例的队组信息
         * @description 调用结果将在 callback 中异步返回。操作成功后，groupInfo 属性将更新。
         * @param {MGOBE.types.ReqCallback<MGOBE.types.GetGroupByGroupIdRsp>} callback  响应回调函数
         * @returns {void}
         */
        getGroupDetail(callback?: MGOBE.types.ReqCallback<MGOBE.types.GetGroupByGroupIdRsp>): void;
        /**
         * @name 加入队组
         * @description 调用结果将在 callback 中异步返回。
         * @description 该接口加入的队组是 Group 实例所代表的队组，如果该 Group 实例的 groupInfo 不存在队组ID，则需要使用队组ID通过 initGroup 方法初始化 Group 实例。
         * @description 加入队组成功后，队组内全部成员（不含调用者）都会收到一条玩家加入队组广播 onJoinGroup，groupInfo 属性将更新。
         * @description 玩家可以加入多个 GROUP_MANY 类型队组（type 为 GroupType.GROUP_MANY），同时加入的数量上限为5个。
         * @description 玩家最多只能加入1个 GROUP_LIMITED 类型队组（type 为 GroupType.GROUP_LIMITED）。
         * @param {MGOBE.types.JoinGroupPara} joinGroupPara 加入队组参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.JoinGroupRsp>} callback  响应回调函数
         * @returns {void}
         */
        joinGroup(joinGroupPara: MGOBE.types.JoinGroupPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.JoinGroupRsp>): void;
        /**
         * @name 离开队组
         * @description 调用结果将在 callback 中异步返回。退出成功后，队组内剩余成员（不含调用者）都会收到一条玩家退出队组广播 onLeaveGroup，groupInfo 属性将更新，groupInfo.groupPlayerList 中将没有该玩家信息。
         * @description 离开队组后，如果队组内还剩下其他玩家，则该 Group 实例仍然代表退房前的队组，可以继续调用 group.initGroup() 清除队组信息。
         * @param {object} para  预留参数，传{}即可
         * @param {MGOBE.types.ReqCallback<MGOBE.types.LeaveGroupRsp>} callback  响应回调函数
         * @returns {void}
         */
        leaveGroup(para: {}, callback?: MGOBE.types.ReqCallback<MGOBE.types.LeaveGroupRsp>): void;
        /**
         * @name 解散队组
         * @description 调用结果将在 callback 中异步返回。解散成功后，队组内全部成员（不含调用者）都会收到一条解散队组广播 onDismissGroup，groupInfo 属性将更新。
         * @description 只有队长有权限解散队组
         * @param {object} para  预留参数，传{}即可
         * @param {MGOBE.types.ReqCallback<MGOBE.types.DismissGroupRsp>} callback  响应回调函数
         * @returns {void}
         */
        dismissGroup(para: {}, callback?: MGOBE.types.ReqCallback<MGOBE.types.DismissGroupRsp>): void;
        /**
         * @name 更新队组信息
         * @description 调用结果将在 callback 中异步返回。调用成功后，队组内全部成员都会收到一条更新队组广播 onChangeGroup，groupInfo 属性将更新。
         * @description 只有队长有权限修改队组
         * @param {MGOBE.types.ChangeGroupPara} changeGroupPara 更新队组参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.ChangeGroupRsp>} callback  响应回调函数
         * @returns {void}
         */
        changeGroup(changeGroupPara: MGOBE.types.ChangeGroupPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.ChangeGroupRsp>): void;
        /**
         * @name 移除队组内玩家
         * @description 调用结果将在 callback 中异步返回。调用成功后，队组内全部成员都会收到一条队组内玩家被移除广播 onRemoveGroupPlayer，groupInfo 属性将更新。
         * @description 只有队长有权限移除玩家
         * @param {MGOBE.types.RemoveGroupPlayerPara} removeGroupPlayerPara 移除队组内玩家参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.RemoveGroupPlayerRsp>} callback  响应回调函数
         * @returns {void}
         */
        removeGroupPlayer(removeGroupPlayerPara: MGOBE.types.RemoveGroupPlayerPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.RemoveGroupPlayerRsp>): void;
        /**
         * @name 修改队组玩家自定义状态
         * @description 修改玩家状态是修改 GroupPlayerInfo 中的 customGroupPlayerStatus 字段，玩家的状态由开发者自定义。
         * @description 修改成功后，队组内全部成员都会收到一条修改玩家状态广播 onChangeCustomGroupPlayerStatus，groupInfo 属性将更新。
         * @description 每个玩家只能修改自己的状态，调用结果将在 callback 中异步返回。
         * @param {MGOBE.types.ChangeCustomGroupPlayerStatusPara} changeCustomGroupPlayerStatusPara 修改队组玩家自定义状态参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.ChangeCustomGroupPlayerStatusRsp>} callback  响应回调函数
         * @returns {void}
         */
        changeCustomGroupPlayerStatus(changeCustomGroupPlayerStatusPara: MGOBE.types.ChangeCustomGroupPlayerStatusPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.ChangeCustomGroupPlayerStatusRsp>): void;
        /**
         * @name 修改队组玩家自定义属性
         * @description 修改玩家属性是修改 GroupPlayerInfo 中的 customGroupPlayerProfile 字段，玩家的属性由开发者自定义。
         * @description 修改成功后，队组内全部成员都会收到一条修改玩家属性广播 onChangeGroupPlayerProfile，groupInfo 属性将更新。
         * @description 每个玩家只能修改自己的属性，调用结果将在 callback 中异步返回。
         * @param {MGOBE.types.ChangeGroupPlayerProfilePara} changeGroupPlayerProfilePara 修改队组玩家自定义属性参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.ChangeGroupPlayerProfileRsp>} callback  响应回调函数
         * @returns {void}
         */
        changeGroupPlayerProfile(changeGroupPlayerProfilePara: MGOBE.types.ChangeGroupPlayerProfilePara, callback?: MGOBE.types.ReqCallback<MGOBE.types.ChangeGroupPlayerProfileRsp>): void;
        /**
         * @name 发送队组内消息
         * @description 调用结果将在 callback 中异步返回。调用成功后所指定的接收消息的玩家将收到 onRecvFromGroupClient 广播。
         * @description 当 recvType 值为 1 （即 GROUP_ALL ） 时，队组内全部玩家将收到消息；
         * @description 当 recvType 值为 2 （即 GROUP_OTHERS ） 时，队组内除消息发送者外的其他玩家将收到消息；
         * @description 当 recvType 值为 3 （即 GROUP_SOME ） 时，接收消息玩家才由 recvPlayerList 决定。
         * @param {MGOBE.types.SendToGroupClientPara} sendToGroupClientPara 发送队组内消息参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.SendToGroupClientRsp>} callback  响应回调函数
         * @returns {void}
         */
        sendToGroupClient(sendToGroupClientPara: MGOBE.types.SendToGroupClientPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.SendToGroupClientRsp>): void;
    }

    /********************************* Room 广播回调 *********************************/
    class RoomBroadcastHandler {
        /**
         * @name 匹配结束广播
         * @description onMatch 广播表示组队匹配结束。匹配成功或者匹配超时后，全部小组成员都会收到该广播。
         * @description 使用 event.data.errCode 判断是否匹配成功。
         * @description 注意该方法为 Room 类的静态方法。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.MatchBst>} event 回调参数
         * @returns {void}
         */
        static onMatch: (event: MGOBE.types.BroadcastEvent<MGOBE.types.MatchBst>) => any;
        /**
         * @name 取消匹配广播
         * @description onCancelMatch 广播表示成功取消 matchPlayers、matchGroup。调用者或全部小组成员都会收到该广播。
         * @description 注意该方法为 Room 类的静态方法。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.CancelMatchBst>} event 回调参数
         * @returns {void}
         */
        static onCancelMatch: (event: MGOBE.types.BroadcastEvent<MGOBE.types.CancelMatchBst>) => any;
        /**
         * @name 新玩家加入房间广播回调接口
         * @description onJoinRoom 广播表示该房间有新玩家加入。房间内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.JoinRoomBst>} event 回调参数
         * @returns {void}
         */
        onJoinRoom: (event: MGOBE.types.BroadcastEvent<MGOBE.types.JoinRoomBst>) => any;
        /**
         * @name 玩家退出房间广播回调接口
         * @description onLeaveRoom 广播表示该房间有玩家退出。房间内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.LeaveRoomBst>} event 回调参数
         * @returns {void}
         */
        onLeaveRoom: (event: MGOBE.types.BroadcastEvent<MGOBE.types.LeaveRoomBst>) => any;
        /**
         * @name 房间被解散广播回调接口
         * @description onDismissRoom 广播表示房主解散了该房间。房间内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.DismissRoomBst>} event 回调参数
         * @returns {void}
         */
        onDismissRoom: (event: MGOBE.types.BroadcastEvent<MGOBE.types.DismissRoomBst>) => any;
        /**
         * @name 房主修改房间信息广播回调接口
         * @description onChangeRoom 广播表示房主修改了该房间属性。房间内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangeRoomBst>} event 回调参数
         * @returns {void}
         */
        onChangeRoom: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangeRoomBst>) => any;
        /**
         * @name 房间内玩家被移除广播回调接口
         * @description onRemovePlayer 广播表示有玩家被房主移除。房间内全部成员都会收到该广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.RemovePlayerBst>} event 回调参数
         * @returns {void}
         */
        onRemovePlayer: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RemovePlayerBst>) => any;
        /**
         * @name 收到房间内其他玩家消息广播回调接口
         * @description onRecvFromClient 广播表示收到来自 ID 为 sendPlayerId 的玩家消息。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.RecvFromClientBst>} event 回调参数
         * @returns {void}
         */
        onRecvFromClient: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFromClientBst>) => any;
        /**
         * @name 收到自定义服务消息广播回调接口
         * @description onRecvFromGameSvr 广播表示收到来自自定义服务的消息。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.RecvFromGameSvrBst>} event 回调参数
         * @returns {void}
         */
        onRecvFromGameSvr: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFromGameSvrBst>) => any;
        /**
         * @name 房间内玩家网络状态变化广播回调接口
         * @description onChangePlayerNetworkState 广播表示 ID 为 changePlayerId 的玩家网络状态发生变化。
         * @description 玩家在房间中、帧同步中的网络变化都会触发该广播，因此 networkState 将有四中情况，分别表示房间中上下线、帧同步中上下线。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangePlayerNetworkStateBst>} event 回调参数
         * @returns {void}
         */
        onChangePlayerNetworkState: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangePlayerNetworkStateBst>) => any;
        /**
         * @name 玩家自定义状态变化广播回调接口
         * @description onChangeCustomPlayerStatus 广播表示房间内 ID 为 changePlayerId 的玩家状态发生变化。玩家状态由开发者自定义。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangeCustomPlayerStatusBst>} event 回调参数
         * @returns {void}
         */
        onChangeCustomPlayerStatus: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangeCustomPlayerStatusBst>) => any;
        /**
         * @name 玩家自定义属性变化广播回调接口
         * @description onChangeRoomPlayerProfile 广播表示房间内 ID 为 changePlayerId 的玩家状态发生变化。玩家状态由开发者自定义。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ChangeRoomPlayerProfileBst>} event 回调参数
         * @returns {void}
         */
        onChangeRoomPlayerProfile: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ChangeRoomPlayerProfileBst>) => any;
        /**
         * @name 开始帧同步广播回调接口
         * @description onStartFrameSync 广播表示房间开始帧同步。收到该广播后将持续收到 onRecvFrame 广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.StartFrameSyncBst>} event 回调参数
         * @returns {void}
         */
        onStartFrameSync: (event: MGOBE.types.BroadcastEvent<MGOBE.types.StartFrameSyncBst>) => any;
        /**
         * @name 停止帧同步广播回调接口
         * @description onStopFrameSync 广播表示房间停止帧同步。收到该广播后将不再收到 onRecvFrame 广播。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.StopFrameSyncBst>} event 回调参数
         * @returns {void}
         */
        onStopFrameSync: (event: MGOBE.types.BroadcastEvent<MGOBE.types.StopFrameSyncBst>) => any;
        /**
         * @name 房间帧消息广播回调接口
         * @description onRecvFrame 广播表示收到一个帧 frame，frame 的内容由多个 MGOBE.types.FrameItem 组成，即一帧时间内房间内所有玩家向服务器发送帧消息的集合。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.RecvFrameBst>} event 回调参数
         * @returns {void}
         */
        onRecvFrame: (event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFrameBst>) => any;
        /**
         * @name 自动补帧失败回调接口
         * @description onAutoRequestFrameError 表示自动补帧失败，在初始化 Listener 时开启自动补帧后才能触发。
         * @description 发生补帧失败后，将不能收到帧广播，开发者可以使用 retryAutoRequestFrame 方法重试自动补帧。
         * @param {MGOBE.types.BroadcastEvent<MGOBE.types.ResponseEvent<MGOBE.types.RequestFrameRsp>>} event 回调参数
         * @returns {void}
         */
        onAutoRequestFrameError: (event: MGOBE.types.BroadcastEvent<MGOBE.types.ResponseEvent<MGOBE.types.RequestFrameRsp>>) => any;
    }
    /********************************* SDK Room对象 *********************************/
    export class Room extends RoomBroadcastHandler {

        /**
         * @name 构造器
         * @description 实例化 Room 对象时可以传入一个 MGOBE.types.RoomInfo 对象 roomInfo，后续接口调用都将基于该 roomInfo，例如修改该房间的属性、接收该房间的广播。
         * @description 如果不传 roomInfo 参数，开发者可以通过直接调用 initRoom、createRoom、joinRoom 等方法获取 roomInfo。
         * @description Room 对象会自动维护内部的 roomInfo 属性保持最新，开发者可以直接通过访问该属性获得最新的房间信息。
         * @param {MGOBE.types.RoomInfo} roomInfo 房间信息（可选）
         * @returns {void}
         */
        constructor(roomInfo?: MGOBE.types.RoomInfo);
        /**
         * @name 房间信息
         * @description roomInfo 为 Room 实例的属性，类型为 MGOBE.types.RoomInfo，调用 Room 相关的接口会导致该属性发生变化。
         */
        roomInfo: MGOBE.types.RoomInfo;
        /**
         * @name 获取房间列表
         * @description 调用结果将在 callback 中异步返回。
         * @description 该接口为 Room 的静态方法，只能通过 Room.getRoomList 方式调用，Room 实例无法直接访问该方法。
         * @param {MGOBE.types.GetRoomListPara} getRoomListPara  获取房间列表参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.GetRoomListRsp>} callback  响应回调函数
         * @returns {void}
         */
        static getRoomList(getRoomListPara: MGOBE.types.GetRoomListPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.GetRoomListRsp>): void;
        /**
         * @name 根据房间 ID 获取房间
         * @description 调用结果将在 callback 中异步返回。
         * @description 该接口为 Room 的静态方法，只能通过 Room.getRoomByRoomId 方式调用，Room 实例无法直接访问该方法。
         * @description 如果参数中的 roomId 为空字符串，将查询玩家所在的房间。
         * @param {MGOBE.types.GetRoomByRoomIdPara} getRoomByRoomIdPara  获取房间参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.GetRoomByRoomIdRsp>} callback  响应回调函数
         * @returns {void}
         */
        static getRoomByRoomId(getRoomByRoomIdPara: MGOBE.types.GetRoomByRoomIdPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.GetRoomByRoomIdRsp>): void;
        /**
         * @name 查询玩家所在的房间信息
         * @description 调用结果将在 callback 中异步返回。
         * @description 该接口为 Room 的静态方法，只能通过 Room.getMyRoom 方式调用，Room 实例无法直接访问该方法。
         * @param {MGOBE.types.ReqCallback<MGOBE.types.GetRoomByRoomIdRsp>} callback  响应回调函数
         * @returns {void}
         */
        static getMyRoom(callback?: MGOBE.types.ReqCallback<MGOBE.types.GetRoomByRoomIdRsp>): void;
        /**
         * @name 初始化 Room 实例的房间信息，即更新 roomInfo 属性
         * @description initRoom 会更新 Room 实例的 roomInfo，接受 MGOBE.types.RoomInfo 或 { id: string; } 类型的参数。
         * @description 如果参数为 MGOBE.types.RoomInfo 类型，SDK将自动更新 WebSocket 连接。如果参数为 { id: string; } 类型，需要调用 getRoomDetail 或 joinRoom 方法才能更新 WebSocket 连接，否则可能不能及时收到房间广播。
         * @description 如果不传参数，该方法将清空 Room 实例的 roomInfo 属性，此时调用 getRoomDetail 方法将查询玩家所在的房间。
         * @description 当玩家需要加入指定 id 房间时，需要使用该接口初始化 Room 实例的 roomInfo 属性，然后才能通过调用 joinRoom 方法加入该 Room 实例所代表的房间。
         * @param {MGOBE.types.RoomInfo 或 { id: string }} roomInfo  初始化参数，id表示房间id
         * @returns {void}
         */
        initRoom(roomInfo?: MGOBE.types.RoomInfo | {
            id: string;
        }): void;
        /**
         * @name 房间信息更新回调接口
         * @description onUpdate 表明 Room 实例的 roomInfo 信息发生变化，这种变化原因包括各种房间操作、房间广播、本地网络状态变化等。
         * @description 开发者可以在该接口中更新游戏画面，或者使用 networkState 属性判断网络状态。
         * @param {Room} room 更新的Room实例（可选）
         * @returns {void}
         */
        onUpdate(room?: Room): void;
        /**
         * @name 该属性为只读属性，用于获取客户端本地 SDK 网络状态
         * @description 该属性类型为 ```{ COMMON: boolean, RELAY: boolean }``` 。COMMON 表示房间网络状态；RELAY 表示帧同步网络状态。为 true 时表示网络已连接，为 false 时表示网络未连接。
         * @description 该网络状态与玩家信息中的网络状态（Player.commonNetworkState/Player.relayNetworkState）概念不同，前者表示本地 socket 状态，后者表示玩家在 MGOBE 后台中的状态。
         * @description 本地 socket 网络状态变化时，onUpdate 将被触发。
         */
        readonly networkState: {
            COMMON: boolean;
            RELAY: boolean;
        };
        /**
         * @name 创建房间
         * @description createRoom 调用结果将在 callback 中异步返回。操作成功后，roomInfo 属性将更新。
         * @description 创建房间成功后，玩家自动进入该房间，因此无法继续调用 joinRoom、matchPlayers 等方法，可以利用房间ID邀请其他玩家进入该房间。
         * @param {MGOBE.types.CreateRoomPara} createRoomPara  创建房间参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.CreateRoomRsp>} callback  响应回调函数
         * @returns {void}
         */
        createRoom(createRoomPara: MGOBE.types.CreateRoomPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.CreateRoomRsp>): void;
        /**
         * @name 创建团队房间
         * @description createTeamRoom 调用结果将在 callback 中异步返回。操作成功后，roomInfo 属性将更新。
         * @description 创建房间成功后，玩家自动进入该房间，因此无法继续调用 joinRoom、matchPlayers 等方法。
         * @description 参数中的“房间最大玩家数量”要求能被“队伍数量”整除，创建成功后每个队伍的“队伍最小人数”为1，“队伍最大人数”为整除结果。
         * @param {MGOBE.types.CreateTeamRoomPara} createTeamRoomPara  创建团队房间参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.CreateRoomRsp>} callback  响应回调函数
         * @returns {void}
         */
        createTeamRoom(createTeamRoomPara: MGOBE.types.CreateTeamRoomPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.CreateRoomRsp>): void;
        /**
         * @name 加入房间
         * @description joinRoom 调用结果将在 callback 中异步返回。
         * @description 该接口加入的房间是 Room 实例所代表的房间，如果该 Room 实例的 roomInfo 不存在 roomId，则需要使用 roomId 通过 initRoom 方法初始化 Room 实例。
         * @description 加房成功后，房间内全部成员（包含调用者）都会收到一条玩家加入房间广播 onJoinRoom，roomInfo 属性将更新。
         * @param {MGOBE.types.JoinRoomPara} joinRoomPara  加入房间参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.JoinRoomRsp>} callback  响应回调函数
         * @returns {void}
         */
        joinRoom(joinRoomPara: MGOBE.types.JoinRoomPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.JoinRoomRsp>): void;
        /**
         * @name 加入团队房间
         * @description joinTeamRoom 调用结果将在 callback 中异步返回。
         * @description 与 joinRoom 类似，该接口加入的房间是 Room 实例所代表的房间。teamId 为 roomInfo.teamList 中定义的队伍 ID。
         * @param {MGOBE.types.JoinTeamRoomPara} joinTeamRoomPara  加入团队房间参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.JoinRoomRsp>} callback  响应回调函数
         * @returns {void}
         */
        joinTeamRoom(joinTeamRoomPara: MGOBE.types.JoinTeamRoomPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.JoinRoomRsp>): void;
        /**
         * @name 退出房间
         * @description leaveRoom 调用结果将在 callback 中异步返回。退出成功后，房间内剩余成员（不含调用者）都会收到一条玩家退出房间广播 onLeaveRoom，roomInfo 属性将更新，roomInfo.playerList 中将没有该玩家信息。
         * @description 退房后，如果房间内还剩下其他玩家，则该 room 实例仍然代表退房前的房间，可以继续调用 room.initRoom() 清除房间信息。
         * @param {object} para  预留参数，传{}即可
         * @param {MGOBE.types.ReqCallback<MGOBE.types.LeaveRoomRsp>} callback 响应回调函数
         * @returns {void}
         */
        leaveRoom(para: {}, callback?: MGOBE.types.ReqCallback<MGOBE.types.LeaveRoomRsp>): void;
        /**
         * @name 解散房间
         * @description dismissRoom 调用结果将在 callback 中异步返回。解散成功后，房间内全部成员（不含调用者）都会收到一条解散房间广播 onDismissRoom，roomInfo 属性将更新。
         * @description 只有房主有权限解散房间
         * @param {object} para  预留参数，传{}即可
         * @param {MGOBE.types.ReqCallback<MGOBE.types.DismissRoomRsp>} callback 响应回调函数
         * @returns {void}
         */
        dismissRoom(para: {}, callback?: MGOBE.types.ReqCallback<MGOBE.types.DismissRoomRsp>): void;
        /**
         * @name 修改房间信息
         * @description changeRoom 调用结果将在 callback 中异步返回。修改成功后，房间内全部成员都会收到一条修改房间广播 onChangeRoom，roomInfo 属性将更新。
         * @description 只有房主有权限修改房间
         * @param {MGOBE.types.ChangeRoomPara} changeRoomPara  修改房间参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.ChangeRoomRsp>} callback  响应回调函数
         * @returns {void}
         */
        changeRoom(changeRoomPara: MGOBE.types.ChangeRoomPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.ChangeRoomRsp>): void;
        /**
         * @name 修改玩家自定义状态
         * @description 修改玩家状态是修改 PlayerInfo 中的 customPlayerStatus 字段，玩家的状态由开发者自定义。
         * @description 修改成功后，房间内全部成员都会收到一条修改玩家状态广播 onChangeCustomPlayerStatus，roomInfo 属性将更新。
         * @description 每个玩家只能修改自己的状态，调用结果将在 callback 中异步返回。
         * @param {MGOBE.types.ChangeCustomPlayerStatusPara} changeCustomPlayerStatusPara  修改玩家状态参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.ChangeCustomPlayerStatusRsp>} callback  响应回调函数
         * @returns {void}
         */
        changeCustomPlayerStatus(changeCustomPlayerStatusPara: MGOBE.types.ChangeCustomPlayerStatusPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.ChangeCustomPlayerStatusRsp>): void;
        /**
         * @name 修改玩家自定义属性
         * @description 修改玩家属性是修改 PlayerInfo 中的 customProfile 字段，玩家的属性由开发者自定义。
         * @description 修改成功后，房间内全部成员都会收到一条修改玩家属性广播 onChangeRoomPlayerProfile，roomInfo 属性将更新。
         * @description 每个玩家只能修改自己的属性，调用结果将在 callback 中异步返回。
         * @param {MGOBE.types.ChangeRoomPlayerProfilePara} changeRoomPlayerProfilePara  修改玩家属性参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.ChangeRoomPlayerProfileRsp>} callback  响应回调函数
         * @returns {void}
         */
        changeRoomPlayerProfile(changeRoomPlayerProfilePara: MGOBE.types.ChangeRoomPlayerProfilePara, callback?: MGOBE.types.ReqCallback<MGOBE.types.ChangeRoomPlayerProfileRsp>): void;
        /**
         * @name 移除房间内玩家
         * @description 调用结果将在 callback 中异步返回。移除玩家成功后，房间内全部成员都会收到一条移除玩家广播 onRemovePlayer，roomInfo 属性将更新。
         * @description 只有房主有权限移除其他玩家
         * @param {MGOBE.types.RemovePlayerPara} removePlayerPara 移除房间内玩家参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.RemovePlayerRsp>} callback  响应回调函数
         * @returns {void}
         */
        removePlayer(removePlayerPara: MGOBE.types.RemovePlayerPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.RemovePlayerRsp>): void;
        /**
         * @name 获取Room实例的房间信息
         * @description 该接口获取的是 Room 实例的房间信息，调用结果将在 callback 中异步返回。
         * @description 如果该 Room 实例中的 roomInfo 属性没有 ID，该接口将查询玩家所在的房间。
         * @description 如果 roomInfo 属性含有 ID，则查询该 ID 对应的房间信息。
         * @description 操作成功后，roomInfo 属性将更新。
         * @description 如果需要获取指定 ID 的房间信息，可以使用 getRoomByRoomId 方法。
         * @param {MGOBE.types.ReqCallback<MGOBE.types.GetRoomByRoomIdRsp>} callback  响应回调函数
         * @returns {void}
         */
        getRoomDetail(callback?: MGOBE.types.ReqCallback<MGOBE.types.GetRoomByRoomIdRsp>): void;
        /**
         * @name 多人在线匹配
         * @description 调用该接口后将发起多人在线匹配，callback 将异步返回调用结果。返回码为0表示调用成功。
         * @description 调用成功后，Room.onMatch、Room.onCancelMatch 将回调匹配结果。
         * @description 该接口需要与匹配规则配合使用，因此，匹配超时时间由开发者在匹配规则中定义。开发者需要在控制台上创建匹配，得到匹配 Code 作为该方法的参数 matchCode。
         * @description matchPlayersPara.playerInfo 中的 matchAttributes 数组对应匹配规则中定义的 playerAttributes，playerAttributes 的每一种属性都要填入 matchAttributes 中，name 表示属性名，value 表示玩家该属性的值。
         * @param {MGOBE.types.MatchPlayersPara} matchPlayersPara  多人匹配参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.MatchPlayersRsp>} callback  响应回调函数
         * @returns {void}
         */
        matchPlayers(matchPlayersPara: MGOBE.types.MatchPlayersPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.MatchPlayersRsp>): void;
        /**
         * @name 组队匹配
         * @description 调用该接口后将以 playerInfoList 为小组一起进行匹配，callback 将异步返回调用结果。
         * @description 调用成功后，Room.onMatch、Room.onCancelMatch 将回调匹配结果。小组成员都可以通过 cancelPlayerMatch 取消匹配。
         * @description 匹配成功后，小组成员都会进入同一个房间，同一个队伍。
         * @description 该接口需要与匹配规则配合使用，匹配超时时间由开发者在匹配规则中定义。开发者需要在控制台上创建匹配，得到匹配 Code 作为该方法的参数 matchCode。
         * @description 根据匹配规则的不同，房间内的队伍可能包含多个小组。比如4V4的匹配（两个队伍），如果小组成员数为2，那么同一个队伍将由两个小组组成。
         * @param {MGOBE.types.MatchGroupPara} matchGroupPara  多人匹配参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.MatchGroupRsp>} callback  响应回调函数
         * @returns {void}
         */
        matchGroup(matchGroupPara: MGOBE.types.MatchGroupPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.MatchGroupRsp>): void;
        /**
         * @name 房间匹配
         * @description 调用该接口后将发起房间匹配，匹配结果将在 callback 中异步返回。操作成功后，Room 对象内部 roomInfo 属性将更新。
         * @description 房间匹配是指按照传入的参数搜索现存的房间，如果存在，则将玩家加入该房间；如果不存在，则为玩家创建并加入一个新房间。
         * @param {MGOBE.types.MatchRoomPara} matchRoomPara  房间匹配参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.MatchRoomSimpleRsp>} callback  响应回调函数
         * @returns {void}
         */
        matchRoom(matchRoomPara: MGOBE.types.MatchRoomPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.MatchRoomSimpleRsp>): void;
        /**
         * @name 取消玩家匹配
         * @description 该接口作用是取消匹配请求，即 matchPlayers、matchGroup 请求。调用结果将在 callback 中异步返回。
         * @description cancelMatchPara.matchType 需要设置为 MGOBE.ENUM.MatchType.PLAYER_COMPLEX。
         * @param {MGOBE.types.CancelMatchPara} cancelMatchPara  取消匹配参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.CancelMatchRsp>} callback  响应回调函数
         * @returns {void}
         */
        cancelPlayerMatch(cancelMatchPara: MGOBE.types.CancelPlayerMatchPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.CancelPlayerMatchRsp>): void;
        /**
         * @name 开始帧同步
         * @description 调用结果将在 callback 中异步返回。调用成功后房间内全部成员将收到 onStartFrameSync 广播。该接口会修改房间帧同步状态为“已开始帧同步”。
         * @description 房间内任意一个玩家成功调用该接口将导致全部玩家开始接收帧广播。
         * @param {object} para  预留参数，传{}即可
         * @param {MGOBE.types.ReqCallback<MGOBE.types.StartFrameSyncRsp>} callback  响应回调函数
         * @returns {void}
         */
        startFrameSync(para: {}, callback?: MGOBE.types.ReqCallback<MGOBE.types.StartFrameSyncRsp>): void;
        /**
         * @name 停止帧同步
         * @description 调用结果将在 callback 中异步返回。调用成功后房间内全部成员将收到 onStopFrameSync 广播。该接口会修改房间帧同步状态为“已停止帧同步”。
         * @description 房间内任意一个玩家成功调用该接口将导致全部玩家停止接收帧广播。
         * @param {object} para  预留参数，传{}即可
         * @param {MGOBE.types.ReqCallback<MGOBE.types.StoptFrameSyncRsp>} callback  响应回调函数
         * @returns {void}
         */
        stopFrameSync(para: {}, callback?: MGOBE.types.ReqCallback<MGOBE.types.StopFrameSyncRsp>): void;
        /**
         * @name 发送帧同步数据
         * @description 帧数据内容 data 类型为普通 object，由开发者自定义，目前支持最大长度不超过1k。
         * @description 后台将集合全部玩家的帧数据，并以一定时间间隔（由房间帧率定义）通过 onRecvFrame 广播给各客户端。调用结果将在 callback 中异步返回。
         * @description 只有房间处于“已开始帧同步”状态才能调用该接口。
         * @param {MGOBE.types.SendFramePara} sendFramePara  发送帧同步数据参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.SendFrameRsp>} callback  响应回调函数
         * @returns {void}
         */
        sendFrame(sendFramePara: MGOBE.types.SendFramePara, callback?: MGOBE.types.ReqCallback<MGOBE.types.SendFrameRsp>): void;
        /**
         * @name 请求补帧
         * @description 调用结果将在 callback 中异步返回。
         * @param {MGOBE.types.RequestFramePara} requestFramePara  请求补帧参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.RequestFrameRsp>} callback  响应回调函数
         * @returns {void}
         */
        requestFrame(requestFramePara: MGOBE.types.RequestFramePara, callback?: MGOBE.types.ReqCallback<MGOBE.types.RequestFrameRsp>): void;
        /**
         * @name 重试自动补帧
         * @description 当收到 onAutoRequestFrameError 回调时，表示自动补帧失败，可以使用该方法重新触发自动补帧。
         * @returns {void}
         */
        retryAutoRequestFrame(): void;
        /**
         * @name 发送消息给房间内玩家
         * @description 调用结果将在 callback 中异步返回。调用成功后所指定的接收消息的玩家将收到 onRecvFromClient 广播。
         * @description 当 recvType 值为 1 （即 ROOM_ALL ） 时，房间内全部玩家将收到消息；
         * @description 当 recvType 值为 2 （即 ROOM_OTHERS ） 时，房间内除消息发送者外的其他玩家将收到消息；
         * @description 当 recvType 值为 3 （即 ROOM_SOME ） 时，接收消息玩家才由 recvPlayerList 决定。
         * @param {MGOBE.types.SendToClientPara} sendToClientPara  发送消息参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.SendToClientRsp>} callback  响应回调函数
         * @returns {void}
         */
        sendToClient(sendToClientPara: MGOBE.types.SendToClientPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.SendToClientRsp>): void;
        /**
         * @name 发送消息给实时服务器
         * @description 该接口只能在玩家进入房间后调用，调用结果将在 callback 中异步返回。
         * @param {MGOBE.types.SendToGameSvrPara} sendToGameSvrPara  发送消息参数
         * @param {MGOBE.types.ReqCallback<MGOBE.types.SendToGameSvrRsp>} callback  响应回调函数
         * @returns {void}
         */
        sendToGameSvr(sendToGameSvrPara: MGOBE.types.SendToGameSvrPara, callback?: MGOBE.types.ReqCallback<MGOBE.types.SendToGameSvrRsp>): void;
    }
    /********************************* SDK Listener对象 *********************************/
    export class Listener {

        /**
         * @name 初始化监听器
         * @description 该方法为静态方法。初始化 Listener 时需要传入 gameInfo 和 config 两个参数。
         * @description 初始化结果在 callback 中异步返回，错误码为 0 表示初始化成功。
         * @param {MGOBE.types.GameInfoPara} gameInfo  游戏信息
         * @param {MGOBE.types.ConfigPara} config  游戏配置
         * @param {MGOBE.types.ReqCallback<null>} callback  初始化回调函数
         * @returns {void}
         */
        static init(gameInfo: MGOBE.types.GameInfoPara, config: MGOBE.types.ConfigPara, callback: MGOBE.types.ReqCallback<MGOBE.types.InitRsp>): void;
        /**
         * @name 为Room/Group实例添加广播监听
         * @description 该方法为静态方法。实例化 Room/Group 对象之后，需要通过该方法给 Room/Group 注册广播事件监听。
         * @description Listener 完成初始化之后才能添加监听。
         * @param {Room 或 Group} entity  需要监听的房间/队组对象
         * @returns {void}
         */
        static add(entity: Room | Group): void;
        /**
         * @name 为Room/Group实例移除广播监听
         * @description 该方法为静态方法。如果不再需要监听某个 Room/Group 对象的广播事件，可以通过该方法进行移除。
         * @param {Room 或 Group} entity  需要移除监听的房间/队组对象
         * @returns {void}
         */
        static remove(entity: Room | Group): void;
        /**
         * @name 移除全部Room/Group对象的广播监听
         * @description 该方法为静态方法。
         * @returns {void}
         */
        static clear(): void;
    }

    /********************************* SDK 错误码 *********************************/
    export enum ErrCode {
        EC_OK = 0,
        EC_REQ_BAD_PKG = 1,
        EC_CMD_INVALID = 2,
        EC_PARAMS_INVALID = 3,
        EC_INNER_ERROR = 4,
        EC_TIME_OUT = 5,
        EC_SERVER_BUSY = 6,
        EC_NO_RIGHT = 7,
        EC_ACCESS_CMD_INVALID_ERR = 200,
        EC_ACCESS_CMD_GET_TOKEN_ERR = 201,
        EC_ACCESS_CMD_TOKEN_PRE_EXPIRE = 202,
        EC_ACCESS_CMD_INVALID_TOKEN = 203,
        EC_ACCESS_PUSH_SERIALIZE_ERR = 204,
        EC_ACCESS_LOGIN_BODY_PARSE_ERR = 205,
        EC_ACCESS_CONN_ERR = 206,
        EC_ACCESS_GET_RS_IP_ERR = 207,
        EC_ACCESS_ADD_COMM_CONN_ERR = 208,
        EC_ACCESS_ADD_HEART_CONN_ERR = 209,
        EC_ACCESS_ADD_RELAY_CONN_ERR = 210,
        EC_ACCESS_HEART_BODY_PARSE_ERR = 211,
        EC_ACCESS_GET_COMM_CONNECT_ERR = 212,
        EC_ACCESS_GET_RELAY_CONNECT_ERR = 213,
        EC_ACCESS_ACCESS_INFO_EMPTY = 214,
        EC_ACCESS_PLAYER_DUPLICATE_LOGIN = 215,
        EC_ACCESS_NOE_RELAY_OR_STATE_SVR = 216,
        EC_PLAYER_GAME_NOT_EXIST = 10000,
        EC_PLAYER_SECRET_KEY_FAIL = 10001,
        EC_PLAYER_SIGN_ERR = 10002,
        EC_PLAYER_DUPLICATE_REQ = 10003,
        EC_PLAYER_TIMESTAMP_INVALID = 10004,
        EC_PLAYER_QUERY_PLAYER_FAIL = 10005,
        EC_PLAYER_ADD_PLAYER_FAIL = 10006,
        EC_PLAYER_QUERY_GAME_FAIL = 10007,
        EC_PLAYER_RECORD_NUM_ERR = 10008,
        EC_PLAYER_GET_TOKEN_FAIL = 10009,
        EC_PLAYER_TOKEN_NOT_EXIST = 10010,
        EC_PLAYER_TOKEN_INVALID = 10011,
        EC_PLAYER_CLEAR_TOKEN_FAIL = 10012,
        EC_PLAYER_LOCK_FAIL = 10013,
        EC_PLAYER_UNLOCK_FAIL = 10014,
        EC_PLAYER_SAVE_TOKEN_FAIL = 10015,
        EC_PLAYER_GAME_OUT_OF_SERVICE = 10016,
        EC_ROOM_CREATE_NO_PERMISSION = 20000,
        EC_ROOM_DESTORY_NO_PERMISSION = 20001,
        EC_ROOM_JOIN_NO_PERMISSION = 20002,
        EC_ROOM_REMOVE_PLAYER_NO_PERMISSION = 20003,
        EC_ROOM_MODIFY_PROPERTIES_NO_PEMISSION = 20004,
        EC_ROOM_DISSMISS_NO_PERMISSION = 20005,
        EC_ROOM_REMOVE_SELF_NO_PERMISSION = 20006,
        EC_ROOM_CHECK_LOGIN_SESSION_ERR = 20007,
        EC_ROOM_REMOVE_PLAYER_NOT_IN_ROOM = 20008,
        EC_ROOM_PLAYER_ALREADY_IN_ROOM = 20010,
        EC_ROOM_PLAYER_NOT_IN_ROOM = 20011,
        EC_ROOM_PLAYERS_EXCEED_LIMIT = 20012,
        EC_ROOM_JOIN_NOT_ALLOW = 20013,
        EC_ROOM_MAX_PLAYERS_INVALID = 20014,
        EC_ROOM_CREATE_FAIL = 20015,
        EC_ROOM_PLAYER_OFFLINE = 20016,
        EC_ROOM_PARAM_PAGE_INVALID = 20017,
        EC_ROOM_GET_PLAYER_INFO_ERR = 20050,
        EC_ROOM_GET_ROOM_INFO_ERR = 20051,
        EC_ROOM_MODIFY_OWNER_ERR = 20052,
        EC_ROOM_MAX_ROOM_NUMBER_EXCEED_LIMIT = 20053,
        EC_ROOM_REMOVE_REDIS_PLAYER_ROOM_MATCH_ERR = -20052,
        EC_ROOM_REMOVE_REDIS_ROOM_INFO_ERR = -20053,
        EC_ROOM_REDIS_UPDATE_ERR = -20054,
        EC_ROOM_REDIS_GET_LOCK_ERR = -20055,
        EC_ROOM_REDIS_CHECK_LOCK_ERR = -20056,
        EC_ROOM_REDIS_DEL_LOCK_ERR = -20057,
        EC_ROOM_QUERY_PLAYER_ERR = 20060,
        EC_ROOM_QUERY_GAME_ERR = 20061,
        EC_ROOM_PLAYER_INFO_NOT_EXIST = 20062,
        EC_ROOM_GAME_INFO_NOT_EXIST = 20063,
        EC_ROOM_HISTORY_INFO_INSERT_ERR = -20064,
        EC_ROOM_REGION_INFO_NOT_EXIST = 20065,
        EC_ROOM_QUERY_REGION_ERR = 20066,
        EC_ROOM_MODIFY_PLAYER_BUSY = 20070,
        EC_ROOM_INFO_UNEXIST = 20080,
        EC_ROOM_ALLOCATE_RELAYSVR_IP_PORT_ERR = 20090,
        EC_ROOM_INVALID_PARAMS_TEAM_ID = 20100,
        EC_ROOM_TEAM_MEMBER_LIMIT_EXCEED = 20101,
        EC_ROOM_ALLOCATE_SERVICE_FAIL = -20200,
        EC_MATCH_NO_ROOM = 30000,
        EC_MATCH_TIMEOUT = 30001,
        EC_MATCH_LOGIC_ERR = 30002,
        EC_MATCH_ERR = 30010,
        EC_MATCH_PLAYER_IS_IN_MATCH = 30011,
        EC_MATCH_PLAYER_NOT_IN_MATCH = 30012,
        EC_MATCH_GET_MATCH_INFO_ERR = 30013,
        EC_MATCH_UPDATE_MATCH_INFO_ERR = 30014,
        EC_MATCH_CANCEL_FAILED = 30015,
        EC_MATCH_GET_PLAYER_LIST_INFO_ERR = 30016,
        EC_MATCH_CREATE_ROOM_ERR = 30041,
        EC_MATCH_JOIN_ROOM_ERR = 30042,
        EC_MATCH_INVALID_PARAMS = 30043,
        EC_MATCH_GROUP_NUM_EXCEED_LIMIT = 30044,
        EC_MATCH_PLAYER_ID_IS_REPEATED = 30045,
        EC_MATCH_CREATE_ROOM_PLAYER_ALREADY_IN_ROOM = 30050,
        EC_MATCH_QUERY_PLAYER_ERR = 30100,
        EC_MATCH_PLAYER_INFO_NOT_EXIST = 30101,
        EC_MATCH_QUERY_GAME_ERR = 30102,
        EC_MATCH_GAME_INFO_NOT_EXIST = 30103,
        EC_MATCH_QUERY_REGION_ERR = 30104,
        EC_MATCH_REGION_INFO_NOT_EXIST = 30105,
        EC_MATCH_TEAM_FAIL = 30106,
        EC_MATCH_PLAY_RULE_NOT_RUNNING = 30107,
        EC_MATCH_PLAY_ATTR_NOT_FOUND = 30108,
        EC_MATCH_PLAY_RULE_NOT_FOUND = 30109,
        EC_MATCH_PLAY_RULE_ATTR_SEGMENT_NOT_FOUND = 30110,
        EC_MATCH_PLAY_RULE_FUNC_ERR = 30111,
        EC_MATCH_GET_PLAYER_ATTR_FAIL = 30112,
        EC_MATCH_GET_TEAM_ATTR_FAIL = 30113,
        EC_MATCH_NONE_TEAM_TYPE_FIT = 30114,
        EC_MATCH_TEAM_TYPE_INVALID = 30115,
        EC_MATCH_PLAYER_ATTR_NOT_FOUND = 30116,
        EC_MATCH_REQUEST_ID_NOT_EXIST = 30117,
        EC_MATCH_REQUEST_ID_IS_EXIST = 30118,
        EC_MATCH_TEAM_MATCH_FAIL = 30119,
        EC_MATCH_ROBOT_GROUP_NOT_RIGHT = 30120,
        EC_MATCH_ROBOT_TEAM_NOT_RIGHT = 30121,
        EC_MATCH_INNER_LOGIC_ERR = -30150,
        EC_MATCH_INNER_PARAMS_ERR = -30160,
        EC_MATCH_ROOM_INNER_ADD_NODE_ERR = -30170,
        EC_MATCH_ROOM_INNER_DEL_NODE_ERR = -30171,
        EC_MATCH_RESULT_TYPE_NOT_GSE = -30172,
        EC_MATCH_REQUEST_CANCELED = 30173,
        EC_RELAY_ALREADY_EXISTS = 40000,
        EC_RELAY_NOT_EXISTS = 40001,
        EC_RELAY_DATA_EXCEED_LIMITED = 40002,
        EC_RELAY_MEMBER_ALREADY_EXISTS = 40003,
        EC_RELAY_MEMBER_NOT_EXISTS = 40004,
        EC_RELAY_STATE_INVALID = 40005,
        EC_RELAY_INVALID_FRAME_RATE = 40006,
        EC_RELAY_SET_FRAME_RATE_FORBIDDEN = 40007,
        EC_RELAY_NO_MEMBERS = 40008,
        EC_RELAY_GAMESVR_SERVICE_NOT_OPEN = 40009,
        EC_RELAY_REQ_POD_FAIL = 40010,
        EC_RELAY_NO_AVAILABLE_POD = 40011,
        EC_RELAY_GET_FRAME_CACHE_FAIL = 40012,
        EC_RELAY_HKV_CACHE_ERROR = 40015,
        EC_RELAY_REDIS_CACHE_ERROR = 40016,
        EC_RELAY_NOTIFY_RELAYWORKER_FAIL = 40018,
        EC_RELAY_RESET_RELAY_ROOM_FAIL = 40019,
        EC_RELAY_CLEAN_RELAY_ROOM_FAIL = 40020,
        EC_RELAY_REQ_FRAME_GAME_NOT_STARTED = 40021,
        EC_RELAY_NO_PERMISSION = 40100,
        EC_RELAY_NOTIFY_GAMESVR_FAIL = 40200,
        EC_RELAY_FORWARD_TO_GAMESVR_FAIL = 40201,
        EC_RELAY_FORWARD_TO_CLIENT_FAIL = 40202,
        EC_RELAY_GAMESVR_NOT_FOUND_ROOM_FAIL = 40203,
        EC_GROUP_OPERATION_FAILED = 70000,
        EC_INVALID_PARAMS_GROUP_NAME = 70001,
        EC_INVALID_PARAMS_GROUP_TYPE = 70002,
        EC_INVALID_PARAMS_GROUP_CUSTOM_PROPERTIES = 70003,
        EC_INVALID_PARAMS_GROUP_PLAYER_NAME = 70004,
        EC_INVALID_PARAMS_GROUP_PLAYER_CUSTOM_STATUS = 70005,
        EC_INVALID_PARAMS_GROUP_PLAYER_CUSTOM_PROPERTIES = 70006,
        EC_GROUP_MODIFY_OWNER_NO_PERMISSION = 70007,
        EC_INVALID_PARAMS_GROUP_ID = 70008,
        EC_INVALID_CHANGE_OPTION = 70009,
        EC_INVALID_PARAMS_GROUP_OWNER = 70010,
        EC_PLAYER_IS_EXIST_GROUP = 70011,
        EC_PLAYER_IS_NOT_EXIST_GROUP = 70012,
        EC_REMOVE_PLAYER_ID_IS_EMPTY = 70013,
        EC_GROUP_REMOVE_PLAYER_NO_PERMISSION = 70014,
        EC_INVALID_PARAMS_GROUP_RECV_TYPE = 70015,
        EC_INVALID_PARAMS_RECV_PLAYER_ID = 70016,
        EC_INVALID_PARAMS_MESSAGE_LENGTH = 70017,
        EC_INVALID_PARAMS_MAX_PLAYER = 70018,
        PERSISTENCE_GROUP_NUM_EXCEED_THE_LIMIT = 70019,
        EC_INVALID_PARAMS_PLAYER_NOT_IN_GROUP = 70020,
        NO_GROUP_OPERATION_PERMISSION = 70021,
        EC_OPERATION_FAILED_GROUP_FORBID_JOIN = 70022,
        EC_GROUP_CHAT_FREQUENCY_LIMIT = 70023,
        EC_GROUP_PLAYER_NUM_LIMIT_EXCEED = 70024,
        EC_PLAYER_GROUP_NUM_LIMIT_EXCEED = 70025,
        EC_GROUP_NOT_EXIST = 70026,
        EC_INVALID_PARAMS = 60000,
        EC_INVALID_PARAMS_PLAY_MODE_VERSION = 60001,
        EC_INVALID_PARAMS_PLAY_MODE_RULETYPE = 60002,
        EC_INVALID_PARAMS_PLAY_MODE_EXPRESSION = 60003,
        EC_INVALID_PARAMS_PLAY_MODE_TEAM = 60004,
        EC_INVALID_PARAMS_MSGQ_ENCODE = 60020,
        EC_INVALID_PARAMS_MSGQ_DECODE = 60021,
        EC_INVALID_PARAMS_GAME_ID = 61000,
        EC_INVALID_PARAMS_PLAYER_INFO = 61001,
        EC_INVALID_PARAMS_MAX_PLAYERS = 61002,
        EC_INVALID_PARAMS_ROOM_TYPE = 61003,
        EC_INVALID_PARAMS_PLAYER_ID = 61004,
        EC_INVALID_PARAMS_MATCH_TYPE = 61005,
        EC_INVALID_PARAMS_MATCH_CODE = 61006,
        EC_INVALID_PARAMS_OPEN_ID = 61007,
        EC_INVALID_PARAMS_PLATFORM = 61008,
        EC_INVALID_PARAMS_TIMESTAMP = 61009,
        EC_INVALID_PARAMS_SIGN = 61010,
        EC_INVALID_PARAMS_NONCE = 61011,
        EC_INVALID_PARAMS_TOKEN = 61012,
        EC_INVALID_PARAMS_NETWORK_STATE = 61013,
        EC_INVALID_PARAMS_ROOM_NAME = 61014,
        EC_INVALID_PARAMS_CREATE_ROOM_TYPE = 61015,
        EC_INVALID_PARAMS_DEVICE_ID = 61016,
        EC_INVALID_PARAMS_PAGE_NO = 61017,
        EC_INVALID_PARAMS_PAGE_SIZE = 61018,
        EC_INVALID_PARAMS_PLAYER_LIST = 61019,
        EC_INVALID_PARAMS_MESSAGE = 61020,
        EC_INVALID_CHANGE_ROOM_OPTION = 61021,
        EC_INVALID_PARAMS_REGION = 61022,
        EC_INVALID_PARAMS_OWNER = 61023,
        EC_INVALID_PARAMS_OWNER_OPEN_ID = 61024,
        EC_INVALID_PARAMS_OPEN_ID_DUPLICATE = 61026,
        EC_INVALID_PARAMS_ROOM_CREATE_TYPE = 61027,
        EC_MYSPP_SYSTEM_ERR = -1000,
        EC_REDIS_KEY_NOT_EXIST = -66000,
        EC_REDIS_SET_OP_ERR = -66001,
        EC_REDIS_GET_OP_ERR = -66002,
        EC_REDIS_DEL_OP_ERR = -66003,
        EC_REDIS_EXPIRE_OP_ERR = -66004,
        EC_REDIS_LOCK_OP_ERR = -66005,
        EC_REDIS_LOCK_ALREADY_EXIST = -66006,
        EC_REDIS_LIST_OP_ERR = -66020,
        EC_REDIS_LIST_POP_EMPTY = -66021,
        EC_REDIS_POOL_GET_INSTANCE_FAIL = -66022,
        EC_REDIS_SET_IS_EMPTY = -66023,
        EC_REDIS_OP_INVALID_PARAMS = -66024,
        EC_MYSQL_NO_ROW_FOUND = -66100,
        EC_MYSQL_MULTI_ROW_FOUND = -66101,
        EC_MYSQL_INSERT_FAIL = -66102,
        EC_MYSQL_DELETE_FAIL = -66103,
        EC_MYSQL_UPDATE_FAIL = -66104,
        EC_MYSQL_QUERYS_FAIL = -66105,
        EC_PB_SERIALIZE_TO_STR_ERR = -66200,
        EC_PB_PARSE_FROM_STR_ERR = -66201,
        EC_DATA_FORMAT_ERR = -66210,
        EC_JSON_FORMAT_ERR = -66211,
        EC_JSON_PLAY_MODE_FORMAT_ERR = -66212,
        EC_JSON_PLAY_MODE_PARISE_ERR = -66213,
        EC_INVALID_PARAMS_RECORE_ID = -66601,
        EC_HASHID_ERR = -66700,
        EC_HASHID_ENCODE_ERR = -66701,
        EC_HASHID_DECODE_ERR = -66702,
        EC_CONF_ROOM_ID_BUCKET_ERR = -66801,
        EC_SDK_SEND_FAIL = 90001,
        EC_SDK_UNINIT = 90002,
        EC_SDK_RES_TIMEOUT = 90003,
        EC_SDK_NO_LOGIN = 90004,
        EC_SDK_NO_CHECK_LOGIN = 90005,
        EC_SDK_SOCKET_ERROR = 90006,
        EC_SDK_SOCKET_CLOSE = 90007,
        EC_SDK_NO_ROOM = 90008,
        EC_SDK_ENCODE_PARAM_FAIL = 90009,
        EC_SDK_INVALID_PARAMS = 90010
    }
    namespace types {
        /**
            * @name 初始化回调参数
            * @field {number} serverTime 服务器时间戳（单位：毫秒）
            */
        interface InitRsp {
            serverTime: number;
        }
        /**
         * @name 玩家信息参数
         * @field {string} name  玩家昵称
         * @field {number} customPlayerStatus  自定义玩家状态
         * @field {string} customProfile  自定义玩家信息
         */
        interface PlayerInfoPara {
            name: string;
            customPlayerStatus: number;
            customProfile: string;
        }
        /**
         * @name 玩家信息参数
         * @field {string} name  玩家昵称
         * @field {number} customPlayerStatus  自定义玩家状态
         * @field {string} customProfile  自定义玩家信息
         * @field {MGOBE.types.MatchAttribute[]} matchAttributes  匹配属性
         */
        interface MatchPlayerInfoPara {
            name: string;
            customPlayerStatus: number;
            customProfile: string;
            matchAttributes: MGOBE.types.MatchAttribute[];
        }
        /**
         * @name  初始化参数：游戏信息
         * @description 游戏秘钥指控制台上的“游戏key”。在初始化SDK时，secretKey、CreateSignature两个参数传其中一个即可。如果实现了CreateSignature方法，则忽略secretKey参数。
         * @description CreateSignature用于计算签名signature，优点在于避免客户端泄露游戏密钥。
         * @field {string} gameId  游戏ID
         * @field {string} openId  玩家openId
         * @field {string} secretKey  游戏秘钥
         * @field {MGOBE.types.CreateSignature} createSignature  签名函数
         */
        interface GameInfoPara {
            gameId: string;
            openId: string;
            secretKey?: string;
            createSignature?: MGOBE.types.CreateSignature;
        }
        /**
         * @name  初始化参数：配置参数
         * @description 服务地址指控制台上的“域名”
         * @field {number} reconnectMaxTimes  重连接次数（默认15）（可选）
         * @field {number} reconnectInterval  重连接时间间隔（毫秒，默认500）（可选）
         * @field {number} resendInterval  消息重发时间间隔（毫秒，默认1000）（可选）
         * @field {number} resendTimeout  消息重发超时时间（毫秒，默认20000）（可选）
         * @field {string} url  服务地址
         * @field {boolean} isAutoRequestFrame  是否自动补帧（默认false）（可选）
         * @field {string} cacertNativeUrl  本地CA根证书路径（CocosNative环境需要该参数）（可选）
         */
        interface ConfigPara {
            reconnectMaxTimes?: number;
            reconnectInterval?: number;
            resendInterval?: number;
            resendTimeout?: number;
            url?: string;
            isAutoRequestFrame?: boolean;
            cacertNativeUrl?: string;
        }
        /**
         * @name  初始化签名
         * @description 可以使用签名的方式初始化SDK，避免客户端泄露游戏密钥。
         * @field {string} sign  签名
         * @field {number} nonce  随机正整数（uint64类型）
         * @field {number} timestamp  时间戳，秒（uint64类型）
         */
        interface Signature {
            sign: string;
            nonce: number;
            timestamp: number;
        }
        /**
         * @name 签名函数
         * @description 开发者如果使用签名方式初始化SDK，需要实现该方法，并在callback中回调Signature对象。
         * @field {(signature: MGOBE.types.Signature) => any} callback  回调函数，在该函数返回Signature对象
         */
        type CreateSignature = (callback: (signature: MGOBE.types.Signature) => any) => any;
        /**
         * @name 修改玩家状态参数
         * @field {number} customPlayerStatus  自定义玩家状态
         */
        interface ChangeCustomPlayerStatusPara {
            customPlayerStatus: number;
        }
        /**
         * @name 修改玩家属性参数
         * @field {number} customProfile  玩家自定义属性
         */
        interface ChangeRoomPlayerProfilePara {
            customProfile: string;
        }
        /**
         * @name  创建房间参数
         * @field {string} roomName  房间名称
         * @field {string} roomType  房间类型
         * @field {number} maxPlayers  房间最大玩家数量
         * @field {boolean} isPrivate  是否私有
         * @field {string} customProperties  自定义房间属性
         * @field {MGOBE.types.PlayerInfoPara} playerInfo  玩家信息
         */
        interface CreateRoomPara {
            roomName: string;
            roomType: string;
            maxPlayers: number;
            isPrivate: boolean;
            customProperties: string;
            playerInfo: MGOBE.types.PlayerInfoPara;
        }
        /**
         * @name 创建团队房间参数
         * @field {string} roomName  房间名称
         * @field {string} roomType  房间类型
         * @field {number} maxPlayers  房间最大玩家数量
         * @field {boolean} isPrivate  是否私有
         * @field {string} customProperties  自定义房间属性
         * @field {MGOBE.types.PlayerInfoPara} playerInfo  玩家信息
         * @field {number} teamNumber  队伍数量
         */
        interface CreateTeamRoomPara {
            roomName: string;
            roomType: string;
            maxPlayers: number;
            isPrivate: boolean;
            customProperties: string;
            playerInfo: MGOBE.types.PlayerInfoPara;
            teamNumber: number;
        }
        /**
         * @name 加入房间参数
         * @field {MGOBE.types.PlayerInfoPara} playerInfo  玩家信息
         */
        interface JoinRoomPara {
            playerInfo: MGOBE.types.PlayerInfoPara;
        }
        /**
         * @name 加入团队房间参数
         * @field {MGOBE.types.PlayerInfoPara} playerInfo  玩家信息
         * @field {string} teamId  队伍ID
         */
        interface JoinTeamRoomPara {
            playerInfo: MGOBE.types.PlayerInfoPara;
            teamId: string;
        }
        /**
         * @name 房间变更参数
         * @field {string} roomName  房间名称（可选）
         * @field {string} owner  房主ID（可选）
         * @field {boolean} isPrivate  是否私有（可选）
         * @field {string} customProperties  自定义房间属性（可选）
         * @field {boolean} isForbidJoin  是否禁止加入房间（可选）
         */
        interface ChangeRoomPara {
            roomName?: string;
            owner?: string;
            isPrivate?: boolean;
            customProperties?: string;
            isForbidJoin?: boolean;
        }
        /**
         * @name 移除房间内玩家参数
         * @field {string} removePlayerId  被移除玩家ID
         */
        interface RemovePlayerPara {
            removePlayerId: string;
        }
        /**
         * @name 获取房间列表参数
         * @field {number} pageNo  页号，从1开始
         * @field {number} pageSize  每页数量，最大为10
         * @field {string} roomType  房间类型（可选）
         * @field {boolean} isDesc  是否按照房间创建时间倒序
         */
        interface GetRoomListPara {
            pageNo: number;
            pageSize: number;
            roomType?: string;
            isDesc?: boolean;
        }
        /**
         * @name 获取房间参数
         * @field {string} roomId  房间ID
         */
        interface GetRoomByRoomIdPara {
            roomId: string;
        }
        /**
         * @name 多人匹配参数
         * @description 匹配 code 需要在控制台创建匹配获得。
         * @field {string} matchCode  匹配Code
         * @field {MGOBE.types.MatchPlayerInfoPara} playerInfo  玩家信息
         */
        interface MatchPlayersPara {
            matchCode: string;
            playerInfo: MGOBE.types.MatchPlayerInfoPara;
        }
        /**
         * @name 房间匹配参数
         * @field {MGOBE.types.PlayerInfoPara} playerInfo  玩家信息
         * @field {number} maxPlayers  房间最大玩家数量
         * @field {string} roomType  房间的类型
         */
        interface MatchRoomPara {
            playerInfo: MGOBE.types.PlayerInfoPara;
            maxPlayers: number;
            roomType: string;
        }
        /**
         * @name 组队匹配玩家信息参数
         * @field {string} id  玩家ID
         * @field {string} name  玩家昵称
         * @field {number} customPlayerStatus  自定义玩家状态
         * @field {string} customProfile  自定义玩家信息
         * @field {MGOBE.types.MatchAttribute[]} matchAttributes  匹配属性
         */
        interface MatchGroupPlayerInfoPara {
            id: string;
            name: string;
            customPlayerStatus: number;
            customProfile: string;
            matchAttributes: MGOBE.types.MatchAttribute[];
        }
        /**
         * @name 组队匹配参数
         * @description 匹配 code 需要在控制台创建匹配获得。
         * @field {string} matchCode  匹配Code
         * @field {MGOBE.types.MatchGroupPlayerInfoPara[]} playerInfoList[]  队员信息
         */
        interface MatchGroupPara {
            matchCode: string;
            playerInfoList: MGOBE.types.MatchGroupPlayerInfoPara[];
        }
        /**
         * @name 组队匹配结束广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         * @field {number} errCode  错误码
         */
        interface MatchBst {
            roomInfo: MGOBE.types.RoomInfo;
            errCode: number;
        }
        /**
         * @name 组队匹配取消广播回调参数
         * @field {string} matchCode  匹配Code
         * @field {string} playerId  发起取消匹配的玩家ID
         */
        interface CancelMatchBst {
            matchCode: string;
            playerId: string;
        }
        /**
         * @name 取消匹配参数
         * @field {MGOBE.types.MatchType}  matchType 匹配类型
         */
        interface CancelPlayerMatchPara {
            matchType: MGOBE.types.MatchType;
        }
        /**
         * @name 发送帧数据参数
         * @field {object} data  帧数据
         */
        interface SendFramePara {
            data: object;
        }
        /**
         * @name 请求补帧参数
         * @description 补帧范围大于等于beginFrameId，小于等于endFrameId
         * @field {number} beginFrameId  起始帧号
         * @field {number} endFrameId  结束帧号
         */
        interface RequestFramePara {
            beginFrameId: number;
            endFrameId: number;
        }
        /**
         * @name 消息接收者类型
         * @field {1} ROOM_ALL 全部玩家
         * @field {2} ROOM_OTHERS 除自己外的其他玩家
         * @field {3} ROOM_SOME 房间中部分玩家
         */
        enum RecvType {
            ROOM_ALL = 1,
            ROOM_OTHERS = 2,
            ROOM_SOME = 3
        }
        /**
         * @name 发送房间内消息参数
         * @field {string[]} recvPlayerList  接收消息玩家ID列表
         * @field {string} msg  消息内容
         * @field {MGOBE.types.RecvType} recvType  消息接收者类型
         */
        interface SendToClientPara {
            recvPlayerList: string[];
            msg: string;
            recvType: MGOBE.types.RecvType;
        }
        /**
         * @name 发自定义服务消息参数
         * @field {object} data  消息内容
         */
        interface SendToGameSvrPara {
            data: object;
        }
        /**
         * @name 自定义服务消息广播回调参数
         * @field {number} roomId  房间ID
         * @field {string[]} playerIdList  接收消息玩家ID列表
         * @field {object} data  消息内容
         */
        interface RecvFromGameSvrBst {
            roomId: string;
            recvPlayerIdList: string[];
            data: object;
        }
        /**
         * @name 帧内容
         * @field {string} playerId  玩家ID
         * @field {object} data  玩家帧内容
         * @field {number} timestamp  时间戳，各玩家本地发送帧的时间
         */
        interface FrameItem {
            playerId: string;
            data: object;
            timestamp: number;
        }
        /**
         * @name 帧数据
         * @description 附加信息包含一个 number 类型随机种子，开发者可以使用帧 ID 与随机种子组合成一个值来初始化 RandomUtil 工具。
         * @description time 为 SDK 拟合出来的时间，目的是使每一帧到达客户端的时间尽量均匀分布，并且时间间隔尽量接近帧率的倒数。
         * @description isReplay 表示该帧是否为自动补帧产生的帧，自动补帧需要在初始化 Listener 时设置。
         * @description items 数组表示各个客户端发送的帧消息，按照到达服务器时间先后进行排序（数组中第0个为最先到服务器）。
         * @field {number} frameId  帧ID
         * @field {MGOBE.types.FrameItem[]} items  帧内容
         * @field {MGOBE.types.FrameExtInfo} ext  附加信息
         * @field {number} roomId  房间ID
         * @field {number} time  该帧到达客户端时间
         * @field {boolean} isReplay  是否为补帧
         */
        interface Frame {
            id: number;
            items: MGOBE.types.FrameItem[];
            ext: MGOBE.types.FrameExtInfo;
            roomId: string;
            time?: number;
            isReplay?: boolean;
        }
        /**
         * @name 帧广播回调参数
         * @field {MGOBE.types.Frame} frame  帧数据
         */
        interface RecvFrameBst {
            frame: MGOBE.types.Frame;
        }
        /**
         * @name 请求补帧回调参数
         * @field {MGOBE.types.Frame[]} frames  帧数据数组
         */
        interface RequestFrameRsp {
            frames: MGOBE.types.Frame[];
            isPartial: boolean;
        }
        /**
         * @name 玩家加入房间广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         * @field {string} joinPlayerId  加房玩家ID
         */
        interface JoinRoomBst {
            roomInfo: MGOBE.types.RoomInfo;
            joinPlayerId: string;
        }
        /**
         * @name 玩家退出房间广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         * @field {string} leavePlayerId  退房玩家ID
         */
        interface LeaveRoomBst {
            roomInfo: MGOBE.types.RoomInfo;
            leavePlayerId: string;
        }
        /**
         * @name 房间被解散广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间解散前的信息
         */
        interface DismissRoomBst {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 房间属性变更广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface ChangeRoomBst {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 房间内玩家被移除广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         * @field {string} removePlayerId  被移除玩家ID
         */
        interface RemovePlayerBst {
            roomInfo: MGOBE.types.RoomInfo;
            removePlayerId: string;
        }
        /**
         * @name 房间消息广播回调参数
         * @field {number} roomId  房间ID
         * @field {string} sendPlayerId  发送者ID
         * @field {string} msg  消息内容
         */
        interface RecvFromClientBst {
            roomId: string;
            sendPlayerId: string;
            msg: string;
        }
        /**
         * @name 房间内玩家网络状态变化广播回调参数
         * @field {string} changePlayerId  玩家ID
         * @field {MGOBE.types.NetworkState} networkState  网络状态
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface ChangePlayerNetworkStateBst {
            changePlayerId: string;
            networkState: MGOBE.types.NetworkState;
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 玩家自定义状态变化广播回调参数
         * @field {string} changePlayerId  玩家ID
         * @field {number} customPlayerStatus  自定义玩家信息
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface ChangeCustomPlayerStatusBst {
            changePlayerId: string;
            customPlayerStatus: number;
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 房间内玩家自定义属性变化广播回调参数
         * @field {string} changePlayerId  玩家ID
         * @field {string} customProfile  玩家自定义属性
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface ChangeRoomPlayerProfileBst {
            changePlayerId: string;
            customProfile: string;
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 开始帧同步广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface StartFrameSyncBst {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 停止帧同步广播回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface StopFrameSyncBst {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 房间属性
         * @description isPrivate 属性为 true 表示该房间为私有房间，不能被 matchRoom 接口匹配到。
         * @field {string} id  房间ID
         * @field {string} name  房间名称
         * @field {string} type  房间类型
         * @field {MGOBE.types.CreateRoomType} createType  创建房间方式
         * @field {number} maxPlayers  房间最大玩家数量
         * @field {string} owner  房主ID
         * @field {boolean} isPrivate  是否私有
         * @field {string} customProperties  房间自定义属性
         * @field {MGOBE.types.PlayerInfo[]} playerList  玩家列表
         * @field {MGOBE.types.TeamInfo[]} teamList  团队属性
         * @field {MGOBE.types.FrameSyncState} frameSyncState  房间帧同步状态
         * @field {number} frameRate  帧率
         * @field {string} routeId  路由ID
         * @field {number} createTime  房间创建时的时间戳（单位：秒）
         * @field {number} startGameTime  开始帧同步时的时间戳（单位：秒）
         * @field {boolean} isForbidJoin  是否禁止加入房间
         */
        interface RoomInfo {
            id: string;
            name: string;
            type: string;
            createType: MGOBE.types.CreateRoomType;
            maxPlayers: number;
            owner: string;
            isPrivate: boolean;
            customProperties: string;
            playerList: MGOBE.types.PlayerInfo[];
            teamList: MGOBE.types.TeamInfo[];
            frameSyncState: MGOBE.types.FrameSyncState;
            frameRate: number;
            routeId: string;
            createTime: number;
            startGameTime: number;
            isForbidJoin: boolean;
        }
        /**
         * @name 修改玩家状态回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface ChangeCustomPlayerStatusRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 修改玩家属性回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface ChangeRoomPlayerProfileRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 创建房间回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface CreateRoomRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 加入房间回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface JoinRoomRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 退出房间回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface LeaveRoomRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 解散房间回调参数
         */
        interface DismissRoomRsp {
        }
        /**
         * @name 修改房间回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface ChangeRoomRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 移除房间内玩家回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface RemovePlayerRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 获取房间信息回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface GetRoomByRoomIdRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 获取房间列表回调参数
         * @field {MGOBE.types.RoomInfo[]} roomList  房间列表
         * @field {number} total  房间总数
         */
        interface GetRoomListRsp {
            gameId: string;
            roomList: MGOBE.types.RoomInfo[];
            total: number;
        }
        /**
         * @name 多人匹配回调参数
         * @field {MGOBE.types.MatchType} matchType  匹配类型
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface MatchPlayersRsp {
            matchType?: MGOBE.types.MatchType;
            roomInfo?: MGOBE.types.RoomInfo;
        }
        /**
         * @name 房间匹配回调参数
         * @field {MGOBE.types.RoomInfo} roomInfo  房间信息
         */
        interface MatchRoomSimpleRsp {
            roomInfo: MGOBE.types.RoomInfo;
        }
        /**
         * @name 组队匹配回调参数
         * @field {string} matchCode  匹配Code
         */
        interface MatchGroupRsp {
            matchCode: string;
        }
        /**
         * @name 取消匹配回调参数
         */
        interface CancelPlayerMatchRsp {
        }
        /**
         * @name  开始帧同步回调参数
         */
        interface StartFrameSyncRsp {
        }
        /**
         * @name 停止帧同步回调参数
         */
        interface StopFrameSyncRsp {
        }
        /**
         * @name 发送帧同步数据回调参数
         */
        interface SendFrameRsp {
        }
        /**
         * @name 房间内发送消息回调参数
         */
        interface SendToClientRsp {
        }
        /**
         * @name 发送自定义服务消息回调参数
         */
        interface SendToGameSvrRsp {
        }
        /**
         * @name 匹配属性
         * @field {string} name  属性名称
         * @field {number} value  属性值
         */
        interface MatchAttribute {
            name: string;
            value: number;
        }
        /**
         * @name 匹配类型
         * @field {1} ROOM_SIMPLE 房间匹配
         * @field {2} PLAYER_COMPLEX 玩家匹配
         */
        enum MatchType {
            ROOM_SIMPLE = 1,
            PLAYER_COMPLEX = 2
        }
        /**
         * @name 帧数据附加信息
         * @field {number} seed  随机数种子
         */
        interface FrameExtInfo {
            seed: number;
        }
        /**
         * @name 创建房间方式
         * @field {0} COMMON_CREATE  普通创建
         * @field {1} MATCH_CREATE  匹配创建
         */
        enum CreateRoomType {
            COMMON_CREATE = 0,
            MATCH_CREATE = 1,
            THIRD_PARTY_CREATE = 2
        }
        /**
         * @name 网络状态
         * @field {0} COMMON_OFFLINE  房间/队组中玩家掉线
         * @field {1} COMMON_ONLINE  房间/队组中玩家在线
         * @field {2} RELAY_OFFLINE  帧同步中玩家掉线
         * @field {3} RELAY_ONLINE  帧同步中玩家在线
         */
        enum NetworkState {
            COMMON_OFFLINE = 0,
            COMMON_ONLINE = 1,
            RELAY_OFFLINE = 2,
            RELAY_ONLINE = 3
        }
        /**
         * @name 房间帧同步状态
         * @field {0} STOP 未开始帧同步
         * @field {1} START 已开始帧同步
         */
        enum FrameSyncState {
            STOP = 0,
            START = 1
        }
        /**
         * @name 玩家信息
         * @field {string} id  玩家ID
         * @field {string} name  玩家昵称
         * @field {string} teamId  队伍ID
         * @field {number} customPlayerStatus  自定义玩家状态
         * @field {string} customProfile  自定义玩家信息
         * @field {MGOBE.types.NetworkState} commonNetworkState  玩家在房间的网络状态
         * @field {MGOBE.types.NetworkState} relayNetworkState  玩家在游戏中的网络状态
         * @field {boolean} isRobot  玩家是否为机器人
         * @field {MGOBE.types.MatchAttribute[]} matchAttributes  玩家匹配属性列表（isRobot为true时生效）
         */
        interface PlayerInfo {
            id: string;
            name: string;
            teamId: string;
            customPlayerStatus: number;
            customProfile: string;
            commonNetworkState: MGOBE.types.NetworkState;
            relayNetworkState: MGOBE.types.NetworkState;
            isRobot: boolean;
            matchAttributes: MGOBE.types.MatchAttribute[];
        }
        /**
         * @name 队伍信息
         * @field {string} id  队伍ID
         * @field {string} name  队伍名称
         * @field {number} minPlayers  队伍最小人数
         * @field {number} maxPlayers  队伍最大人数
         */
        interface TeamInfo {
            id: string;
            name: string;
            minPlayers: number;
            maxPlayers: number;
        }
        /**
         * @name 队组类型
         * @field {0} GROUP_LIMITED 玩家只能同时存在于1个该类型队组。该类型的队组人数上限：100。
         * @field {1} GROUP_MANY 玩家可以同时存在于多个（上限为5）该类型队组。该类型的队组人数上限：300。
         */
        enum GroupType {
            GROUP_LIMITED = 0,
            GROUP_MANY = 1
        }
        /**
         * @name 队组信息
         * @description 对于非持久化队组（isPersistent为false），当队组解散，或者队组内没有玩家，或者队组玩家全部掉线超过60分钟，或者队组存在时间超过24小时后，队组会被销毁。
         * @description 对于持久化队组（isPersistent为true），只有当主动解散队组后，队组会被销毁。
         * @description 玩家可以加入多个 GROUP_MANY 类型队组（type 为 GroupType.GROUP_MANY），同时加入的数量上限为5个。
         * @description 玩家最多只能加入1个 GROUP_LIMITED 类型队组（type 为 GroupType.GROUP_LIMITED）。
         * @field {string} id  队组ID
         * @field {string} name  队组名称
         * @field {MGOBE.types.GroupType} type  队组类型
         * @field {number} maxPlayers  队组最大玩家数量
         * @field {string} owner  队长ID
         * @field {string} customProperties  自定义队组属性
         * @field {number} createTime  创建队组时间
         * @field {boolean} isForbidJoin  是否禁止加入队组
         * @field {boolean} isPersistent  是否持久化
         * @field {MGOBE.types.GroupPlayerInfo[]} groupPlayerList  队组内的玩家列表
         */
        interface GroupInfo {
            id: string;
            name: string;
            type: MGOBE.types.GroupType;
            maxPlayers: number;
            owner: string;
            customProperties: string;
            createTime: number;
            isForbidJoin: boolean;
            isPersistent: boolean;
            groupPlayerList: MGOBE.types.GroupPlayerInfo[];
        }
        /**
         * @name 队组玩家信息
         * @field {string} id  玩家ID
         * @field {string} name  玩家昵称
         * @field {number} customGroupPlayerStatus  自定义玩家状态
         * @field {string} customGroupPlayerProfile  自定义玩家信息
         * @field {MGOBE.types.NetworkState} commonGroupNetworkState  玩家网络状态
         */
        interface GroupPlayerInfo {
            id: string;
            name: string;
            customGroupPlayerStatus: number;
            customGroupPlayerProfile: string;
            commonGroupNetworkState: MGOBE.types.NetworkState;
        }
        /**
         * @name 玩家加入队组广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         * @field {string} joinPlayerId  加入队组玩家ID
         */
        interface JoinGroupBst {
            groupInfo: MGOBE.types.GroupInfo;
            joinPlayerId: string;
        }
        /**
         * @name 玩家退出队组广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         * @field {string} leavePlayerId  退出队组玩家ID
         */
        interface LeaveGroupRsp {
            groupInfo: MGOBE.types.GroupInfo;
            leavePlayerId: string;
        }
        /**
         * @name 队组解散广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface DismissGroupBst {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 队组属性变更广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface ChangeGroupBst {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 队组内玩家被移除广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         * @field {string} removePlayerId  被移除玩家ID
         */
        interface RemoveGroupPlayerBst {
            groupInfo: MGOBE.types.GroupInfo;
            removePlayerId: string;
        }
        /**
         * @name 队组内玩家网络状态变化广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         * @field {string} changePlayerId  玩家ID
         * @field {MGOBE.types.NetworkState} networkState  玩家网络状态
         */
        interface ChangeGroupPlayerNetworkStateBst {
            groupInfo: MGOBE.types.GroupInfo;
            changePlayerId: string;
            networkState: MGOBE.types.NetworkState;
        }
        /**
         * @name 队组内玩家自定义状态变化广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         * @field {string} changePlayerId  玩家ID
         * @field {number} customGroupPlayerStatus  自定义玩家状态
         */
        interface ChangeCustomGroupPlayerStatusBst {
            groupInfo: MGOBE.types.GroupInfo;
            changePlayerId: string;
            customGroupPlayerStatus: number;
        }
        /**
         * @name 队组内玩家自定义属性变化广播回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         * @field {string} changePlayerId  玩家ID
         * @field {number} customProfile  自定义玩家属性
         */
        interface ChangeGroupPlayerProfileBst {
            changePlayerId: string;
            customProfile: string;
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 队组内消息广播回调参数
         * @field {string} groupId  队组ID
         * @field {string} sendPlayerId  消息发送者ID
         * @field {string} msg  消息内容
         */
        interface RecvFromGroupClientBst {
            groupId: string;
            sendPlayerId: string;
            msg: string;
        }
        /**
         * @name 获取队组信息参数
         * @field {string} groupId  队组ID
         */
        interface GetGroupByGroupIdPara {
            groupId: string;
        }
        /**
         * @name 获取队组信息回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface GetGroupByGroupIdRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 获取当前玩家队组信息回调参数
         * @field {MGOBE.types.GroupInfo[]} groupInfoList  队组信息列表
         */
        interface GetMyGroupsRsp {
            groupInfoList: MGOBE.types.GroupInfo[];
        }
        /**
         * @name 队组玩家信息参数
         * @field {string} name  玩家昵称（字符串长度上限为32）
         * @field {number} customGroupPlayerStatus  自定义玩家状态（取值范围为[0,99999]）
         * @field {string} customGroupPlayerProfile  自定义玩家信息（字符串长度上限为1024）
         */
        interface GroupPlayerInfoPara {
            name: string;
            customGroupPlayerStatus: number;
            customGroupPlayerProfile: string;
        }
        /**
         * @name 创建队组参数
         * @description 对于持久化队组（isPersistent 为 true），maxPlayers 上限为100。
         * @description 对于非持久化队组（isPersistent 为 false），maxPlayers上限为300。
         * @description 每个游戏可以创建的持久化队组数量上限为3个。
         * @field {string} groupName  队组名称（字符串长度上限为32）
         * @field {MGOBE.types.GroupType} groupType  队组类型
         * @field {number} maxPlayers  队组最大玩家数量
         * @field {string} customProperties  自定义队组属性（字符串长度上限为1024）
         * @field {MGOBE.types.GroupPlayerInfoPara} playerInfo  玩家信息
         * @field {boolean} isForbidJoin  是否禁止加入队组
         * @field {boolean} isPersistent  是否持久化
         */
        interface CreateGroupPara {
            groupName: string;
            groupType: MGOBE.types.GroupType;
            maxPlayers: number;
            customProperties: string;
            playerInfo: MGOBE.types.GroupPlayerInfoPara;
            isForbidJoin: boolean;
            isPersistent: boolean;
        }
        /**
         * @name 创建队组回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface CreateGroupRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 加入队组参数
         * @field {MGOBE.types.GroupPlayerInfoPara} playerInfo  玩家信息
         */
        interface JoinGroupPara {
            playerInfo: MGOBE.types.GroupPlayerInfoPara;
        }
        /**
         * @name 加入队组回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface JoinGroupRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 离开队组回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface LeaveGroupRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 解散队组回调参数
         */
        interface DismissGroupRsp {
        }
        /**
         * @name 更新队组参数
         * @field {string} groupName  队组名称（可选）
         * @field {string} owner  队长ID（可选）
         * @field {string} customProperties  自定义队组属性（可选）
         * @field {boolean} isForbidJoin  是否禁止加入队组（可选）
         */
        interface ChangeGroupPara {
            groupName?: string;
            owner?: string;
            customProperties?: string;
            isForbidJoin?: boolean;
        }
        /**
         * @name 更新队组回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface ChangeGroupRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 移除队组玩家参数
         * @field {string} removePlayerId  被移除玩家ID
         */
        interface RemoveGroupPlayerPara {
            removePlayerId: string;
        }
        /**
         * @name 移除队组玩家回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface RemoveGroupPlayerRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 修改队组玩家状态参数
         * @field {number} customGroupPlayerStatus  自定义玩家状态（取值范围为[0,99999]）
         */
        interface ChangeCustomGroupPlayerStatusPara {
            customGroupPlayerStatus: number;
        }
        /**
         * @name 修改队组玩家状态回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface ChangeCustomGroupPlayerStatusRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 修改队组玩家属性参数
         * @field {string} customProfile  自定义玩家属性
         */
        interface ChangeGroupPlayerProfilePara {
            customProfile: string;
        }
        /**
         * @name 修改队组玩家属性回调参数
         * @field {MGOBE.types.GroupInfo} groupInfo  队组信息
         */
        interface ChangeGroupPlayerProfileRsp {
            groupInfo: MGOBE.types.GroupInfo;
        }
        /**
         * @name 消息接收者类型
         * @field {1} GROUP_ALL 全部玩家
         * @field {2} GROUP_OTHERS 除自己外的其他玩家
         * @field {3} GROUP_SOME 队组中部分玩家
         */
        enum GroupRecvType {
            GROUP_ALL = 1,
            GROUP_OTHERS = 2,
            GROUP_SOME = 3
        }
        /**
         * @name 发送队组内消息参数
         * @field {string[]} recvPlayerList  接收消息玩家ID列表
         * @field {string} msg  消息内容
         * @field {MGOBE.types.GroupRecvType} recvType  消息接收者类型
         */
        interface SendToGroupClientPara {
            recvPlayerList: string[];
            msg: string;
            recvType: MGOBE.types.GroupRecvType;
        }
        /**
         * @name 发送队组内消息回调参数
         */
        interface SendToGroupClientRsp {
        }
        /**
         * 响应回调参数
         * @field {number} code  错误码
         * @field {string} msg  错误信息
         * @field {string} seq  响应序列号
         * @field {any} data  响应数据
         */
        interface ResponseEvent<T> {
            code: number;
            msg: string;
            seq: string;
            data?: T;
        }
        /**
         * 广播回调参数
         * @field {any} data  广播数据
         * @field {string} seq  广播序列号
         */
        interface BroadcastEvent<T> {
            data: T;
            seq: string;
        }
        /**
         * 响应回调函数
         */
        type ReqCallback<T> = (event: MGOBE.types.ResponseEvent<T>) => any;

    }
}