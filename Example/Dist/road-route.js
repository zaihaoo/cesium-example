import { Cartesian3, ScreenSpaceEventHandler, ScreenSpaceEventType, RouteFactory, Color, RouteType, } from '../Lib/Cesium/index.js';
import BigeMapUtils from './Lib/BigeMapUtils/BigeMapUtils.es.js';
import { waterRipplePower } from './post-process.js';
let _handler;
let _viewer;
let _roads;
let _roadToCartesian3Positions = {};
let options;
const data = [
    {
        x: -2601799.8071758626,
        y: 4238062.43108081,
        z: 3980366.8345536976,
    },
    {
        x: -2601866.0257282173,
        y: 4237980.467643679,
        z: 3980410.523817113,
    },
    {
        x: -2601944.35596636,
        y: 4237921.929612728,
        z: 3980421.570642122,
    },
    {
        x: -2602114.8543343428,
        y: 4237816.298186419,
        z: 3980422.5716288304,
    },
    {
        x: -2602298.1196764284,
        y: 4237701.872399993,
        z: 3980424.571935521,
    },
    {
        x: -2602447.726941817,
        y: 4237596.712112242,
        z: 3980438.6220526625,
    },
    {
        x: -2602515.017645455,
        y: 4237534.971240886,
        z: 3980460.2081102254,
    },
    {
        x: -2602726.127060199,
        y: 4237283.210457916,
        z: 3980589.3175100842,
    },
    {
        x: -2602958.7454017857,
        y: 4237007.276033475,
        z: 3980729.978888142,
    },
    {
        x: -2603190.583429466,
        y: 4236732.174522003,
        z: 3980870.2306044376,
    },
    {
        x: -2603345.5797705734,
        y: 4236567.502147164,
        z: 3980943.6334747477,
    },
    {
        x: -2603441.757712767,
        y: 4236488.425976399,
        z: 3980964.7436549026,
    },
    {
        x: -2603543.2074528495,
        y: 4236426.561378931,
        z: 3980964.233801746,
    },
    {
        x: -2603724.4536682875,
        y: 4236328.026007245,
        z: 3980950.643896718,
    },
    {
        x: -2604006.528797734,
        y: 4236195.068054744,
        z: 3980907.9166704584,
    },
    {
        x: -2604282.0080131306,
        y: 4236057.580956955,
        z: 3980874.2397854156,
    },
    {
        x: -2604508.397118432,
        y: 4235945.030883482,
        z: 3980846.084097325,
    },
    {
        x: -2604829.4562610947,
        y: 4235790.432702071,
        z: 3980800.8203499857,
    },
    {
        x: -2605337.078905122,
        y: 4235543.845765544,
        z: 3980731.4661946264,
    },
    {
        x: -2605508.1571259494,
        y: 4235452.400049493,
        z: 3980716.889740154,
    },
    {
        x: -2605633.8373022294,
        y: 4235374.612159781,
        z: 3980717.3878936,
    },
    {
        x: -2605760.491458943,
        y: 4235270.069446055,
        z: 3980745.523451339,
    },
    {
        x: -2605907.2358358013,
        y: 4235100.853877334,
        z: 3980828.9332253532,
    },
    {
        x: -2605971.3939141594,
        y: 4234977.195166588,
        z: 3980917.885700054,
    },
    {
        x: -2606009.7438544473,
        y: 4234867.022195089,
        z: 3981009.3670925875,
    },
    {
        x: -2606032.5481264545,
        y: 4234694.51337928,
        z: 3981176.8119574985,
    },
    {
        x: -2606026.163463806,
        y: 4234560.944814597,
        z: 3981322.0824892195,
    },
].map(v => Cartesian3.fromElements(v.x, v.y, v.z));
export const example = (viewer, gui) => {
    _roads = [];
    _viewer = viewer;
    _handler = new ScreenSpaceEventHandler(_viewer.scene.canvas);
    options = {
        translucency: _viewer.scene.globe.translucency.enabled,
        create: _create,
        clear: _clear,
        height: 10,
        scale: 20,
        type: RouteType.ARROW,
        segment: 200,
        routeSpeed: 60,
        color: Color.GREENYELLOW.toCssColorString(),
        inversion: false,
        bridge: false,
    };
    const bridge = RouteFactory.createRouteModel(data, arr => {
        return new BigeMapUtils.Vector3(...arr);
    }, BigeMapUtils.createRouteModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, Number(options.type), options.height, 5, options.inversion, Color.fromCssColorString(options.color), options.segment, options.routeSpeed, true);
    bridge.show = options.bridge;
    _viewer.scene.primitives.add(bridge);
    const folder = gui.addFolder('参数化生成道路模型');
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
        .name('开始生成道路模型')
        .onChange(_ => {
        confirm('<点击鼠标>根据<点击位置>生成<道路参考点>\n最后<双击鼠标>结束生成');
    });
    folder.add(options, 'clear').name('删除所有道路模型');
    folder
        .add(options, 'inversion')
        .name('反转行进方向')
        .onChange(v => {
        _roads.forEach(road => (road.inversion = v));
    });
    folder
        .add(options, 'height')
        .name('模型应用高度')
        .min(-1000)
        .max(8000)
        .step(0.1)
        .onChange(v => {
        _roads.forEach(road => (road.height = v));
    });
    folder
        .add(options, 'routeSpeed')
        .name('动画速度')
        .min(10)
        .max(200)
        .step(1)
        .onChange(v => {
        const roadSpeed = Number(v);
        _roads.forEach(road => (road.routeSpeed = roadSpeed));
        bridge.routeSpeed = roadSpeed;
    });
    folder
        .add(options, 'type', {
        arrow: RouteType.ARROW,
        background: RouteType.BACKGROUNDARROW,
        road: RouteType.ROAD,
        go_road: RouteType.GOROAD,
        come_road: RouteType.COMEROAD,
        advance_road: RouteType.ADVANCEROAD,
        go_double_road: RouteType.GODOUBLEROAD,
        come_double_road: RouteType.COMEDOUBLEROAD,
        fade: RouteType.FADE,
    })
        .name('应用类型')
        .onChange(v => {
        const type = Number(v);
        _roads.forEach(road => {
            switch (type) {
                case RouteType.ARROW:
                case RouteType.BACKGROUNDARROW:
                    if (road.type !== RouteType.ARROW && road.type !== RouteType.BACKGROUNDARROW) {
                        road.destroy();
                    }
                    break;
                case RouteType.ROAD:
                case RouteType.GOROAD:
                case RouteType.COMEROAD:
                case RouteType.ADVANCEROAD:
                case RouteType.GODOUBLEROAD:
                case RouteType.COMEDOUBLEROAD:
                    if (road.type !== RouteType.ROAD &&
                        road.type !== RouteType.GOROAD &&
                        road.type !== RouteType.COMEROAD &&
                        road.type !== RouteType.ADVANCEROAD &&
                        road.type !== RouteType.GODOUBLEROAD &&
                        road.type !== RouteType.COMEDOUBLEROAD) {
                        road.destroy();
                    }
                    break;
                case RouteType.FADE:
                    if (road.type !== RouteType.FADE) {
                        road.destroy();
                    }
                    break;
            }
            road.type = type;
        });
        bridge.destroy();
        bridge.type = type;
    });
    folder
        .addColor(options, 'color')
        .name('颜色')
        .onChange(v => {
        _roads.forEach(road => (road.color = Color.fromCssColorString(v)));
        bridge.color = Color.fromCssColorString(v);
    });
    folder
        .add(options, 'segment')
        .name('道路细分线段数量')
        .min(200)
        .max(500)
        .step(10)
        .onChange(v => {
        _roads.forEach((road, i) => {
            const attributes = RouteFactory.createAttributes(_roadToCartesian3Positions[i], arr => {
                return new BigeMapUtils.Vector3(...arr);
            }, BigeMapUtils.createRouteModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, options.scale, v, true);
            road.position = attributes.position;
            road.st = attributes.st;
            road.normal = attributes.normal;
            road.adjust = attributes.adjust;
            road.destroy();
        });
    });
    folder
        .add(options, 'scale')
        .name('道路模型整体缩放系数')
        .min(0.1)
        .max(29)
        .step(0.1)
        .onChange(v => {
        _roads.forEach((road, i) => {
            const attributes = RouteFactory.createAttributes(_roadToCartesian3Positions[i], arr => {
                return new BigeMapUtils.Vector3(...arr);
            }, BigeMapUtils.createRouteModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, v, options.segment, true);
            road.position = attributes.position;
            road.st = attributes.st;
            road.normal = attributes.normal;
            road.adjust = attributes.adjust;
            road.destroy();
        });
    });
    folder
        .add(options, 'bridge')
        .name('加载中星海湾大桥')
        .onChange(v => {
        bridge.show = v;
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
        // const ray = _viewer.camera.getPickRay(event.position)!;
        // const cartesian = _viewer.scene.globe.pick(ray, _viewer.scene);
        let cartesian = _viewer.scene.pickPosition(event.position);
        if (cartesian) {
            if (cartesian3_positions.length > 0 && cartesian.equals(last)) {
                _handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
                waterRipplePower.setValue(false);
                console.log(cartesian3_positions, 33333444444);
                const road = RouteFactory.createRouteModel(cartesian3_positions, arr => {
                    return new BigeMapUtils.Vector3(...arr);
                }, BigeMapUtils.createRouteModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, Number(options.type), options.height, options.scale, options.inversion, Color.fromCssColorString(options.color), options.segment, options.routeSpeed, true);
                const length = _roads.push(road);
                _roadToCartesian3Positions[length - 1] = cartesian3_positions;
                _viewer.scene.primitives.add(road);
            }
            else {
                cartesian3_positions.push(cartesian);
                last = cartesian;
            }
        }
    }, ScreenSpaceEventType.LEFT_CLICK);
};
const _clear = () => {
    _roads.forEach(v => {
        _viewer.scene.primitives.remove(v);
    });
    _roads = [];
    _roadToCartesian3Positions = {};
};
//# sourceMappingURL=road-route.js.map