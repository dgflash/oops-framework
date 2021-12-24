
import { _decorator, Component, Node, Mesh, renderer, director, Material } from 'cc';
import { cinestationShareAssets } from '../CinestationShareAssets';
import { Nullable } from './Types';

const { ccclass, property } = _decorator;

@ccclass('Visualization')
export class Visualization extends Component {
    public _modelChanged: boolean = false;

    protected _mesh: Nullable<Mesh> = null;
    protected _model: Nullable<renderer.scene.Model> = null;
    protected _material: Material = cinestationShareAssets.lineMaterial;
    protected _visibleInRuntime: boolean = CC_EDITOR;
    protected _visibleDefault: boolean = true;

    public get visible() {
        return this._model ? this._model.enabled : false;
    }

    public set visible(v: boolean) {
        if (this._model) this._model.enabled = v;
    }

    public onEnable() {
        if (this._visibleInRuntime) {
            this._createModel();
            this._attachToScene();
        }
    }

    public onDisable() {
        if (this._visibleInRuntime) {
            this._detachFromScene();
        }
    }

    private _attachToScene() {
        if (this._model && this.node && this.node.scene) {
            if (this._model.scene) {
                this._detachFromScene();
            }
            this._getRenderScene().addModel(this._model);
        }
    }

    private _detachFromScene() {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    private _createModel() {
        if (this._model) return;
        this._model = director.root!.createModel(renderer.scene.Model);
        this._model.node = this._model.transform = this.node;
        this._model.enabled = this._visibleDefault;
        this._modelChanged = true;
    }


    public update(dt: number) {
        if (this._modelChanged && this._model) {
            this._modelChanged = false;
            this._mesh = this._updateMesh(this._mesh);
            this._mesh && this._model.initSubModel(0, this._mesh.renderingSubMeshes[0], this._material);
        }
    }

    protected _updateMesh(mesh: Nullable<Mesh>) {
        return mesh;
    }
}
