import { GUI, GUIController } from 'dat.gui';
import {
	Cartesian2,
	PostProcessStageComposite,
	PostProcessStageLibrary,
	ScreenSpaceEventHandler,
	ScreenSpaceEventType,
	Viewer,
	getTimestamp,
} from 'cesium';

export const _controlNightVision = () => {
	return new PostProcessStageComposite({
		stages: [PostProcessStageLibrary.createNightVisionStage()],
	});
};

let _handler: ScreenSpaceEventHandler;
let _viewer: Viewer;
export let waterRipplePower: GUIController;
export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	_handler = new ScreenSpaceEventHandler(_viewer.scene.canvas);
	const options = {
		nightPower: false,
		skylinePower: false,
		waterRipplePower: false,
	};
	const _nightControl: PostProcessStageComposite = _controlNightVision();
	_nightControl.enabled = options.nightPower;
	viewer.postProcessStages.add(_nightControl);

	const _skylineControl: PostProcessStageComposite = PostProcessStageComposite.createSkylineComposite();
	_skylineControl.enabled = options.skylinePower;
	viewer.postProcessStages.add(_skylineControl);

	const _waterRippleControl: PostProcessStageComposite = PostProcessStageLibrary.createWaterRipple();
	_waterRippleControl.enabled = options.waterRipplePower;
	viewer.postProcessStages.add(_waterRippleControl);

	const folder = gui.addFolder('辅助效果');
	folder
		.add(options, 'nightPower')
		.name('夜视模式')
		.onChange(v => {
			_nightControl.enabled = v;
		});
	folder
		.add(options, 'skylinePower')
		.name('天际线')
		.onChange(v => {
			_skylineControl.enabled = v;
		});
	waterRipplePower = folder
		.add(options, 'waterRipplePower')
		.name('水波纹')
		.onChange(v => {
			_waterRippleControl.enabled = v;
			if (v) {
				_handler.setInputAction((event: { position: Cartesian2 }) => {
					_waterRippleControl.uniforms.startTime = getTimestamp() / 1000;
					_waterRippleControl.uniforms.pos.x =
						event.position.x / document.getElementById('canvas')!.clientWidth;
					_waterRippleControl.uniforms.pos.y =
						1 - event.position.y / document.getElementById('canvas')!.clientHeight;
				}, ScreenSpaceEventType.LEFT_CLICK);
			} else {
				_handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
			}
		});
};
