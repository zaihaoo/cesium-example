import { CallbackProperty, ImageMaterialProperty, Rectangle } from '../Lib/Cesium/index.js';
export const example = (viewer, gui) => {
    const options = {
        power: false,
    };
    const maxlon = 121.59;
    const minlon = 121.58;
    const maxlat = 38.919;
    const minlat = 38.91;
    const halfdistancelon = (maxlon - minlon) / 2;
    const halfdistancelat = (maxlat - minlat) / 2;
    const centerlon = minlon + halfdistancelon;
    const centerlat = minlat + halfdistancelat;
    const entity = viewer.entities.add({
        show: options.power,
        rectangle: {
            coordinates: new CallbackProperty((t) => {
                const f = t.secondsOfDay - window.Math.floor(t.secondsOfDay);
                return Rectangle.fromDegrees(centerlon - halfdistancelon * f, centerlat - halfdistancelat * f, centerlon + halfdistancelon * f, centerlat + halfdistancelat * f);
            }, false),
            material: new ImageMaterialProperty({
                image: 'Assets/File/Texture/hexagon.png',
            }),
        },
    });
    const folder = gui.addFolder('扩散正六边形');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        entity.show = v;
    });
};
//# sourceMappingURL=hexagon-diffusion.js.map