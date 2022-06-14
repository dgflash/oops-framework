import { AudioClip, AudioSource, error, _decorator } from 'cc';
import { resLoader } from '../loader/ResLoader';
const { ccclass, menu } = _decorator;

/** 背景音乐 */
@ccclass('AudioMusic')
export class AudioMusic extends AudioSource {
    public onComplete: Function | null = null;

    private _progress: number = 0;
    private _url: string | null = null;
    private _isPlay: boolean = false;

    /**
     * 设置音乐当前播放进度
     * @param progress 进度百分比(0~1)
     */
    public get progress() {
        this._progress = this.currentTime / this.duration;
        return this._progress;
    }
    public set progress(value: number) {
        this._progress = value;
        this.currentTime = value * this.duration;
    }

    public load(url: string, callback?: Function) {
        resLoader.load(url, AudioClip, (err: Error | null, data: AudioClip) => {
            if (err) {
                error(err);
            }

            if (this.playing) {
                this._isPlay = false;
                this.stop();
                resLoader.release(this._url!);
            }

            this.clip = data;
            this.currentTime = 0;
            this.play();

            callback && callback();

            this._url = url;
        });
    }

    update(dt: number) {
        if (this.currentTime > 0) {
            this._isPlay = true;
        }

        if (this._isPlay && this.playing == false) {
            this._isPlay = false;
            this.onComplete && this.onComplete();
        }
    }

    release() {
        if (this._url) {
            resLoader.release(this._url);
            this._url = null;
        }
    }
}
