import { Color, ElectricArc } from '../Lib/Cesium/index.js';
let _position_$1;
let _position_$2;
let _color;
const _loadTestData = () => {
    _position_$1 = [121.5856611728515, 38.9129980676015];
    _position_$2 = [121.4856611728515, 38.8129980676015];
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
    _obj = new ElectricArc({
        position: _position_$1,
        arc_mode: ElectricArc.Bothway,
        mask: true,
        color: _color,
        radius: 1000,
    }, true, (prev_primitive, primitive, _key, _value) => {
        if (!_visible && primitive)
            primitive.show = false;
        prev_primitive && _viewer.scene.primitives.remove(prev_primitive);
        primitive && _viewer.scene.primitives.add(primitive);
    });
    _obj.primitive && !_visible && (_obj.primitive.show = false);
    _obj.primitive && _viewer.scene.primitives.add(_obj.primitive);
    const options = {
        power: false,
        position: '_position_$1',
        arc_mode: ElectricArc.Bothway,
        mask: true,
        color: _color.toCssColorString(),
        radius: 1000,
    };
    const folder = gui.addFolder('电弧特效');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        v ? _enable() : _disable();
    });
    folder
        .add(options, 'position', { 位置1: '_position_$1', 位置2: '_position_$2' })
        .name('位置')
        .onChange((v) => {
        _obj.position = { _position_$1: _position_$1, _position_$2: _position_$2 }[v];
    });
    folder
        .add(options, 'arc_mode', {
        上下循环: ElectricArc.Bothway,
        从上至下: ElectricArc.Down,
        从下至上: ElectricArc.Up,
    })
        .name('电弧模式')
        .onChange(v => {
        _obj.arc_mode = Number(v);
    });
    folder
        .add(options, 'mask')
        .name('是否有半球遮罩')
        .onChange(v => {
        _obj.mask = v;
    });
    folder
        .addColor(options, 'color')
        .name('颜色')
        .onChange(v => {
        _obj.color = Color.fromCssColorString(v);
    });
    folder
        .add(options, 'radius')
        .name('电弧半径')
        .min(1)
        .max(10000)
        .step(1)
        .onChange(v => {
        _obj.radius = v;
    });
};
//# sourceMappingURL=electric-arc.js.map