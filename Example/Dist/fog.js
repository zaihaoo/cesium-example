import { Color, FogControl } from '../Lib/Cesium/index.js';
export const example = (viewer, gui) => {
    const obj = new FogControl(viewer);
    const options = {
        power: false,
        color: obj.color.toCssColorString(),
    };
    !options.power && obj.disable();
    const folder = gui.addFolder('近地雾化效果');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        v ? obj.enable() : obj.disable();
    });
    folder
        .addColor(options, 'color')
        .name('雾化的颜色')
        .onChange(v => {
        obj.color = Color.fromCssColorString(v);
    });
};
//# sourceMappingURL=fog.js.map