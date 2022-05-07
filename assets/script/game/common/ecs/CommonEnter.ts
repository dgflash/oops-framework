/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-12 18:38:08
 */
import { Root } from '../../../core/Root';
import { config } from '../config/Config';
import { CommonSystem } from './CommonSystem';

/** 游戏业务入口 */
export class CommonEnter extends Root {
    private ecs!: CommonSystem;

    onLoad() {
        this.ecs = new CommonSystem();
        this.ecs.init();

        // 加载游戏配置
        config.init(this.run.bind(this));

        super.onLoad();
    }

    /** 加载完引擎配置文件后执行 */
    protected run() {

    }

    update(dt: number) {
        this.ecs.execute(dt);
    }
}