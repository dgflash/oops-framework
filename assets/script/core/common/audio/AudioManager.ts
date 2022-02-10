import { Component, game, Node } from "cc";
import { storage } from "../storage/SqlUtil";
import { AudioEffect } from "./AudioEffect";
import { AudioMusic } from "./AudioMusic";

const LOCAL_STORE_KEY = "game_audio";

export class AudioManager extends Component {
    private static _instance: AudioManager;
    public static get instance(): AudioManager {
        if (this._instance == null) {
            var node = new Node("UIAudioManager");
            game.addPersistRootNode(node);
            this._instance = node.addComponent(AudioManager);
            this._instance.init();

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
    private _uuid: string = "10000";                // 玩家唯一标识，一般为玩家数据库唯一编号
    private _localStorageTag: string = "";          // 本地存储标签名

    private init() {
        let data = storage.get(this._localStorageTag);
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

            this.music.volume = this._volume_music;
            this.effect.volume = this._volume_effect;
        }
    }

    /** 设置玩家唯一标识 */
    public setUuid(value: string) {
        this._uuid = value;
        this._localStorageTag = `${LOCAL_STORE_KEY}_${this._uuid}`;
    }

    /**
     *  播放背景音乐
     * @param url        资源地址
     * @param callback   音乐播放完成事件
     */
    playMusic(url: string, callback: Function | null = null) {
        if (this._switch_music) {
            this.music.load(url);
            this.music.onComplete = callback;
        }
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

    /** 背景音乐音量 */
    public get musicVolume(): number {
        return this._volume_music;
    }
    public set musicVolume(value: number) {
        this._volume_music = value;
        this.music.volume = value;
    }

    /** 音效音量 */
    public get effectVolume(): number {
        return this._volume_effect;
    }
    public set effectVolume(value: number) {
        this._volume_effect = value;
        this.effect.volume = value;
    }

    /** 音乐开关 */
    public getSwitchMusic(): boolean {
        return this._switch_music;
    }
    public setSwitchMusic(value: boolean) {
        this._switch_music = value;

        if (value == false)
            this.music.stop();
    }

    /** 音效开关 */
    public getSwitchEffect(): boolean {
        return this._switch_effect;
    }
    public setSwitchEffect(value: boolean) {
        this._switch_effect = value;
        if (value == false)
            this.effect.stop();
    }

    public resumeAll() {
        if (this.music) {
            this.music.play();
            this.effect.play();
        }
    }

    public pauseAll() {
        if (this.music) {
            this.music.pause();
            this.effect.pause();
        }
    }

    public stopAll() {
        if (this.music) {
            this.music.stop();
            this.effect.stop();
        }
    }

    public save() {
        this.local_data.volume_music = this._volume_music;
        this.local_data.volume_effect = this._volume_effect;
        this.local_data.switch_music = this._switch_music;
        this.local_data.switch_effect = this._switch_effect;

        let data = JSON.stringify(this.local_data);
        storage.set(this._localStorageTag, data);
    }
}