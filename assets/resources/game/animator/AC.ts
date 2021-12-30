/*
 * @Author: dgflash
 * @Date: 2021-12-28 16:16:15
 * @LastEditors: dgflash
 * @LastEditTime: 2021-12-28 17:54:51
 */

import { animation, Component, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AC')
export class AC extends Component {
    @property({ type: animation.AnimationController })
    private ac: animation.AnimationController = null!;

    start() {
        setInterval(() => {
            if (this.ac.getValue("dir")) {
                this.ac.setValue("dir", false);
            }
            else {
                this.ac.setValue("dir", true);
            }
        }, 1000);
    }
}
