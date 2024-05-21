import { Cartesian3, ScreenSpaceEventHandler, ScreenSpaceEventType, RouteFactory, RouteType, } from '../Lib/Cesium/index.js';
import BigeMapUtils from './Lib/BigeMapUtils/BigeMapUtils.es.js';
import { waterRipplePower } from './post-process.js';
let _handler;
let _viewer;
let _roads;
let _roadToCartesian3Positions = {};
let options;
const malanpos = [
    {
        x: -2597598.238102817,
        y: 4235067.838624157,
        z: 3986254.2863655784,
    },
    {
        x: -2597750.718937121,
        y: 4234973.433680994,
        z: 3986255.208074286,
    },
    {
        x: -2597907.564372565,
        y: 4234897.578656097,
        z: 3986233.7261928795,
    },
    {
        x: -2598046.7584009273,
        y: 4234939.498895355,
        z: 3986099.3683653367,
    },
    {
        x: -2598206.6752788476,
        y: 4234917.302930175,
        z: 3986019.2585929525,
    },
    {
        x: -2598510.993713357,
        y: 4234763.140373401,
        z: 3985984.897614629,
    },
    {
        x: -2598613.774958426,
        y: 4234688.586198902,
        z: 3985997.0196540314,
    },
    {
        x: -2598811.8907340025,
        y: 4234507.047822419,
        z: 3986060.2866287176,
    },
    {
        x: -2599180.8969513206,
        y: 4234372.990439348,
        z: 3985962.757130559,
    },
    {
        x: -2599327.2256913856,
        y: 4234373.699580748,
        z: 3985867.2276459406,
    },
    {
        x: -2599503.758230004,
        y: 4234431.595598803,
        z: 3985691.7710261936,
    },
    {
        x: -2599665.011937878,
        y: 4234520.984690952,
        z: 3985492.96405326,
    },
    {
        x: -2599837.648961103,
        y: 4234600.801164605,
        z: 3985296.871647456,
    },
    {
        x: -2600020.011990505,
        y: 4234579.4431810845,
        z: 3985201.2287142323,
    },
    {
        x: -2600410.6650287583,
        y: 4234509.53262643,
        z: 3985021.8303511124,
    },
    {
        x: -2600789.240101661,
        y: 4234470.221910924,
        z: 3984817.919920451,
    },
    {
        x: -2601156.9531832724,
        y: 4234402.045031511,
        z: 3984651.4656735193,
    },
    {
        x: -2601495.830195541,
        y: 4234334.461064227,
        z: 3984503.0531392284,
    },
    {
        x: -2601916.9946454787,
        y: 4234163.448229616,
        z: 3984410.412985052,
    },
    {
        x: -2602157.0535157914,
        y: 4233988.830578659,
        z: 3984439.010150259,
    },
    {
        x: -2602207.922592476,
        y: 4233964.929469766,
        z: 3984431.236886386,
    },
    {
        x: -2602738.349725779,
        y: 4233782.488662023,
        z: 3984279.659695862,
    },
    {
        x: -2602844.4729975024,
        y: 4233760.690152723,
        z: 3984233.8009201577,
    },
    {
        x: -2603520.8391414112,
        y: 4233729.49771019,
        z: 3983827.748621547,
    },
    {
        x: -2603573.3815901107,
        y: 4233731.601791278,
        z: 3983791.4181884932,
    },
    {
        x: -2603894.124223746,
        y: 4233868.11496268,
        z: 3983439.0692525003,
    },
    {
        x: -2603980.6497727456,
        y: 4233931.865204601,
        z: 3983315.5759100076,
    },
    {
        x: -2604454.33364232,
        y: 4234389.187788587,
        z: 3982525.020835776,
    },
    {
        x: -2604522.812372176,
        y: 4234505.454607785,
        z: 3982357.734180068,
    },
    {
        x: -2604548.762921205,
        y: 4234975.999256901,
        z: 3981843.8287224798,
    },
    {
        x: -2604568.266710301,
        y: 4235320.438500452,
        z: 3981467.243856572,
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
        type: RouteType.MOTIONLESS,
        segment: 200,
        river: false,
        roadSpeed: 10,
    };
    const malanriver = RouteFactory.createRouteModel(malanpos, arr => {
        return new BigeMapUtils.Vector3(...arr);
    }, BigeMapUtils.createRouteModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, Number(options.type), options.height, 4, false, undefined, options.segment, options.roadSpeed, true);
    malanriver.show = options.river;
    _viewer.scene.primitives.add(malanriver);
    const folder = gui.addFolder('参数化生成水路模型');
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
        .name('开始生成水路模型')
        .onChange(_ => {
        confirm('<点击鼠标>根据<点击位置>生成<水路参考点>\n最后<双击鼠标>结束生成');
    });
    folder.add(options, 'clear').name('删除所有水路模型');
    folder
        .add(options, 'height')
        .name('模型应用高度')
        .min(-1000)
        .max(8000)
        .step(1)
        .onChange(v => {
        _roads.forEach(road => (road.height = v));
    });
    folder
        .add(options, 'roadSpeed')
        .name('水流速度')
        .min(5)
        .max(200)
        .step(1)
        .onChange(v => {
        const roadSpeed = Number(v);
        _roads.forEach(road => (road.routeSpeed = roadSpeed));
        malanriver.routeSpeed = roadSpeed;
    });
    folder
        .add(options, 'type', { motionless: RouteType.MOTIONLESS, flow: RouteType.FLOW })
        .name('应用类型')
        .onChange(v => {
        const type = Number(v);
        _roads.forEach(road => (road.type = type));
        malanriver.type = type;
    });
    folder
        .add(options, 'segment')
        .name('水路细分线段数量')
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
        .name('水路模型整体缩放系数')
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
        .add(options, 'river')
        .name('加载马栏河水路流域')
        .onChange(v => {
        malanriver.show = v;
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
                const road = RouteFactory.createRouteModel(cartesian3_positions, arr => {
                    return new BigeMapUtils.Vector3(...arr);
                }, BigeMapUtils.createRouteModelGeometryAttribute, BigeMapUtils.catmullRomCurve3, Number(options.type), options.height, options.scale, false, undefined, options.segment, options.roadSpeed, true);
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
//# sourceMappingURL=water-route.js.map