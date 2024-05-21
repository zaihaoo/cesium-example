import {
	Cartesian3,
	Color,
	NearFarScalar,
	PointPrimitiveCollection,
	PointPrimitiveSpriteType,
	Viewer,
} from 'cesium';
import { GUI } from 'dat.gui';

let _viewer: Viewer;
let _points: PointPrimitiveCollection;
let _color = new Color(0.99, 0.6, 0.12, 0.91);
const options = {
	power: false,
};
const _loadTestData = () => {
	_points.add({
		spriteType: PointPrimitiveSpriteType.shineSphere,
		flickerThreshold: true,
		position: Cartesian3.fromDegrees(121.59, 38.94, 200),
		pixelSize: 30.0,
		color: _color,
		outlineColor: Color.TRANSPARENT,
		outlineWidth: 0.0,
		scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
	});

	_points.add({
		spriteType: PointPrimitiveSpriteType.shineSphere,
		flickerThreshold: true,
		position: Cartesian3.fromDegrees(121.59, 38.95, 200),
		pixelSize: 50.0,
		color: Color.BLUE.withAlpha(0.5),
		outlineColor: Color.TRANSPARENT,
		outlineWidth: 0.0,
		scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
	});
	_points.add({
		spriteType: PointPrimitiveSpriteType.shineSphere,
		flickerThreshold: false,
		position: Cartesian3.fromDegrees(121.59, 38.95, 200),
		pixelSize: 30.0,
		color: Color.RED.withAlpha(0.5),
		outlineColor: Color.TRANSPARENT,
		outlineWidth: 0.0,
		scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
	});

	_points.add({
		spriteType: PointPrimitiveSpriteType.shineSphere,
		flickerThreshold: true,
		position: Cartesian3.fromDegrees(121.59, 38.96, 200),
		pixelSize: 50.0,
		color: Color.BLUE.withAlpha(0.5),
		outlineColor: Color.TRANSPARENT,
		outlineWidth: 0.0,
		scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
	});

	_points.add({
		spriteType: PointPrimitiveSpriteType.petal,
		flickerThreshold: true,
		position: Cartesian3.fromDegrees(121.59, 38.92, 200),
		pixelSize: 30.0,
		color: _color,
		outlineColor: Color.TRANSPARENT,
		outlineWidth: 0.0,
		scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
	});

	_viewer.scene.bloom.add(
		_points.add({
			spriteType: PointPrimitiveSpriteType.petal,
			position: Cartesian3.fromDegrees(121.59, 38.93, 200),
			pixelSize: 25.0,
			color: Color.RED.withAlpha(0.5),
			outlineColor: Color.TRANSPARENT,
			outlineWidth: 0.0,
			scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
		})
	);

	_viewer.scene.bloom.add(
		_points.add({
			spriteType: PointPrimitiveSpriteType.none,
			position: Cartesian3.fromDegrees(121.59, 38.97, 200),
			pixelSize: 25.0,
			color: Color.BLUE,
			outlineColor: Color.TRANSPARENT,
			outlineWidth: 0.0,
			scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
		})
	);
};
export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	_points = viewer.scene.primitives.add(new PointPrimitiveCollection({ show: options.power }));
	_loadTestData();

	const folder = gui.addFolder('示例点效果');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			_points.show = v;
		});
};
