import { Cartesian3, Cesium3DTileset, Color, Matrix4, Model, Transforms, Viewer } from 'cesium';
import { GUI } from 'dat.gui';

let _viewer: Viewer;
let _glb: Model;
let _tileset: Cesium3DTileset;
const deploy = {
	160: Color.BLUE,
	390: Color.GREEN,
	550: Color.YELLOW,
	780: Color.WHITESMOKE,
	1000: Color.RED,
};
const _loadTestData = async () => {
	_tileset = _viewer.scene.primitives.add(
		await Cesium3DTileset.fromUrl('Assets/File/Model/cliff/tileset.json', {
			maximumScreenSpaceError: 0,
		})
	);
	const car3 = _tileset.boundingSphere.center;
	const _car3 = Cartesian3.multiplyByScalar(car3, -1, new Cartesian3());
	let ma = Matrix4.fromTranslation(
		Cartesian3.fromElements(-2599091.2989332466, 4237304.23421351, 3983739.1323248832)
	);
	Matrix4.multiplyByScale(ma, new Cartesian3(70, 70, 70), ma);
	_tileset.modelMatrix = Matrix4.multiplyByTranslation(ma, _car3, ma);

	_glb = _viewer.scene.primitives.add(
		await Model.fromGltfAsync({
			url: 'Assets/File/Model/scene1.glb',
			modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.58, 38.91, 700)),
			scale: 1200,
		})
	);
};
export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	_loadTestData();
	const options = {
		power: false,
		pure: false,
		lerp: true,
	};

	const folder = gui.addFolder('模型高度可视化');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			if (v) {
				_tileset.terrainDisplay(deploy, options.pure, options.lerp);
				_glb.terrainDisplay(deploy, options.pure, options.lerp);
			} else {
				_tileset.closeTerrainDisplay();
				_glb.closeTerrainDisplay();
			}
		});
	folder
		.add(options, 'pure')
		.name('单一着色')
		.onChange(_ => {
			if (options.power) {
				_tileset.terrainDisplay(deploy, options.pure, options.lerp);
				_glb.terrainDisplay(deploy, options.pure, options.lerp);
			}
		});
	folder
		.add(options, 'lerp')
		.name('材质混合')
		.onChange(_ => {
			if (options.power) {
				_tileset.terrainDisplay(deploy, options.pure, options.lerp);
				_glb.terrainDisplay(deploy, options.pure, options.lerp);
			}
		});
};
