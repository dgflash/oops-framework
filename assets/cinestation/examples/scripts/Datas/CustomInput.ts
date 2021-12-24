import { Director, director, EventKeyboard, EventMouse, KeyCode, SystemEvent, systemEvent, view } from "cc";

class CustomInput {
    private _initialized: boolean = false;
    private _mouseLeft: number = 0;
    private _mouseRight: number = 0;
    private _mouseX: number = 0;
    private _mouseY: number = 0;
    private _mouseSensitivity: number = 1;
    private _horizontal: number = 0;
    private _vertical: number = 0;
    private _buttons: { [k: number]: number } = {};

    public get mouseLeft() {
        return this._mouseLeft;
    }

    public get mouseRight() {
        return this._mouseRight;
    }

    public get mouseX() {
        return this._mouseX;
    }

    public get mouseY() {
        return this._mouseY;
    }

    public get horizontal() {
        return this._horizontal;
    }

    public get vertical() {
        return this._vertical;
    }

    public getButton(k: number) {
        return this._buttons[k] || 0;
    }

    public initialize(lockPointer: boolean = false) {
        if (this._initialized == false) {
            this._initialized = true;
            if (lockPointer) {
                this._requestPointerLock();
            }
            else {
                this._registEvents();
            }
            director.on(Director.EVENT_AFTER_UPDATE, this._onAfterUpdate, this);
        }
    }

    private _requestPointerLock() {
        //https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
        let device = director.root?.device as any;
        let canvas = device.canvas || (device.gl && device.gl.canvas) as any;
        if (canvas) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            canvas.onclick = () => {
                canvas.requestPointerLock();
            }
            let onlockchange = () => {
                //@ts-ignore
                if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement) {
                    this._registEvents();
                }
                else {
                    this._unregistEvents();
                }
            }
            //@ts-ignore
            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock
            document.addEventListener("pointerlockchange", onlockchange, false);
            document.addEventListener("mozpointerlockchange", onlockchange, false);
            document.addEventListener("webkitpointerlockchange", onlockchange, false);
        }
    }

    private _registEvents() {
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this._onMouseDown, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this._onMouseUp, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this._onMouseMove, this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _unregistEvents() {
        systemEvent.off(SystemEvent.EventType.MOUSE_DOWN, this._onMouseDown, this);
        systemEvent.off(SystemEvent.EventType.MOUSE_UP, this._onMouseUp, this);
        systemEvent.off(SystemEvent.EventType.MOUSE_MOVE, this._onMouseMove, this);
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _onMouseDown(e: EventMouse) {
        switch (e.getButton()) {
            case EventMouse.BUTTON_LEFT:
                this._mouseLeft = 1;
                break;
            case EventMouse.BUTTON_RIGHT:
                this._mouseRight = 1;
                break;
        }
    }

    private _onMouseUp(e: EventMouse) {
        switch (e.getButton()) {
            case EventMouse.BUTTON_LEFT:
                this._mouseLeft = 0;
                break;
            case EventMouse.BUTTON_RIGHT:
                this._mouseRight = 0;
                break;
        }
    }

    private _onMouseMove(e: EventMouse) {
        this._mouseX = e.getDeltaX() * this._mouseSensitivity;
        this._mouseY = e.getDeltaY() * this._mouseSensitivity;
    }

    private _onKeyDown(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.KEY_W:
                this._vertical = 1;
                break;
            case KeyCode.KEY_S:
                this._vertical = -1;
                break;
            case KeyCode.KEY_A:
                this._horizontal = 1;
                break;
            case KeyCode.KEY_D:
                this._horizontal = -1;
                break;
            default:
                this._buttons[e.keyCode] = 1;
        }
    }

    private _onKeyUp(e: EventKeyboard) {
        switch (e.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this._vertical = 0;
                break;
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                this._horizontal = 0;
                break;
            default:
                this._buttons[e.keyCode] = 0;
        }
    }

    private _onAfterUpdate() {
        this._mouseX = 0;
        this._mouseY = 0;
    }
}

export const customInput = new CustomInput();