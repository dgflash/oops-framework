/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2023-08-28 17:23:59
 */
import { Component, EventTouch, _decorator } from "cc";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { LabelChange } from "../../../../extensions/oops-plugin-framework/assets/libs/gui/label/LabelChange";
import { UIID } from "../common/config/GameUIConfig";
import { smc } from "../common/ecs/SingletonModuleComp";
import { tips } from "../common/prompt/TipsManager";
import { RoleViewInfoComp } from "../role/view/RoleViewInfoComp";

const { ccclass, property } = _decorator;
// 视图层实体是空的
@ccclass('Demo')
export class Demo extends Component {
    private lang: boolean = true;

    @property(LabelChange)
    private labChange: LabelChange = null!;

    start() {
        // resLoader.dump();

        // console.log("当前图集数量", dynamicAtlasManager.atlasCount);
        // console.log("可以创建的最大图集数量", dynamicAtlasManager.maxAtlasCount);
        // console.log("创建的图集的宽高", dynamicAtlasManager.textureSize);
        // console.log("可以添加进图集的图片的最大尺寸", dynamicAtlasManager.maxFrameSize);
        // console.log("可以添加进图集的图片的最大尺寸", dynamicAtlasManager.maxFrameSize);

        // console.log("是否是原生平台", sys.isNative);
        // console.log("是否是浏览器", sys.isBrowser);
        // console.log("是否是移动端平台", sys.isMobile);
        // console.log("是否是小端序", sys.isLittleEndian);
        // console.log("运行平台或环境", sys.platform);
        // console.log("运行环境的语言", sys.language);
        // console.log("运行环境的语言代码", sys.languageCode);
        // console.log("当前运行系统", sys.os);
        // console.log("运行系统版本字符串", sys.osVersion);
        // console.log("当前系统主版本", sys.osMainVersion);
        // console.log("当前运行的浏览器类型", sys.browserType);
        // console.log("获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`", sys.getNetworkType());
        // console.log("取当前设备的电池电量，如果电量无法获取，默认将返回 1", sys.getBatteryLevel());


        this.labChange.changeTo(0.5, 250, () => { })
    }

    private btn_long(event: EventTouch, data: any) {
        oops.gui.toast(data, true);
    }

    /** 升级 */
    private btn_level_up(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.upgrade();
    }

    /** 攻击 */
    private btn_attack(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.attack();
    }

    /** 转职弓箭 */
    private btn_change_job9(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.changeJob(9);
    }

    /** 转职匕首 */
    private btn_change_job5(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.changeJob(5);
    }

    /** 转职刀 */
    private btn_change_job1(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.changeJob(1);
    }

    /** 打开角色界面 */
    private async btn_open_role_info(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        var node = await oops.gui.openAsync(UIID.Demo_Role_Info, "传递参数");
        if (node) role.add(node.getComponent(RoleViewInfoComp)!);
    }

    /** 多语言切换 */
    private btn_language(event: EventTouch, data: any) {
        console.log(oops.language.getLangByID("notify_show"));

        if (this.lang == false) {
            this.lang = true;
            oops.language.setLanguage("zh", () => { });
        }
        else {
            this.lang = false;
            oops.language.setLanguage("en", () => { });
        }
    }

    /** 弹出提示框 */
    private btn_common_prompt(event: EventTouch, data: any) {
        tips.test(() => {

        });
        tips.test(() => {

        });
        tips.confirm("内容1", () => {

        }, "确认1");
        tips.confirm("内容2", () => {

        }, "确认2");
    }

    /** 漂浮提示框 */
    private btn_notify_show(event: EventTouch, data: any) {
        oops.gui.toast("common_prompt_content", true);
    }

    /** 加载提示 */
    private netInstableOpen(event: EventTouch, data: any) {
        oops.gui.waitOpen();
        setTimeout(() => {
            oops.gui.waitClose();
        }, 2000);
    }

    /** 背景音乐 */
    private btn_audio_open1(event: EventTouch, data: any) {
        oops.audio.volumeMusic = 0.5;
        oops.audio.playMusicLoop("audios/nocturne");
    }

    /** 背景音效 */
    private btn_audio_open2(event: EventTouch, data: any) {
        oops.audio.playEffect("audios/Gravel");
    }
}
