import { Component, director, Node } from "cc";
import { storage } from "../storage/StorageManager";
import { AudioEffect } from "./AudioEffect";
import { AudioMusic } from "./AudioMusic";

const LOCAL_STORE_KEY = "game_audio";

/** 音频管理 */
export class AudioManager extends Component {
    private static _instance: AudioManager;
    public static get instance(): AudioManager {
        if (this._instance == null) {
            var node = new Node("UIAudioManager");
            director.addPersistRootNode(node);
            this._instance = node.addComponent(AudioManager);
            this._instance.load();

            var music = new Node("UIMusic");
            music.parent = node;
            this._instance.music = music.addComponent(AudioMusic);

            var effect = new Node("UIEffect");
            effect.parent = node;
            this._instance.effect = effect.addComponent(AudioEffect);
        }
        return this._instance;
    }

    private local_data: any = {};

    private music!: AudioMusic;
    private effect!: AudioEffect;

    private _volume_music: number = 1;
    private _volume_effect: number = 1;
    private _switch_music: boolean = true;
    private _switch_effect: boolean = true;

    /** 音乐播放完成回调 */
    setMusicComplete(callback: Function | null = null) {
        this.music.onComplete = callback;
    }

    /**
     *  播放背景音乐
     * @param url        资源地址
     * @param callback   音乐播放完成事件
     */
    playMusic(url: string, callback?: Function) {
        if (this._switch_music) {
            this.music.load(url, callback);
        }
    }

    /** 获取音乐播放进度 */
    get progressMusic(): number {
        return this.music.progress;
    }
    set progressMusic(value: number) {
        this.music.progress = value;
    }

    /** 背景音乐音量 */
    get volumeMusic(): number {
        return this._volume_music;
    }
    set volumeMusic(value: number) {
        this._volume_music = value;
        this.music.volume = value;
    }

    /** 音乐开关 */
    get switchMusic(): boolean {
        return this._switch_music;
    }
    set switchMusic(value: boolean) {
        this._switch_music = value;

        if (value == false)
            this.music.stop();
    }

    /**
     * 播放音效
     * @param url        资源地址
     */
    playEffect(url: string) {
        if (this._switch_effect) {
            this.effect.load(url);
        }
    }

    /** 音效音量 */
    get volumeEffect(): number {
        return this._volume_effect;
    }
    set volumeEffect(value: number) {
        this._volume_effect = value;
        this.effect.volume = value;
    }

    /** 音效开关 */
    get switchEffect(): boolean {
        return this._switch_effect;
    }
    set switchEffect(value: boolean) {
        this._switch_effect = value;
        if (value == false)
            this.effect.stop();
    }

    /** 恢复当前暂停的音乐与音效播放 */
    resumeAll() {
        if (this.music) {
            this.music.play();
            this.effect.play();
        }
    }

    /** 暂停当前音乐与音效的播放 */
    pauseAll() {
        if (this.music) {
            this.music.pause();
            this.effect.pause();
        }
    }

    /** 停止当前音乐与音效的播放 */
    stopAll() {
        if (this.music) {
            this.music.stop();
            this.effect.stop();
        }
    }

    /** 保存音乐音效的音量、开关配置数据到本地 */
    save() {
        this.local_data.volume_music = this._volume_music;
        this.local_data.volume_effect = this._volume_effect;
        this.local_data.switch_music = this._switch_music;
        this.local_data.switch_effect = this._switch_effect;

        let data = JSON.stringify(this.local_data);
        storage.set(LOCAL_STORE_KEY, data);
    }


    /** 本地加载音乐音效的音量、开关配置数据并设置到游戏中 */
    load() {
        let data = storage.get(LOCAL_STORE_KEY);
        if (data) {
            try {
                this.local_data = JSON.parse(data);
                this._volume_music = this.local_data.volume_music;
                this._volume_effect = this.local_data.volume_effect;
                this._switch_music = this.local_data.switch_music;
                this._switch_effect = this.local_data.switch_effect;
            }
            catch (e) {
                this.local_data = {};
                this._volume_music = 1;
                this._volume_effect = 1;
                this._switch_music = true;
                this._switch_effect = true;
            }

            if (this.music) this.music.volume = this._volume_music;
            if (this.effect) this.effect.volume = this._volume_effect;
        }
    }
}