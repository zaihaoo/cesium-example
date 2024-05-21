import { Cartesian3, Cartographic, Cesium3DTileset, Color, HeadingPitchRange, Matrix4 } from '../Lib/Cesium/index.js';
import CameraRoutePlanning from './Lib/CameraRoutePlanning.js';
let _controls;
let _viewer;
const _loadTestData = () => {
    _controls = [
        Cartesian3.fromRadians(1.992686, 0.38902, 157.6082),
        Cartesian3.fromRadians(1.9927, 0.38902, 90.6082),
        Cartesian3.fromRadians(1.992714, 0.388963, 39.697),
        Cartesian3.fromRadians(1.99276, 0.388945, 127.35321),
        Cartesian3.fromRadians(1.9927725, 0.3888721, 114.6305),
        Cartesian3.fromRadians(1.99276, 0.3888615, 138.2054),
        Cartesian3.fromRadians(1.992742, 0.3888409, 136.0158),
        Cartesian3.fromRadians(1.9927346, 0.3888766, 57.6234),
        Cartesian3.fromRadians(1.992741, 0.388988, 180.8591),
        Cartesian3.fromRadians(1.992661, 0.3890135, 367.9983),
        Cartesian3.fromRadians(1.99258, 0.3889842, 183.8942),
        Cartesian3.fromRadians(1.99262, 0.388886, 90.9982),
        Cartesian3.fromRadians(1.99262, 0.388841, 80.0013),
        Cartesian3.fromRadians(1.9927, 0.388831, 72.67366),
        Cartesian3.fromRadians(1.992699, 0.388821, 71.92326),
        Cartesian3.fromRadians(1.992696, 0.388899, 67.96343),
        Cartesian3.fromRadians(1.992686, 0.38902, 157.6082),
    ];
    const tileset = Promise.all([
        set3Dtitle3('Assets/File/Build/25_27/tileset.json'),
        set3Dtitle3('Assets/File/Build/25_28/tileset.json'),
        set3Dtitle3('Assets/File/Build/26_27/tileset.json'),
        set3Dtitle3('Assets/File/Build/27_27/tileset.json'),
        set3Dtitle3('Assets/File/Build/26_28/tileset.json'),
        set3Dtitle3('Assets/File/Build/27_28/tileset.json'),
    ]);
    tileset.then(v => {
        const tile = v.pop();
        _viewer.zoomTo(tile, new HeadingPitchRange(0.5, -0.2, tile.boundingSphere.radius * 1.0));
    });
    async function set3Dtitle3(url) {
        // let m = Matrix4.fromTranslation(Cartesian3.fromArray([0, 0, 0]));
        // let tilesetJson = {
        // 	modelMatrix: m,
        // };
        // let tileset1 = await Cesium3DTileset.fromUrl(url, tilesetJson);
        let tileset1 = await Cesium3DTileset.fromUrl(url);
        _viewer.scene.primitives.add(tileset1);
        const heightOffset = 0.0; //可以改变3Dtiles的高度
        const boundingSphere = tileset1.boundingSphere;
        const cartographic = Cartographic.fromCartesian(boundingSphere.center);
        const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        const offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
        const translation = Cartesian3.subtract(offset, surface, new Cartesian3());
        tileset1.modelMatrix = Matrix4.fromTranslation(translation);
        // tileset1.allTilesLoaded.addEventListener(function () {
        // 	console.log('模型已经全部加载完成');
        // });
        return tileset1;
    }
};
export const example = (viewer, gui) => {
    _viewer = viewer;
    _loadTestData();
    const routeCamera = new CameraRoutePlanning({
        clock: viewer.clock,
        camera: viewer.camera,
        loop: true,
        control: true,
    });
    const path = routeCamera.setPath(_controls);
    const pathEntity = viewer.entities.add({
        name: 'pathEntity',
        polyline: {
            positions: path,
            width: 3,
            material: Color.RED,
        },
        show: false,
    });
    const options = {
        power: routeCamera._clock.shouldAnimate,
        path: pathEntity.show,
        reset: routeCamera.reset,
        timeSynchronization: routeCamera.timeSynchronization,
        control: routeCamera.control,
    };
    const folder = gui.addFolder('轨道相机');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        v ? routeCamera.start() : routeCamera.stop();
    });
    folder.add(options, 'reset').name('重置');
    folder.add(options, 'timeSynchronization').name('时间同步');
    folder
        .add(options, 'control')
        .name('可控视角')
        .onChange(v => {
        routeCamera.control = v;
    });
    folder
        .add(options, 'path')
        .name('轨道相机路径')
        .onChange(v => {
        pathEntity.show = v;
    });
};
//# sourceMappingURL=orbital-camera.js.map