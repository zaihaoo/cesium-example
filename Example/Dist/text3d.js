import { Cartesian3, Color, Math, Matrix3, Matrix4, Text3D, Transforms } from '../Lib/Cesium/index.js';
import BigeMapUtils from './Lib/BigeMapUtils/BigeMapUtils.es.js';
let _viewer;
let _modelMatrix1;
let _modelMatrix2;
let text3d_1;
let text3d_2;
const _loadTestData = () => {
    _modelMatrix1 = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.58, 38.91, 20000));
    _modelMatrix2 = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.6, 38.9, 1000));
};
const createText3D = async () => {
    const typeface = await BigeMapUtils.fontLoader('Assets/File/Typeface/KaiTi_Regular.json');
    var rotationX = Matrix4.fromRotationTranslation(Matrix3.fromRotationX(Math.toRadians(90)));
    Matrix4.multiply(_modelMatrix2, rotationX, _modelMatrix2);
    Matrix4.multiply(_modelMatrix1, rotationX, _modelMatrix1);
    Matrix4.multiplyByScale(_modelMatrix1, new Cartesian3(10, 10, 10), _modelMatrix1);
    Matrix4.multiplyByScale(_modelMatrix2, new Cartesian3(10, 10, 10), _modelMatrix2);
    const fontGeo = BigeMapUtils.createText3DGeometryAttribute('大连市', typeface);
    const fontGeo2 = BigeMapUtils.createText3DGeometryAttribute('BOOM', typeface);
    text3d_1 = _viewer.scene.primitives.add(new Text3D({
        position_buffer: fontGeo.position,
        st_buffer: fontGeo.st,
        modelMatrix: _modelMatrix2,
        show: true,
    }));
    text3d_2 = _viewer.scene.primitives.add(new Text3D({
        position_buffer: fontGeo2.position,
        st_buffer: fontGeo2.st,
        modelMatrix: _modelMatrix1,
        show: true,
    }));
    _viewer.scene.bloom.add(text3d_1);
    _viewer.scene.bloom.add(text3d_2);
};
export const example = async (viewer, gui) => {
    _viewer = viewer;
    _loadTestData();
    await createText3D();
    var ro = Matrix4.fromRotationTranslation(Matrix3.fromRotationY(Math.toRadians(0.15)));
    viewer.scene.preUpdate.addEventListener(function (_scene, time) {
        Matrix4.multiply(_modelMatrix1, ro, _modelMatrix1);
        Matrix4.multiplyByTranslation(_modelMatrix2, new Cartesian3(0, window.Math.sin(time.secondsOfDay) * 1.5, 0), _modelMatrix2);
    });
    const options = {
        power: true,
        color: text3d_1.color.toCssColorString(),
    };
    const folder = gui.addFolder('三维文本');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        text3d_1.show = text3d_2.show = v;
    });
    folder
        .addColor(options, 'color')
        .name('文本颜色')
        .onChange(v => {
        text3d_1.color = Color.fromCssColorString(v);
    });
};
//# sourceMappingURL=text3d.js.map