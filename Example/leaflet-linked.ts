import {
	CameraEventType,
	Cartesian3,
	Cartographic,
	EventHelper,
	Math,
	Ray,
	Rectangle,
	ScreenSpaceEventHandler,
	ScreenSpaceEventType,
	Viewer,
	defined,
} from 'cesium';
import { GUI } from 'dat.gui';
import { LatLng, Map, TileLayer } from 'leaflet';

let _viewer: Viewer;
let _map2D: Map;
let active2D = false;
let active3D = false;
let wheel = 0;
let wheelChange = false;

const _leaflet2Cesium = () => {
	const b = _map2D.getBounds();
	const north = b.getNorth();
	const east = b.getEast();
	const south = b.getSouth();
	const west = b.getWest();

	_viewer.camera.setView({
		destination: Rectangle.fromDegrees(west, south, east, north),
	});
};

export const example = (viewer: Viewer, map2D: Map, gui: GUI) => {
	gui.addFolder('二三维联动');
	_viewer = viewer;
	_map2D = map2D;

	// 初始化视角
	const helper = new EventHelper();
	helper.add(viewer.scene.globe.tileLoadProgressEvent, function (e) {
		if (e == 0) {
			_leaflet2Cesium();
			helper.removeAll();
		}
	});

	// onload
	viewer.scene.screenSpaceCameraController.rotateEventTypes = [CameraEventType.LEFT_DRAG];
	viewer.scene.screenSpaceCameraController.tiltEventTypes = [CameraEventType.RIGHT_DRAG];
	viewer.scene.screenSpaceCameraController.zoomEventTypes = [CameraEventType.WHEEL];

	viewer.camera.percentageChanged = 0.1;
	//监听摄像机位置变化，改变2D地图视角
	viewer.camera.changed.addEventListener(function () {
		if (!active3D) return;
		const ray = new Ray(viewer.camera.position, viewer.camera.direction);
		const target = viewer.scene.globe.pick(ray, viewer.scene) as Cartesian3;
		if (!defined(target)) return;
		const p = Cartographic.fromCartesian(target);
		// 级别
		let level = (viewer.scene.globe as any)._surface._debug.maxDepthVisited;
		let tileRender = (viewer.scene.globe as any)._surface._tilesToRender;

		if (tileRender && tileRender.length > 0) {
			if (wheelChange) {
				wheel ? (level! += 1) : (level! -= 1);
				wheelChange = false;
			} else {
				level = tileRender[0]._level;
			}
		}

		map2D.setView(new L.LatLng(Math.toDegrees(p.latitude), Math.toDegrees(p.longitude)), level!);
	});

	const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
	handler.setInputAction(function () {
		active3D = true;
		active2D = false;
	}, ScreenSpaceEventType.LEFT_DOWN);

	handler.setInputAction(function () {
		active3D = true;
		active2D = false;
	}, ScreenSpaceEventType.RIGHT_DOWN);

	handler.setInputAction(function () {
		active3D = false;
	}, ScreenSpaceEventType.LEFT_UP);

	handler.setInputAction(function () {
		active3D = false;
	}, ScreenSpaceEventType.RIGHT_UP);

	handler.setInputAction(function (v: number) {
		active3D = true;
		wheelChange = true;
		wheel = v > 0 ? 1 : 0;
	}, ScreenSpaceEventType.WHEEL);

	map2D.setView(new LatLng(51.3, 0.7), 3);
	// const layer = new TileLayer('https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&gl=cn&x={x}&y={y}&z={z}');
	const layer = new TileLayer(
		'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
		{
			maxZoom: 19,
			attribution: '© OpenStreetMap contributors',
		}
	);
	map2D.addLayer(layer);
	map2D.on('mouseover', () => {
		active2D = true;
		active3D = false;
	});
	map2D.on('mouseout', () => {
		active2D = false;
	});
	map2D.on('drag', () => {
		if (!active2D) return;
		_leaflet2Cesium();
	});
	const onMouseWheel = (event: any) => {
		wheel = event.deltaY > 0 ? 1 : 0;
	};
	map2D.getContainer().addEventListener('wheel', onMouseWheel, false);
	map2D.on('zoom', () => {
		if (!active2D) return;
		_leaflet2Cesium();
	});
};
