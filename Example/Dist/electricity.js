import { Cartographic, Electricity, Primitive } from '../Lib/Cesium/index.js';
export const example = (viewer, gui) => {
    const options = {
        power: false,
    };
    const lineA = [
        Cartographic.fromDegrees(121.55354747416757, 38.88947859645876, 2000),
        Cartographic.fromDegrees(121.56250656441816, 38.903121893728176, 2000),
    ];
    const lineB = [
        Cartographic.fromDegrees(121.56250656441816, 38.903121893728176, 2000),
        Cartographic.fromDegrees(121.57203086694231, 38.890194249338464, 2000),
        Cartographic.fromDegrees(121.57915552272206, 38.90180840642945, 2000),
        Cartographic.fromDegrees(121.58646952695183, 38.890972905739034, 2000),
    ];
    const geometryA = Electricity.createGeometry(lineA);
    const geometryB = Electricity.createGeometry(lineB);
    const materialA = Electricity.initWriggleMaterial();
    const materialB = Electricity.initWaveMaterial();
    const primitiveA = viewer.scene.primitives.add(new Primitive({
        geometryInstances: geometryA,
        appearance: materialA,
        show: options.power,
    }));
    const primitiveB = viewer.scene.primitives.add(new Primitive({
        geometryInstances: geometryB,
        appearance: materialB,
        show: options.power,
    }));
    const folder = gui.addFolder('电流效果');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        primitiveA.show = v;
        primitiveB.show = v;
    });
};
//# sourceMappingURL=electricity.js.map