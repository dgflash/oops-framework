import { EffectAsset, game, Game, gfx, Material, VERSION } from "cc";
import { Effect } from "./Common/Effect";
import { Effect3_4 } from "./Common/Effect3_4";

let lineMaterial = new Material();
lineMaterial._uuid = "cinestation-line-material";

let viewMaterial = new Material();
viewMaterial._uuid = "cinestation-view-material";

game.on(Game.EVENT_GAME_INITED, () => {
    lineMaterial.initialize({
        effectName: "unlit",
        defines: { USE_VERTEX_COLOR: true },
        states: { primitive: gfx.PrimitiveMode.LINE_LIST }
    });
    lineMaterial.passes.forEach(v => v.tryCompile());

    let effectAsset = Object.assign(new EffectAsset(), VERSION.startsWith("3.4") ? Effect3_4 : Effect);
    effectAsset.onLoaded();
    viewMaterial.initialize({ effectAsset });
    viewMaterial.passes.forEach(v => v.tryCompile());
})

class CinestationShareAssets {
    public viewMaterial: Material = viewMaterial;
    public lineMaterial: Material = lineMaterial;

    public __setDebugProperty(k: string, v: any) {
        this.viewMaterial.setProperty(k, v);
    }
}

export const cinestationShareAssets = new CinestationShareAssets();