import { Viewer } from 'cesium';
import { GUI } from 'dat.gui';

export const example = (viewer: Viewer, gui: GUI) => {
	const options = {
		power: false,
	};

	const folder = gui.addFolder('云盒效果');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			viewer.scene.cloudBox = v;
		});
};
