/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:06:01
 */
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { Root } from '../../../../../extensions/oops-plugin-framework/assets/core/Root';
import { ECSRootSystem } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECSSystem';
import { config } from '../config/Config';
import { CommonSystem } from './CommonSystem';

/** 游戏业务入口 */
export class CommonEnter extends Root {
    onLoad() {
        super.onLoad();

        oops.ecs = new ECSRootSystem();
        oops.ecs.add(new CommonSystem())
        oops.ecs.init();

        // 加载游戏配置
        config.init(this.run.bind(this));
    }

    /** 加载完引擎配置文件后执行 */
    protected run() {

    }

    update(dt: number) {
        oops.ecs.execute(dt);
    }
}