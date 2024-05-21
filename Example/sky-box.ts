import { SkyBoxControl, Viewer } from 'cesium';
import { GUI, GUIController } from 'dat.gui';

export let skyBoxPower: GUIController<object>;
export const example = (viewer: Viewer, gui: GUI) => {
	const obj = new SkyBoxControl(viewer);
	const options = {
		power: false,
	};

	const folder = gui.addFolder('近地天空盒');
	skyBoxPower = folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			v ? obj.enable() : obj.disable();
		});
};
