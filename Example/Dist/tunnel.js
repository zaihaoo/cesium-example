import { ScreenSpaceEventHandler, ScreenSpaceEventType, Tunnel, } from '../Lib/Cesium/index.js';
import BigeMapUtils from './Lib/BigeMapUtils/BigeMapUtils.es.js';
import { waterRipplePower } from './post-process';
let _handler;
let _viewer;
let _tunnels;
let _tunnelToCartesian3Positions = {};
let options;
export const example = (viewer, gui) => {
    _tunnels = [];
    _viewer = viewer;
    _handler = new ScreenSpaceEventHandler(_viewer.scene.canvas);
    options = {
        translucency: _viewer.scene.globe.translucency.enabled,
        create: _create,
        clear: _clear,
        height: 2500,
        scale: 20,
    };
    const folder = gui.addFolder('参数化生成隧道模型');
    folder
        .add(options, 'translucency')
        .name('地形透明')
        .onChange(v => {
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = !v;
        //设置地球透明
        viewer.scene.globe.translucency.enabled = v;
        viewer.scene.globe.translucency.frontFaceAlpha = 0.25;
    });
    folder
        .add(options, 'create')
        .name('开始生成隧道模型')
        .onChange(_ => {
        confirm('<点击鼠标>根据<点击位置>生成<隧道参考点>\n最后<双击鼠标>结束生成');
    });
    folder.add(options, 'clear').name('删除所有隧道模型');
    folder
        .add(options, 'height')
        .name('隧道模型应用高度')
        .min(-1000)
        .max(8000)
        .step(0.1)
        .onChange(v => {
        _tunnels.forEach(tunnel => (tunnel.height = v));
    });
    folder
        .add(options, 'scale')
        .name('隧道模型整体缩放系数')
        .min(0.1)
        .max(29)
        .step(0.1)
        .onChange(v => {
        _tunnels.forEach((tunnel, i) => {
            const attributes = Tunnel.createAttributes(_tunnelToCartesian3Positions[i], arr => {
                return new BigeMapUtils.Vector3(...arr);
            }, BigeMapUtils.createTunnelModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, v);
            tunnel.position = attributes.position;
            tunnel.st = attributes.st;
            tunnel.normal = attributes.normal;
            tunnel.destroy();
        });
    });
};
const _create = () => {
    _handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    waterRipplePower.setValue(true);
    let last;
    let cartesian3_positions = [];
    _handler.setInputAction((event) => {
        // 屏幕坐标转为空间坐标
        // let cartesian = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
        const ray = _viewer.camera.getPickRay(event.position);
        const cartesian = _viewer.scene.globe.pick(ray, _viewer.scene);
        if (cartesian) {
            if (cartesian3_positions.length > 0 && cartesian.equals(last)) {
                _handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                waterRipplePower.setValue(false);
                const tunnel = Tunnel.createTunnelModel(cartesian3_positions, arr => {
                    return new BigeMapUtils.Vector3(...arr);
                }, BigeMapUtils.createTunnelModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, options.height, options.scale);
                const length = _tunnels.push(tunnel);
                _tunnelToCartesian3Positions[length - 1] = cartesian3_positions;
                _viewer.scene.primitives.add(tunnel);
            }
            else {
                cartesian3_positions.push(cartesian);
                last = cartesian;
            }
        }
    }, ScreenSpaceEventType.LEFT_CLICK);
};
const _clear = () => {
    _tunnels.forEach(v => {
        _viewer.scene.primitives.remove(v);
    });
    _tunnels = [];
    _tunnelToCartesian3Positions = {};
};
//# sourceMappingURL=tunnel.js.map