/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 10:14:26
 */
import { Component, dynamicAtlasManager, EventTouch, _decorator } from "cc";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../common/config/GameUIConfig";
import { SingletonModuleComp, smc } from "../common/ecs/SingletonModuleComp";
import { tips } from "../common/prompt/TipsManager";

const { ccclass, property } = _decorator;
// 视图层实体是空的
@ccclass('Demo')
export class Demo extends Component {
    private lang: boolean = true;

    async onLoad() {
        // var path = "gui/prefab/role_info_base";
        // var node = await ViewUtil.createPrefabNodeAsync(path);
        // node.parent = this.node;

        // 释放实始化实体
        smc.initialize.destroy();
    }

    start() {
        // 释放加载界面资源
        console.log("内存中现有资源");
        // resLoader.dump();

        console.log("当前图集数量", dynamicAtlasManager.atlasCount);
        console.log("可以创建的最大图集数量", dynamicAtlasManager.maxAtlasCount);
        console.log("创建的图集的宽高", dynamicAtlasManager.textureSize);
        console.log("可以添加进图集的图片的最大尺寸", dynamicAtlasManager.maxFrameSize);
        console.log("可以添加进图集的图片的最大尺寸", dynamicAtlasManager.maxFrameSize);
    }

    private btn_long(event: EventTouch, data: any) {
        oops.gui.toast(data);
    }

    /** 升级 */
    private btn_level_up(event: EventTouch, data: any) {
        var role = ecs.getSingleton(SingletonModuleComp).account.AccountModel.role;
        role.upgrade();
        // role.remove(RoleViewComp);
        // resLoader.releaseDir("content/role");
    }

    /** 攻击 */
    private btn_attack(event: EventTouch, data: any) {
        var role = ecs.getSingleton(SingletonModuleComp).account.AccountModel.role;
        role.attack();

        // role.load();
        // role.RoleView.node.parent = oops.gui.game;
    }

    /** 转职弓箭 */
    private btn_change_job9(event: EventTouch, data: any) {
        var role = ecs.getSingleton(SingletonModuleComp).account.AccountModel.role;
        role.changeJob(9);
    }

    /** 转职匕首 */
    private btn_change_job5(event: EventTouch, data: any) {
        var role = ecs.getSingleton(SingletonModuleComp).account.AccountModel.role;
        role.changeJob(5);
    }

    /** 转职刀 */
    private btn_change_job1(event: EventTouch, data: any) {
        var role = ecs.getSingleton(SingletonModuleComp).account.AccountModel.role;
        role.changeJob(1);
    }

    /** 打开角色界面 */
    private btn_open_role_info(event: EventTouch, data: any) {
        oops.gui.open(UIID.Demo_Role_Info);
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
    }

    /** 漂浮提示框 */
    private btn_notify_show(event: EventTouch, data: any) {
        oops.gui.toast("common_prompt_content");
    }

    /** 加载提示 */
    private netInstableOpen(event: EventTouch, data: any) {
        tips.netInstableOpen();
        setTimeout(() => {
            tips.netInstableClose();
        }, 2000);
    }

    /** 背景音乐 */
    private btn_audio_open1(event: EventTouch, data: any) {
        oops.audio.volumeMusic = 0.5;

        oops.audio.setMusicComplete(() => {
            oops.audio.playMusic("audios/nocturne");
        });
        oops.audio.playMusic("audios/Gravel");
    }

    /** 背景音效 */
    private btn_audio_open2(event: EventTouch, data: any) {
        oops.audio.playEffect("audios/Gravel");
    }
}
