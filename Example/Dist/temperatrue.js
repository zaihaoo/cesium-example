import { Temperatrue } from '../Lib/Cesium/index.js';
let _dataset_$1;
let _dataset_$2;
const _loadTestData = () => {
    const _center_$1 = [121.58, 38.91];
    //生成测试数据 [{lat:30,lng:104,value:500},{lat:30,lng:104,value:500}]
    _dataset_$1 = [];
    for (let i = 0; i < 100; i++) {
        _dataset_$1.push({
            lng: _center_$1[0] + window.Math.random() * 0.1 - 0.05,
            lat: _center_$1[1] + window.Math.random() * 0.1 - 0.05,
            value: window.Math.random() * 100,
        });
    }
    const _center_$2 = [121.48, 38.81];
    //生成测试数据 [{lat:30,lng:104,value:500},{lat:30,lng:104,value:500}]
    _dataset_$2 = [];
    for (let i = 0; i < 100; i++) {
        _dataset_$2.push({
            lng: _center_$2[0] + window.Math.random() * 0.1 - 0.05,
            lat: _center_$2[1] + window.Math.random() * 0.1 - 0.05,
            value: window.Math.random() * 100,
        });
    }
};
const _enable = () => {
    _datasources && _datasources.forEach(v => (v.show = true));
    _visible = true;
};
const _disable = () => {
    _datasources && _datasources.forEach(v => (v.show = false));
    _visible = false;
};
let _viewer;
let _obj;
let _visible = false;
let _datasources;
export const example = async (viewer, gui) => {
    _viewer = viewer;
    _loadTestData();
    _obj = new Temperatrue({
        dataset: _dataset_$1,
        format: { lon_flag: 'lng', lat_flag: 'lat', value_flag: 'value' },
    }, (prev_primitive, primitive, _key, _value) => {
        prev_primitive &&
            prev_primitive.forEach((v) => {
                _viewer.dataSources.remove(v);
            });
        primitive &&
            primitive.forEach((v) => {
                !_visible && (v.show = false);
                _viewer.dataSources.add(v);
            });
        _datasources = primitive;
    });
    _datasources = await _obj.update();
    _datasources &&
        _datasources.forEach(v => {
            !_visible && (v.show = false);
            viewer.dataSources.add(v);
        });
    const options = {
        power: false,
        dataset: '_dataset_$1',
    };
    const folder = gui.addFolder('等值面');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        v ? _enable() : _disable();
    });
    folder
        .add(options, 'dataset', { 数据源1: '_dataset_$1', 数据源2: '_dataset_$2' })
        .name('数据源')
        .onChange((v) => {
        _obj.dataset = { _dataset_$1: _dataset_$1, _dataset_$2: _dataset_$2 }[v];
    });
};
//# sourceMappingURL=temperatrue.js.map