import { log } from 'cc';
import { IControl } from './IControl'

/** 行为树节点 */
export abstract class BTreeNode implements IControl {
    protected _control!: IControl;

    public title: string;

    public constructor() {
        this.title = this.constructor.name;
    }

    public start(obj?: any) {
        // log("start_" + this.title)
    }

    public end(obj?: any) {

    }

    public abstract run(obj?: any): void;

    public setControl(control: IControl) {
        this._control = control;
    }

    public running(obj?: any) {
        this._control.running(this);
    }

    public success() {
        // log("success_" + this.title)
        this._control.success();
    }

    public fail() {
        this._control.fail();
    }
}