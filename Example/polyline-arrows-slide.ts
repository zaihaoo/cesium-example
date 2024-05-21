import { Cartesian3, Color, Entity, PolylineArrowsSlideMaterialProperty, Viewer } from 'cesium';
import { GUI } from 'dat.gui';

let _viewer: Viewer;
const _obj: Entity[] = [];
const _color = new Color(0.8, 0.0, 0.2, 0.8);

const _loadTestData = () => {
	const center = { lon: 121.58, lat: 38.91 };
	const cities = [
		{ lon: 122.028495718, lat: 38.200814617 },
		{ lon: 117.795000473, lat: 40.638540762 },
		{ lon: 118.267729446, lat: 38.698151246 },
		{ lon: 119.126643144, lat: 40.058588576 },
		{ lon: 121.885884938, lat: 38.395401912 },
		{ lon: 119.190419415, lat: 39.043949588 },
		{ lon: 120.903569642, lat: 38.93205405 },
		{ lon: 119.226648859, lat: 38.367904255 },
		{ lon: 121.86171677, lat: 38.468634833 },
		{ lon: 121.317846048, lat: 37.848946148 },
		{ lon: 120.371985426, lat: 39.70498833 },
		{ lon: 116.468884533, lat: 38.289012191 },
		{ lon: 120.414585069, lat: 38.368350431 },
		{ lon: 119.892742589, lat: 38.409306203 },
		{ lon: 120.16085371, lat: 38.667483468 },
		{ lon: 117.670643354, lat: 39.74854078 },
	];
	return { center: center, cities: cities };
};

function parabolaEquation(options: { pt1: any; pt2: any; height: any; num: any }, resultOut: any = undefined) {
	//方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
	var h = options.height && options.height > 5000 ? options.height : 5000;
	var L =
		Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)
			? Math.abs(options.pt1.lon - options.pt2.lon)
			: Math.abs(options.pt1.lat - options.pt2.lat);
	var num = options.num && options.num > 50 ? options.num : 50;
	var result = [];
	var dlt = L / num;
	if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {
		//以lon为基准
		var delLat = (options.pt2.lat - options.pt1.lat) / num;
		if (options.pt1.lon - options.pt2.lon > 0) {
			dlt = -dlt;
		}
		for (var i = 0; i < num; i++) {
			var tempH = h - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) / Math.pow(L, 2);
			var lon = options.pt1.lon + dlt * i;
			var lat = options.pt1.lat + delLat * i;
			result.push([lon, lat, tempH]);
		}
	} else {
		//以lat为基准
		var delLon = (options.pt2.lon - options.pt1.lon) / num;
		if (options.pt1.lat - options.pt2.lat > 0) {
			dlt = -dlt;
		}
		for (var i = 0; i < num; i++) {
			var tempH = h - (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * h) / Math.pow(L, 2);
			var lon = options.pt1.lon + delLon * i;
			var lat = options.pt1.lat + dlt * i;
			result.push([lon, lat, tempH]);
		}
	}
	if (resultOut != undefined) {
		resultOut = result;
	}
	return result;
}

export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	const { center, cities } = _loadTestData();
	const options = {
		power: false,
		color: _color.toCssColorString(),
	};
	const material = new PolylineArrowsSlideMaterialProperty(_color, 2, 3000);
	for (var j = 0; j < cities.length; j++) {
		const points = parabolaEquation({ pt1: center, pt2: cities[j], height: 50000, num: 100 });
		const pointArr = [];
		for (var i = 0; i < points.length; i++) {
			pointArr.push(points[i][0], points[i][1], points[i][2]);
		}
		_obj.push(
			_viewer.entities.add({
				name: 'PolylineArrowsSlideExample' + j,
				polyline: {
					positions: Cartesian3.fromDegreesArrayHeights(pointArr),
					width: 5,
					material: material,
				},
			})
		);
	}
	!options.power && _disable();

	const folder = gui.addFolder('箭头指示线');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			v ? _enable() : _disable();
		});
	folder
		.addColor(options, 'color')
		.name('箭头指示线颜色')
		.onChange(v => {
			_obj.forEach(entity => {
				(entity.polyline?.material as any).color = Color.fromCssColorString(v);
			});
		});
};

const _enable = () => {
	_obj.forEach(v => (v.show = true));
};

const _disable = () => {
	_obj.forEach(v => (v.show = false));
};
