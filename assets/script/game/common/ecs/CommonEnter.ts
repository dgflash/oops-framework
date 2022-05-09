/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-05-09 09:46:22
 */
import { ECSRootSystem } from '../../../core/libs/ecs/ECSSystem';
import { oops } from '../../../core/Oops';
import { Root } from '../../../core/Root';
import { config } from '../config/Config';
import { CommonSystem } from './CommonSystem';

/** 游戏业务入口 */
export class CommonEnter extends Root {
    onLoad() {
        oops.ecs = new ECSRootSystem();
        oops.ecs.add(new CommonSystem())
        oops.ecs.init();

        // 加载游戏配置
        config.init(this.run.bind(this));

        super.onLoad();
    }

    /** 加载完引擎配置文件后执行 */
    protected run() {

    }

    update(dt: number) {
        oops.ecs.execute(dt);
    }
}