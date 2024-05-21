import { Cartesian3, Color, Tetrahedron } from '../Lib/Cesium/index.js';
let _viewer;
let _obj1;
let _obj2;
export const example = (viewer, gui) => {
    _viewer = viewer;
    const options = {
        power: false,
        animation: false,
        fill: true,
        color: new Color(0, 0.8, 0.8, 0.5).toCssColorString(),
        delta: 3,
    };
    const position = Cartesian3.fromDegrees(121.59, 38.93, 2000);
    _obj1 = new Tetrahedron({
        position: position,
        color: Color.fromCssColorString(options.color),
        fill: options.fill,
        scale: new Cartesian3(500, 500, 1000),
        show: options.power,
        head: true,
    });
    _obj2 = new Tetrahedron({
        position: Cartesian3.fromDegrees(121.61, 38.93, 2000),
        color: Color.fromCssColorString(options.color),
        fill: options.fill,
        scale: new Cartesian3(500, 500, 1000),
        show: options.power,
        head: false,
    });
    _viewer.scene.primitives.add(_obj1);
    _viewer.scene.primitives.add(_obj2);
    const folder = gui.addFolder('四棱锥图标');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        _obj1.show = v;
        _obj2.show = v;
    });
    folder
        .add(options, 'animation')
        .name('是否开启动画')
        .onChange(v => {
        v ? (_obj1.startAnimate(), _obj2.startAnimate()) : (_obj1.closeAnimate(), _obj2.closeAnimate());
    });
    folder
        .add(options, 'fill')
        .name('是否填充')
        .onChange(v => {
        _obj1.fill = v;
        _obj2.fill = v;
    });
    folder
        .addColor(options, 'color')
        .name('颜色')
        .onChange(v => {
        _obj1.color = Color.fromCssColorString(v);
        _obj2.color = Color.fromCssColorString(v);
    });
    folder
        .add(options, 'delta')
        .min(0)
        .max(10)
        .step(0.1)
        .name('浮动偏移量')
        .onChange(v => {
        _obj1.distance = v;
        _obj2.distance = v;
    });
};
//# sourceMappingURL=tetrahedron.js.map