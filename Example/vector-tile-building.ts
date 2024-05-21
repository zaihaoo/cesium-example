import { Color, VectorBuildingBackgroundMode, Viewer } from 'cesium';
import { GUI } from 'dat.gui';

export const example = (viewer: Viewer, gui: GUI) => {
	const primitiveCollection = viewer.scene.vectorTileProvider.polygonPrimitive;
	const options = {
		power: false,
		translucent: viewer.scene.vectorTileProvider.translucent,
		vectorBuildingBackgroundMode: viewer.scene.vectorTileProvider.vectorBuildingBackgroundMode,
		heightRange: viewer.scene.vectorTileProvider.heightRange,
		glowRange: viewer.scene.vectorTileProvider.glowRange,
		backgroundColor: viewer.scene.vectorTileProvider.backgroundColor.toCssColorString(),
		partingLine: viewer.scene.vectorTileProvider.partingLine,
		partingLineColor: viewer.scene.vectorTileProvider.partingLineColor.toCssColorString(),
		partingCursor: viewer.scene.vectorTileProvider.partingCursor,
		partingCursorColor: viewer.scene.vectorTileProvider.partingCursorColor.toCssColorString(),
	};

	primitiveCollection.show = options.power;

	const folder = gui.addFolder('矢量建筑群');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			primitiveCollection.show = v;
		});
	folder
		.add(options, 'translucent')
		.name('透明')
		.onChange(v => {
			viewer.scene.vectorTileProvider.translucent = v;
		});
	folder
		.add(options, 'vectorBuildingBackgroundMode', {
			高亮渐变: VectorBuildingBackgroundMode.HighlightGradient,
			平滑渐变: VectorBuildingBackgroundMode.SmoothGradient,
			贴图: VectorBuildingBackgroundMode.ImageTexture,
		})
		.name('建筑群背景风格')
		.onChange(v => {
			viewer.scene.vectorTileProvider.vectorBuildingBackgroundMode = v;
		});
	folder
		.addColor(options, 'backgroundColor')
		.name('建筑群背景颜色')
		.onChange(v => {
			viewer.scene.vectorTileProvider.backgroundColor = Color.fromCssColorString(v);
		});
	folder
		.add(options, 'partingLine')
		.name('墙体分割线')
		.onChange(v => {
			viewer.scene.vectorTileProvider.partingLine = v;
		});
	folder
		.addColor(options, 'partingLineColor')
		.name('墙体分割线颜色')
		.onChange(v => {
			viewer.scene.vectorTileProvider.partingLineColor = Color.fromCssColorString(v);
		});
	folder
		.add(options, 'partingCursor')
		.name('墙体分割光标')
		.onChange(v => {
			viewer.scene.vectorTileProvider.partingCursor = v;
		});
	folder
		.addColor(options, 'partingCursorColor')
		.name('墙体分割光标颜色')
		.onChange(v => {
			viewer.scene.vectorTileProvider.partingCursorColor = Color.fromCssColorString(v);
		});
	folder
		.add(options, 'heightRange')
		.name('矢量建筑高度范围(只在高亮渐变模式下生效)')
		.min(1)
		.max(500)
		.step(1)
		.onChange(v => {
			viewer.scene.vectorTileProvider.heightRange = v;
		});
	folder
		.add(options, 'glowRange')
		.name('流光范围')
		.min(0)
		.max(500)
		.step(1)
		.onChange(v => {
			viewer.scene.vectorTileProvider.glowRange = v;
		});
};
