import {
	Cesium3DTileset,
	Color,
	Viewer,
	Cartesian4,
	TilesBuildingTextureFlood,
	TilesBuildingTextureNight,
	TilesBuildingTextureHighlight,
	CustomShader,
} from 'cesium';
import { GUI } from 'dat.gui';

let _tileset: Cesium3DTileset;
let _color: Color;
let _viewer: Viewer;
let _style: _Style;
let _style_flood: CustomShader;
let _style_night: CustomShader;
let _style_highlight: CustomShader;

const _loadTestData = async () => {
	_tileset = await Cesium3DTileset.fromIonAssetId(1035164, { disableCollision: true });
	_color = new Color(1, 0.33, 0.8, 1);
};

enum _Style {
	None,
	Flood,
	Night,
	Highlight,
}

const _updateTileset = (reload: boolean) => {
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

const _setStyle = (style: _Style) => {
	if (typeof style !== 'number' || !(style in _Style) || _style === style) return;
	_style = style;
	_updateTileset(false);
};
const _setColor = (color: Color) => {
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
const _setShade = (shade: boolean) => {
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

export const example = async (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	await _loadTestData();
	_style_flood = TilesBuildingTextureFlood({
		color: _color,
		shade: true,
		glowRange: 150,
		upAxis: (_tileset as any)._modelUpAxis,
	});
	_style_night = TilesBuildingTextureNight({
		upAxis: (_tileset as any)._modelUpAxis,
	});
	_style_highlight = TilesBuildingTextureHighlight({
		color: _color,
		shade: true,
		glowRange: 150,
		upAxis: (_tileset as any)._modelUpAxis,
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
