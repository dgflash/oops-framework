/** 引擎扩展 */
(function (global) {
    'use strict';

    var cc = global.cc;

    // 游戏速率
    cc.director._kSpeed = 1;
    var _originCalculateDeltaTime = cc.Director.prototype.calculateDeltaTime;
    cc.director.calculateDeltaTime = function (now) {
        _originCalculateDeltaTime.call(this, now);
        this._deltaTime *= this._kSpeed;
    }

    /** 全局游戏动画数度设置 */
    cc.kSetSpeed = function (speed) {
        cc.director._kSpeed = speed;
    }
    cc.kGetSpeed = function () {
        return cc.director._kSpeed;
    }
})(window)