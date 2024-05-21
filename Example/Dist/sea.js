import { Cartesian3, Color, GeometryInstance, Model, Primitive, Rectangle, RectangleGeometry, SeaAppearance, Transforms, VertexFormat, } from '../Lib/Cesium/index.js';
export const example = async (viewer, gui) => {
    const position = Cartesian3.fromDegrees(121.58, 38.91, 300);
    const hills = viewer.scene.primitives.add(await Model.fromGltfAsync({
        url: 'Assets/File/Model/hills.glb',
        modelMatrix: Transforms.eastNorthUpToFixedFrame(position),
        maximumScale: 20000,
        scale: 10000,
        show: false,
    }));
    const granularity = window.Math.PI / window.Math.pow(2, 11) / 32;
    const geo = new RectangleGeometry({
        rectangle: Rectangle.fromDegrees(121.3853009743289, 38.74518540312375, 121.76516243313701, 39.06454506669113),
        vertexFormat: VertexFormat.POSITION_AND_ST,
        height: 1000,
        granularity: granularity,
    });
    const instance = new GeometryInstance({
        geometry: geo,
    });
    const appearance = SeaAppearance({ viewer: viewer });
    const sea = new Primitive({
        geometryInstances: instance,
        appearance: appearance,
        show: false,
    });
    viewer.scene.primitives.add(sea);
    const options = {
        power: sea.show,
        deepColor: sea.appearance.material.uniforms.deepColor.toCssColorString(),
        shalowColor: sea.appearance.material.uniforms.shalowColor.toCssColorString(),
    };
    const folder = gui.addFolder('海面材质');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        sea.show = v;
        hills.show = v;
    });
    folder
        .addColor(options, 'deepColor')
        .name('深水颜色')
        .onChange(v => {
        sea.appearance.material.uniforms.deepColor = Color.fromCssColorString(v);
    });
    folder
        .addColor(options, 'shalowColor')
        .name('浅水颜色')
        .onChange(v => {
        sea.appearance.material.uniforms.shalowColor = Color.fromCssColorString(v);
    });
};
//# sourceMappingURL=sea.js.map