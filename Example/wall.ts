import {
	Cartesian2,
	Cartesian3,
	Color,
	Entity,
	MaterialProperty,
	Viewer,
	WallFocusMaterialProperty,
	WallPaddingMaterialProperty,
	WallTextureMaterialProperty,
	WallArrowMaterialProperty,
} from 'cesium';
import { GUI } from 'dat.gui';

export const example = (viewer: Viewer, gui: GUI) => {
	const _textureMaterial = new WallTextureMaterialProperty({
		color: new Color(0.99, 0.6, 0.12, 0.91),
	});
	const _paddingMaterial = new WallPaddingMaterialProperty({ color: new Color(0.99, 0.6, 0.12, 0.91) });
	const _focusMaterial = new WallFocusMaterialProperty({ color: new Color(0.99, 0.6, 0.12, 0.91) });
	const _arrowSuccessionMaterial = new WallArrowMaterialProperty({
		color: new Color(0.99, 0.6, 0.12, 0.91),
		repeat: 32,
		speed: 2,
		style: 0,
	});
	const _arrowSectionMaterial = new WallArrowMaterialProperty({
		color: new Color(0.99, 0.6, 0.12, 0.91),
		repeat: 8,
		speed: 2,
		style: 1,
	});

	enum style {
		texture,
		padding,
		focus,
		succession,
		section,
	}

	const _material: { [index: number]: MaterialProperty } = {};
	_material[style.texture] = _textureMaterial;
	_material[style.padding] = _paddingMaterial;
	_material[style.focus] = _focusMaterial;
	_material[style.succession] = _arrowSuccessionMaterial;
	_material[style.section] = _arrowSectionMaterial;

	const options = {
		power: false,
		style: style.texture,
		heightRange: false,
		inversion: false,
	};

	const obj = viewer.entities.add(
		new Entity({
			wall: {
				// minimumHeights: [200, 200, 200, 200, 200],
				positions: Cartesian3.fromDegreesArrayHeights([
					121.515, 38.955, 800, 121.515, 38.87, 800, 121.655, 38.87, 800, 121.655, 38.945, 800, 121.615,
					38.935, 800, 121.615, 38.955, 800, 121.515, 38.955, 800,
				]),

				material: _material[options.style],
			},
			show: options.power,
		})
	);

	const folder = gui.addFolder('墙体风格');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			obj.show = v;
		});
	folder
		.add(options, 'style', {
			texture: style.texture,
			padding: style.padding,
			focus: style.focus,
			succession: style.succession,
			section: style.section,
		})
		.name('风格')
		.onChange(v => {
			obj.wall!.material = _material[v];
		});
	folder
		.add(options, 'heightRange')
		.name('texture墙体开启高程映射')
		.onChange(v => {
			if (v) {
				if (options.inversion) {
					_textureMaterial.heightRange = new Cartesian2(1200, 200);
				} else {
					_textureMaterial.heightRange = new Cartesian2(200, 1200);
				}
			} else {
				_textureMaterial.heightRange = new Cartesian2(-1, -1);
			}
		});
	folder
		.add(options, 'inversion')
		.name('texture墙体高程映射反转')
		.onChange(v => {
			if (options.heightRange) {
				_textureMaterial.heightRange = v ? new Cartesian2(1200, 200) : new Cartesian2(200, 1200);
			}
		});
};
