import { SkyBoxControl } from '../Lib/Cesium/index.js';
export let skyBoxPower;
export const example = (viewer, gui) => {
    const obj = new SkyBoxControl(viewer);
    const options = {
        power: false,
    };
    const folder = gui.addFolder('近地天空盒');
    skyBoxPower = folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        v ? obj.enable() : obj.disable();
    });
};
//# sourceMappingURL=sky-box.js.map