import { Cartesian3, Viewer, ViewShed } from 'cesium';
import { GUI } from 'dat.gui';

export const example = (viewer: Viewer, gui: GUI) => {
	// 必须保证摄像机离地面近才有效果 而且可视域的距离不能太远 否则效果有问题 而且地形不生效
	const options = {
		power: false,
	};

	const viewshed = new ViewShed(viewer, {
		viewPosition: Cartesian3.fromDegrees(121.56671270185826, 38.95264873722094, 100),
		viewDistance: 500,
	});

	!options.power && viewshed.clear();

	const folder = gui.addFolder('可视域分析');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			v ? viewshed.add() : viewshed.clear();
		});
};
