import { BubblingCylinder, Cartesian3, Color, Transforms, Viewer } from 'cesium';
import { GUI } from 'dat.gui';

let objA: BubblingCylinder;
let objB: BubblingCylinder;
const _loadTestData = () => {
	objA = new BubblingCylinder({
		modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.58, 38.91, 0)),
		length: 2000,
		radius: 2000,
		show: false,
	});

	objB = new BubblingCylinder({
		modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.59, 38.94, 0)),
		show: false,
	});
};

export const example = (viewer: Viewer, gui: GUI) => {
	_loadTestData();
	viewer.scene.primitives.add(objA);
	viewer.scene.primitives.add(objB);
	const options = {
		power: false,
		color: objA.color.toCssColorString(),
	};

	const folder = gui.addFolder('冒泡圆柱体');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			objA.show = v;
			objB.show = v;
		});
	folder
		.addColor(options, 'color')
		.name('颜色')
		.onChange(v => {
			objA.color = Color.fromCssColorString(v);
		});
};
