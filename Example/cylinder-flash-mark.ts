import { Color, CylinderFlashMark, Entity, Viewer } from 'cesium';
import { GUI } from 'dat.gui';
import { WGS84_POSITION } from './Types';
let _position_$1: WGS84_POSITION<true, false>;
let _position_$2: WGS84_POSITION<true, false>;
let _position_$3: WGS84_POSITION<true, false>;
let _color: Color;

const _loadTestData = () => {
	_position_$1 = [121.58, 38.91];
	_position_$2 = [121.58, 38.92];
	_position_$3 = [121.59, 38.92];
	_color = new Color(1, 0.235, 0, 1);
};

const _enable = () => {
	_obj.forEach(v => v.primitive.forEach(v => (v.show = true)));
	_visible = true;
};

const _disable = () => {
	_obj.forEach(v => v.primitive.forEach(v => (v.show = false)));
	_visible = false;
};

let _viewer: Viewer;
let _obj: CylinderFlashMark[] = [];
let _visible: Boolean = false;
export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	_loadTestData();
	_obj.push(
		new CylinderFlashMark(
			{ position: _position_$1, color: _color, radius: 500, height: 4000 },
			true,
			(prev_primitive, primitive, _key, _value) => {
				if (!_visible && primitive) primitive.forEach((v: Entity) => (v.show = false));
				prev_primitive && prev_primitive.forEach((v: Entity) => _viewer.entities.remove(v));
				primitive && primitive.forEach((v: Entity) => _viewer.entities.add(v));
			}
		)
	);

	_obj.push(
		new CylinderFlashMark(
			{
				position: _position_$2,
				color: new Color(1, 0, 0, 0.7),
				radius: 250,
				height: 4000,
				speed: 6,
				forward: false,
			},
			true,
			(prev_primitive, primitive, _key, _value) => {
				if (!_visible && primitive) primitive.forEach((v: Entity) => (v.show = false));
				prev_primitive && prev_primitive.forEach((v: Entity) => _viewer.entities.remove(v));
				primitive && primitive.forEach((v: Entity) => _viewer.entities.add(v));
			}
		)
	);

	_obj.push(
		new CylinderFlashMark(
			{ position: _position_$3, color: new Color(0, 0.84, 0.5, 0.7), radius: 500, height: 3000 },
			true,
			(prev_primitive, primitive, _key, _value) => {
				if (!_visible && primitive) primitive.forEach((v: Entity) => (v.show = false));
				prev_primitive && prev_primitive.forEach((v: Entity) => _viewer.entities.remove(v));
				primitive && primitive.forEach((v: Entity) => _viewer.entities.add(v));
			}
		)
	);
	_obj && !_visible && _obj.forEach(v => v.primitive.forEach(v => (v.show = false)));
	_obj && _obj.forEach(v => v.primitive.forEach(v => _viewer.entities.add(v)));
	const options = {
		power: false,
		color: _color.toCssColorString(),
	};

	const folder = gui.addFolder('发光圆锥体标识');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			v ? _enable() : _disable();
		});
	folder
		.addColor(options, 'color')
		.name('线条颜色')
		.onChange(v => {
			_obj[0].color = Color.fromCssColorString(v);
		});
};
