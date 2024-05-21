import { Color } from '../Lib/Cesium/index.js';
let _viewer;
const _update = () => {
    _viewer.scene.globe._surface.invalidateAllTiles();
};
export const example = (viewer, gui) => {
    _viewer = viewer;
    const globeTheme = viewer.scene.globe.theme;
    const options = {
        bgColor: globeTheme.bgColor.toCssColorString(),
        update: _update,
    };
    const folder = gui.addFolder('地球风格');
    folder
        .addColor(options, 'bgColor')
        .name('背景色')
        .onChange(v => {
        globeTheme.bgColor = Color.fromCssColorString(v);
    });
    folder
        .add(globeTheme, 'alpha')
        .name('透明度')
        .min(0)
        .max(1)
        .step(0.01)
        .onChange(v => {
        globeTheme.alpha = v;
    });
    folder
        .add(globeTheme, 'invert')
        .name('反转颜色')
        .onChange(v => {
        globeTheme.invert = v;
    });
    folder
        .add(globeTheme, 'scanningLine')
        .name('扫描线')
        .onChange(v => {
        globeTheme.scanningLine = v;
    });
    folder
        .add(globeTheme, 'fogging')
        .name('迷雾')
        .onChange(v => {
        globeTheme.fogging = v;
    });
    folder.add(options, 'update').name('更新地球风格');
};
//# sourceMappingURL=globe-theme.js.map