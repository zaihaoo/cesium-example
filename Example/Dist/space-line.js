import { Color, SpaceLine } from '../Lib/Cesium/index.js';
let _center_$1;
let _center_$2;
let _color;
const _loadTestData = () => {
    _center_$1 = [121.5856611728515, 38.9129980676015];
    _center_$2 = [121.4856611728515, 38.8129980676015];
    _color = new Color(0, 1, 0, 1);
};
const _enable = () => {
    _obj.primitive.show = true;
    _visible = true;
};
const _disable = () => {
    _obj.primitive.show = false;
    _visible = false;
};
let _viewer;
let _obj;
let _visible = false;
export const example = (viewer, gui) => {
    _viewer = viewer;
    _loadTestData();
    _obj = new SpaceLine({ center: _center_$1, color: _color }, true, (prev_primitive, primitive, _key, _value) => {
        if (!_visible && primitive)
            primitive.show = false;
        prev_primitive && _viewer.scene.primitives.remove(prev_primitive);
        primitive && _viewer.scene.primitives.add(primitive);
    });
    _obj.primitive && !_visible && (_obj.primitive.show = false);
    _obj.primitive && _viewer.scene.primitives.add(_obj.primitive);
    const options = {
        power: false,
        center: '_center_$1',
        color: _color.toCssColorString(),
    };
    const folder = gui.addFolder('空间参照线');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        v ? _enable() : _disable();
    });
    folder
        .add(options, 'center', {
        中心点1: '_center_$1',
        中心点2: '_center_$2',
    })
        .name('中心点')
        .onChange((v) => {
        _obj.center = { _center_$1: _center_$1, _center_$2: _center_$2 }[v];
    });
    folder
        .addColor(options, 'color')
        .name('线条颜色')
        .onChange(v => {
        _obj.color = Color.fromCssColorString(v);
    });
};
//# sourceMappingURL=space-line.js.map