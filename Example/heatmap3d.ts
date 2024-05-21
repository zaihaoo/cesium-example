import { Heatmap3D, Viewer } from 'cesium';
import { GUI } from 'dat.gui';
const _loadTestData = () => {
	// const points = [
	// 	{
	// 		x: 121.71164374204412,
	// 		y: 38.92296054909824,
	// 		value: 43,
	// 	},
	// 	{
	// 		x: 121.73417458146548,
	// 		y: 38.983624934854745,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.64937940525454,
	// 		y: 38.953236156489965,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.76645725738969,
	// 		y: 39.03692583726786,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.64776222350375,
	// 		y: 38.940238979517716,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.70492704447375,
	// 		y: 38.99942831175056,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.76253206364834,
	// 		y: 38.96167619696852,
	// 		value: 89,
	// 	},
	// 	{
	// 		x: 121.74571751630788,
	// 		y: 39.034700204748226,
	// 		value: 91,
	// 	},
	// 	{
	// 		x: 121.69236845727035,
	// 		y: 39.03928143256093,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.61201908509926,
	// 		y: 38.966271984681406,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.72177525272103,
	// 		y: 38.97521993445644,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.7461115262586,
	// 		y: 38.9483521432412,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.75448489990406,
	// 		y: 39.00974421478858,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.65426759905974,
	// 		y: 39.03555526993534,
	// 		value: 53,
	// 	},
	// 	{
	// 		x: 121.67510643849772,
	// 		y: 38.98430903724512,
	// 		value: 42,
	// 	},
	// 	{
	// 		x: 121.6062138652776,
	// 		y: 39.02980536292809,
	// 		value: 71,
	// 	},
	// 	{
	// 		x: 121.74786629401787,
	// 		y: 38.9559667714255,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.74280869347125,
	// 		y: 39.01867837950688,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.75132607573087,
	// 		y: 39.04241821225192,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.67719474036468,
	// 		y: 38.922296624599255,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.66810471407574,
	// 		y: 39.05827445237898,
	// 		value: 99,
	// 	},
	// 	{
	// 		x: 121.6893739159631,
	// 		y: 38.99511391089638,
	// 		value: 92,
	// 	},
	// 	{
	// 		x: 121.75827345358636,
	// 		y: 39.03579898013312,
	// 		value: 33,
	// 	},
	// 	{
	// 		x: 121.67700107542996,
	// 		y: 38.912622828143505,
	// 		value: 56,
	// 	},
	// 	{
	// 		x: 121.69720104009825,
	// 		y: 38.93972476288127,
	// 		value: 76,
	// 	},
	// 	{
	// 		x: 121.77682586307212,
	// 		y: 39.014083953379846,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.61151543669047,
	// 		y: 38.99880070067866,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.6579681224155,
	// 		y: 38.99857301609086,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.60743525140275,
	// 		y: 38.9946160210384,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.6826376581201,
	// 		y: 38.91562802550429,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.59759375174025,
	// 		y: 38.990263762529366,
	// 		value: 88,
	// 	},
	// 	{
	// 		x: 121.67683239634349,
	// 		y: 39.024864588409386,
	// 		value: 46,
	// 	},
	// 	{
	// 		x: 121.64605186227917,
	// 		y: 38.91029511691695,
	// 		value: 34,
	// 	},
	// 	{
	// 		x: 121.72836933367739,
	// 		y: 38.99933514636099,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.6536955864037,
	// 		y: 38.995832457032805,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.60726346818849,
	// 		y: 38.92147472691658,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.63729202037673,
	// 		y: 38.96790894528691,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.68568425058734,
	// 		y: 38.96779653933813,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.61797170454798,
	// 		y: 38.99456873232151,
	// 		value: 51,
	// 	},
	// 	{
	// 		x: 121.74450530891164,
	// 		y: 38.96070102857545,
	// 		value: 21,
	// 	},
	// 	{
	// 		x: 121.73987793633819,
	// 		y: 39.00986097187363,
	// 		value: 81,
	// 	},
	// 	{
	// 		x: 121.769368333659,
	// 		y: 39.00319275560825,
	// 		value: 35,
	// 	},
	// 	{
	// 		x: 121.58447012800423,
	// 		y: 38.93035244975316,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.65861089065652,
	// 		y: 38.93806829296142,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.5967287300374,
	// 		y: 38.91812013586115,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.70975474012799,
	// 		y: 39.038063959930795,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.68084696638073,
	// 		y: 38.91555854819411,
	// 		value: 0,
	// 	},
	// 	{
	// 		x: 121.60378691738754,
	// 		y: 38.91110568983332,
	// 		value: 42,
	// 	},
	// 	{
	// 		x: 121.60517300360993,
	// 		y: 38.97579933001415,
	// 		value: 86,
	// 	},
	// 	{
	// 		x: 121.6358300951651,
	// 		y: 38.97123474148827,
	// 		value: 0,
	// 	},
	// ];

	var points: any[] = [];
	var max = 100;

	// 121.58, 38.91
	const lon_heatmap = 121.58;
	const lat_heatmap = 38.91;
	// 热力图经纬度范围
	var latMin = lat_heatmap;
	var latMax = lat_heatmap + 0.55;
	var lonMin = lon_heatmap;
	var lonMax = lon_heatmap + 0.5;

	// 根据热力图图片范围，生成随机热力点和强度值
	// let count = 0;
	// let zero = 0;
	for (var i = 0; i < 100; i++) {
		var lon1 = lonMin + window.Math.random() * (lonMax - lonMin);
		var lat1 = latMin + window.Math.random() * (latMax - latMin);
		var value = window.Math.floor(window.Math.random() * max);
		// if (value !== 0) count++;
		// if (count === 5 || zero !== 0) value = 0;
		// if (value <= 20) value = 0;
		// if (value === 0) count = 0;
		// if (value === 0) zero++;
		// if (zero >= 5) zero = 0;
		var point = {
			x: lon1,
			y: lat1,
			// x: window.Math.floor(((lat1 - latMin) / (latMax - latMin)) * width),
			// y: window.Math.floor(((lon1 - lonMin) / (lonMax - lonMin)) * height),
			value: value,
		};
		points.push(point);
	}
	return points;
};

const _enable = () => {
	_viewer.scene.primitives.add(_obj);
};

const _disable = () => {
	_viewer.scene.primitives.remove(_obj);
};

let _viewer: Viewer;
let _obj: Heatmap3D;
export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	const _datasource = _loadTestData();
	_obj = new Heatmap3D({
		source_points: _datasource,
		fill: true,
		alt: 0,
		radius: 20,
		heatmap_config: {
			gradient: {
				0: '#000000',
				0.1: '#002222',
				0.5: '#000077',
				0.65: '#999999',
				0.7: '#aaaa00',
				0.9: '#deaa22',
				1: '#ffffff',
			},
		},
	});

	const options = {
		power: false,
		section: _obj.section_min_value,
		height: _obj.max_height,
		radius: 20,
	};

	const folder = gui.addFolder('三维热力图');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			v ? _enable() : _disable();
		});
	folder
		.add(options, 'section')
		.name('开启区间最小值')
		.onChange(v => {
			_obj.section_min_value = v;
		});
	folder
		.add(options, 'radius')
		.name('热力图聚合半径')
		.min(5)
		.max(200)
		.step(0.1)
		.onChange(v => {
			_obj.updateRadius(v);
		});
	folder
		.add(options, 'height')
		.name('热力图高度因子')
		.min(500)
		.max(5000)
		.step(1)
		.onChange(v => {
			_obj.max_height = v;
		});
};
