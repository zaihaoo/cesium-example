import { Color, GeoJsonDataSource, RoadWay, Viewer } from 'cesium';
import { GUI } from 'dat.gui';

let _data_source: GeoJsonDataSource;
let _style_$1: number;
let _color: Color;
const _loadTestData = async () => {
	_data_source = await GeoJsonDataSource.load('Assets/File/Model/way.geojson');
	_style_$1 = RoadWay.ThroughStyle;
	_color = new Color(0, 1, 0, 1);
};

let _viewer: Viewer;
let _obj: RoadWay;
let _visible: Boolean = false;
const _enable = () => {
	_obj.primitive.show = true;
	_visible = true;
};

const _disable = () => {
	_obj.primitive.show = false;
	_visible = false;
};

export const example = async (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	await _loadTestData();
	_obj = new RoadWay(
		{ data_source: _data_source, style: _style_$1, width: 3, speed: 12, color: _color },
		true,
		(prev_primitive, primitive, _key, _value) => {
			if (!_visible && primitive) primitive.show = false;
			prev_primitive && _viewer.scene.primitives.remove(prev_primitive);
			primitive && _viewer.scene.primitives.add(primitive);
		}
	);
	const options = {
		power: false,
		style: RoadWay.ThroughStyle,
		color: _color.toCssColorString(),
	};
	_obj.primitive && !_visible && (_obj.primitive.show = false);
	_obj.primitive && _viewer.scene.primitives.add(_obj.primitive);

	const folder = gui.addFolder('路网渲染');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			v ? _enable() : _disable();
		});
	folder
		.add(options, 'style', {
			穿梭: RoadWay.ThroughStyle,
			闪烁: RoadWay.TwinkleStyle,
		})
		.name('路网风格')
		.onChange(v => {
			_obj.style = Number(v);
		});
	folder
		.addColor(options, 'color')
		.name('闪烁路网的颜色')
		.onChange(v => {
			_obj.color = Color.fromCssColorString(v);
		});
};
