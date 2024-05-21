import { Cartographic, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer } from 'cesium';
import { GUI } from 'dat.gui';

const positions: Cartographic[] = [];
let batch_index: number | undefined = undefined;
let _viewer: Viewer;
let _ramp1: HTMLCanvasElement;
let _ramp2: HTMLCanvasElement;

const options = {
	batch: false,
	draw: undefined,
	removeAll: undefined,
	pick: false,
	ramp: 0,
};

const _loadTestData = () => {
	positions.push(
		Cartographic.fromDegrees(121.515, 38.955),
		Cartographic.fromDegrees(121.515, 38.92),
		Cartographic.fromDegrees(121.53, 38.92),
		Cartographic.fromDegrees(121.53, 38.945),
		Cartographic.fromDegrees(121.575, 38.934),
		Cartographic.fromDegrees(121.575, 38.955)
	);

	const slopeRamp1 = [0.0, 0.29, 0.5, window.Math.sqrt(2) / 2, 0.87, 0.91, 1.0];
	_ramp1 = document.createElement('canvas');
	_ramp1.width = 100;
	_ramp1.height = 1;
	const ctx1 = _ramp1.getContext('2d')!;

	const grd1 = ctx1.createLinearGradient(0, 0, 100, 0);
	grd1.addColorStop(slopeRamp1[0], '#000000'); //black
	grd1.addColorStop(slopeRamp1[1], '#2747E0'); //blue
	grd1.addColorStop(slopeRamp1[2], '#D33B7D'); //pink
	grd1.addColorStop(slopeRamp1[3], '#D33038'); //red
	grd1.addColorStop(slopeRamp1[4], '#FF9742'); //orange
	grd1.addColorStop(slopeRamp1[5], '#ffd700'); //yellow
	grd1.addColorStop(slopeRamp1[6], '#ffffff'); //white
	ctx1.fillStyle = grd1;
	ctx1.fillRect(0, 0, 100, 1);

	const slopeRamp2 = [0.0, 20 / 90, 30 / 90, 50 / 90, 80 / 90];
	_ramp2 = document.createElement('canvas');
	_ramp2.width = 100;
	_ramp2.height = 1;
	const ctx2 = _ramp2.getContext('2d')!;

	const grd2 = ctx2.createLinearGradient(0, 0, 100, 0);
	grd2.addColorStop(slopeRamp2[0], 'rgb(9, 9, 255)');
	grd2.addColorStop(slopeRamp2[1], 'rgb(0, 161, 255)');
	grd2.addColorStop(slopeRamp2[2], 'rgb(20, 187, 18)');
	grd2.addColorStop(slopeRamp2[3], 'rgb(221, 224, 7)');
	grd2.addColorStop(slopeRamp2[4], 'rgb(255, 0, 0)');
	ctx2.fillStyle = grd2;
	ctx2.fillRect(0, 0, 100, 1);
};

export const example = async (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	if (!_viewer.terrainProvider.availability) {
		throw new Error('未获取到地形');
	}
	_loadTestData();
	// todo:坡度分析和坡向分析必须开启光照 不然最大级图像有问题?
	_viewer.scene.globe.enableLighting = true;
	const _defaultSlopeRamp = _viewer.scene.globe.slopeRamp;

	const handler = new ScreenSpaceEventHandler(_viewer.scene.canvas);
	const multiClippingPlane = _viewer.scene.globe.slope!;
	options.draw = multiClippingPlane.draw.bind(multiClippingPlane) as any;
	options.removeAll = multiClippingPlane.removeAll.bind(multiClippingPlane) as any;

	const folder = gui.addFolder('坡度分析');

	folder
		.add(options, 'ramp', {
			默认: 0,
			颜色图层1: 1,
			颜色图层2: 2,
		})
		.name('颜色图层')
		.onChange(v => {
			switch (Number(v)) {
				case 0:
					_viewer.scene.globe.slopeRamp = _defaultSlopeRamp;
					break;
				case 1:
					_viewer.scene.globe.slopeRamp = _ramp1;
					break;
				case 2:
					_viewer.scene.globe.slopeRamp = _ramp2;
					break;
			}
		});
	folder.add(options, 'draw').name('绘制分析区域');
	folder
		.add(options, 'removeAll')
		.name('删除所有分析区域')
		.onChange(async _ => {
			batch_index = undefined;
			options.batch = false;
		});
	folder
		.add(options, 'batch')
		.name('顶点导入分析区域')
		.listen()
		.onChange(async v => {
			if (batch_index !== undefined) {
				if (await multiClippingPlane.remove(batch_index)) {
					batch_index = undefined;
				} else {
					options.batch = !v;
					return;
				}
			}
			if (v) {
				const pid = await multiClippingPlane.draw(positions);
				if (pid === undefined) {
					options.batch = !v;
					return;
				}
				batch_index = pid;
			}
		});
	folder
		.add(options, 'pick')
		.name('坡度拾取')
		.onChange(pick => {
			if (pick) {
				handler.setInputAction(pickSlope, ScreenSpaceEventType.LEFT_CLICK);
			} else {
				handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
			}
		});
};

const pickSlope = async (event: ScreenSpaceEventHandler.PositionedEvent) => {
	let cartesian = _viewer.camera.pickEllipsoid(event.position, _viewer.scene.globe.ellipsoid);
	if (cartesian) {
		const slope = await _viewer.scene.pickSlope(event.position.x, event.position.y);
		alert(`Slope: ${slope} degrees`);
	}
};
