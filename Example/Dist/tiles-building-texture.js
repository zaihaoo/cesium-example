import {
	Cesium3DTileset,
	Color,
	Cartesian4,
	TilesBuildingTextureFlood,
	TilesBuildingTextureNight,
	TilesBuildingTextureHighlight,
} from '../Lib/Cesium/index.js';
let _tileset;
let _color;
let _viewer;
let _style;
let _style_flood;
let _style_night;
let _style_highlight;
const _loadTestData = async () => {
	_tileset = await Cesium3DTileset.fromIonAssetId(1035164);
	_color = new Color(1, 0.33, 0.8, 1);
};
var _Style;
(function (_Style) {
	_Style[(_Style['None'] = 0)] = 'None';
	_Style[(_Style['Flood'] = 1)] = 'Flood';
	_Style[(_Style['Night'] = 2)] = 'Night';
	_Style[(_Style['Highlight'] = 3)] = 'Highlight';
})(_Style || (_Style = {}));
const _updateTileset = reload => {
	if (!_tileset || !(_style in _Style)) return;
	switch (_style) {
		case _Style.Flood:
			_tileset.customShader = _style_flood;
			break;
		case _Style.Night:
			_tileset.customShader = _style_night;
			break;
		case _Style.None:
			_tileset.customShader = undefined;
			break;
		case _Style.Highlight:
			_tileset.customShader = _style_highlight;
			break;
	}
	reload && _viewer.scene.primitives.add(_tileset);
};
const _setStyle = style => {
	if (typeof style !== 'number' || !(style in _Style) || _style === style) return;
	_style = style;
	_updateTileset(false);
};
const _setColor = color => {
	if (!color || _color === color) return;
	_color = color;
	_style_flood.setUniform(
		'u_color',
		new Cartesian4(
			...(_color
				? _color.toBytes().map(v => Color.byteToFloat(v))
				: Color.fromRandom()
						.withAlpha(1)
						.toBytes()
						.map(v => Color.byteToFloat(v)))
		)
	);
	_style_highlight.setUniform(
		'u_color',
		new Cartesian4(
			...(_color
				? _color.toBytes().map(v => Color.byteToFloat(v))
				: Color.fromRandom()
						.withAlpha(1)
						.toBytes()
						.map(v => Color.byteToFloat(v)))
		)
	);
};
const _setShade = shade => {
	_style_flood.setUniform('u_shade', shade);
	_style_highlight.setUniform('u_shade', shade);
};
// const _setTileset = (tileset: Cesium3DTileset) => {
// 	if (!tileset || _tileset === tileset) return;
// 	const reload = _tileset && _viewer.scene.primitives.remove(_tileset);
// 	_tileset = tileset;
// 	_updateTileset(reload);
// };
const enable = () => {
	const _destroy_primitives = _viewer.scene.primitives.destroyPrimitives;
	_viewer.scene.primitives.destroyPrimitives = false;
	_viewer.scene.primitives.remove(_tileset);
	_viewer.scene.primitives.destroyPrimitives = _destroy_primitives;
	_viewer.scene.primitives.add(_tileset);
};
const disable = () => {
	const _destroy_primitives = _viewer.scene.primitives.destroyPrimitives;
	_viewer.scene.primitives.destroyPrimitives = false;
	_viewer.scene.primitives.remove(_tileset);
	_viewer.scene.primitives.destroyPrimitives = _destroy_primitives;
};
export const example = async (viewer, gui) => {
	_viewer = viewer;
	await _loadTestData();
	_style_flood = TilesBuildingTextureFlood({
		color: _color,
		shade: true,
		glowRange: 150,
		upAxis: _tileset._modelUpAxis,
	});
	_style_night = TilesBuildingTextureNight({
		upAxis: _tileset._modelUpAxis,
	});
	_style_highlight = TilesBuildingTextureHighlight({
		color: _color,
		shade: true,
		glowRange: 150,
		upAxis: _tileset._modelUpAxis,
	});
	_viewer = _viewer;
	_style = _Style.Flood;
	_updateTileset(false);
	const options = {
		power: false,
		shade_power: true,
		style: _Style.Flood,
		color: _color.toCssColorString(),
		baseHeight: _style_flood.uniforms.u_baseHeight.value,
		heightRange: _style_flood.uniforms.u_heightRange.value,
		glowRange: _style_flood.uniforms.u_glowRange.value,
	};
	const folder = gui.addFolder('3DTiles建筑贴图');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			v ? enable() : disable();
		});
	folder
		.add(options, 'shade_power')
		.name('渐变')
		.onChange(v => {
			_setShade(v);
		});
	folder
		.add(options, 'style', {
			无贴图: _Style.None,
			泛光: _Style.Flood,
			夜景: _Style.Night,
			高光: _Style.Highlight,
		})
		.name('贴图风格')
		.onChange(v => {
			_setStyle(Number(v));
		});
	folder
		.addColor(options, 'color')
		.name('泛光颜色')
		.onChange(v => {
			_setColor(Color.fromCssColorString(v));
		});
	folder
		.add(options, 'baseHeight')
		.name('泛光材质基准高度')
		.min(0)
		.max(20)
		.onChange(v => {
			_style_flood.setUniform('u_baseHeight', v);
			_style_highlight.setUniform('u_baseHeight', v);
		});
	folder
		.add(options, 'heightRange')
		.name('曝光高度')
		.min(20)
		.max(500)
		.onChange(v => {
			_style_flood.setUniform('u_heightRange', v);
			_style_highlight.setUniform('u_heightRange', v);
		});
	folder
		.add(options, 'glowRange')
		.name('流光范围')
		.min(20)
		.max(500)
		.onChange(v => {
			_style_flood.setUniform('u_glowRange', v);
			_style_highlight.setUniform('u_glowRange', v);
		});
};
//# sourceMappingURL=tiles-building-texture.js.map
