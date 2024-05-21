import { Cartesian3, Color, DiffuseCylinderWall, Transforms } from '../Lib/Cesium/index.js';
export const example = (viewer, gui) => {
    const wall = new DiffuseCylinderWall({
        color: new Color(0, 0.8, 0.9),
        length: 200,
        radius: 3000,
        modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.59, 38.94, 0)),
        show: false,
    });
    viewer.scene.primitives.add(wall);
    const options = {
        power: wall.show,
    };
    const folder = gui.addFolder('扩散圆柱墙体');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        wall.show = v;
    });
};
//# sourceMappingURL=diffuse-cylinder-wall.js.map