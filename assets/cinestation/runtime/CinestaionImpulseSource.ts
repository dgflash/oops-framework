
import { _decorator, Component } from 'cc';
import { cinestation } from './CinestationData';
import { EPSILON, quarticDamp } from './Common/Math';
import { NoiseType, VCamNoise } from './Datas/VCamNoise';
import { NoiseGenerator, NoiseProfile } from './NoiseGenerator';
const { ccclass, property } = _decorator;

function createImpulseNoise() {
    let noise = new VCamNoise();
    noise.type = NoiseType.Perlin;
    noise.profile = NoiseProfile.Shake_6D;
    noise.amplitudeGain = 0.5;
    noise.frequncyGain = 4;
    return noise;
}

@ccclass('CinestaionImpulseSource')
export class CinestaionImpulseSource extends Component {
    private _generator: NoiseGenerator = new NoiseGenerator();
    private _impluseDecay: number = 0;

    @property({ type: VCamNoise })
    noise: VCamNoise = createImpulseNoise();

    @property
    decayTime: number = 0.3;

    public onLoad() {
        this.node.on("setImpulse", this._setImpulse, this);
    }

    private _setImpulse(v: number = 1) {
        this._impluseDecay = v;
    }

    public onEnable() {
        cinestation.addImpulseSource(this);
    }

    public onDisable() {
        cinestation.removeImpulseSource(this);
    }

    public generateImpulse(deltaTime: number) {
        if (this._impluseDecay <= EPSILON) {
            return null;
        }
        this._impluseDecay = quarticDamp(this._impluseDecay, 0, this.decayTime, deltaTime);
        let values = this._generator.fractalNoise(this.noise, deltaTime);
        for (let i = 0; i < values.length; i++) {
            values[i] *= this._impluseDecay;
        }
        return values;
    }
}
