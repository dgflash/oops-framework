export enum BaseFlag {
    None = 0,
    Enable = 1 << 0,
    Custom = 1 << 2,
}

export abstract class Base {
    protected _objFlag: number = 0;
    public get enable() {
        return !!(this._objFlag & BaseFlag.Enable);
    }
    public set enable(v: boolean) {
        if (v) {
            if (!(this._objFlag & BaseFlag.Enable)) {
                this._objFlag |= BaseFlag.Enable;
                this.onEnable && this.onEnable();
            }
        }
        else {
            if (this._objFlag & BaseFlag.Enable) {
                this._objFlag &= ~BaseFlag.Enable;
                this.onDisable && this.onDisable();
            }
        }
    }
    public onEnable?(): void;
    public onDisable?(): void;
}