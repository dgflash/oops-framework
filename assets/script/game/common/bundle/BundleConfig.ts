export default class BundleConfig {
	private static _instance: BundleConfig = null!;

	static get instance(): BundleConfig {
		return (BundleConfig._instance ? BundleConfig._instance : (BundleConfig._instance = new BundleConfig()));
	}

	// start >>>>>>
	BundleName = {
 		game: {
 			prefab: {
 				"game1": 'prefab/game1', 
 				"game2": 'prefab/game2', 
 			},
 			sound: {
 				"music1": 'sound/music1', 
 				"music2": 'sound/music2', 
 			},
 			texture: {
 				"game1": 'texture/game1', 
 				"game2": 'texture/game2', 
 			},
 		},
 		home: {
 			prefab: {
 				"home1": 'prefab/home1', 
 				"home2": 'prefab/home2', 
 			},
 			sound: {
 				"music1": 'sound/music1', 
 				"music2": 'sound/music2', 
 			},
 			texture: {
 				"home1": 'texture/home1', 
 				"home2": 'texture/home2', 
 			},
 		},
 	}
	// end >>>>>>
}
