import { BoundingSphere, Cartesian3, Color, defined, Ellipsoid, EncircleLine, Entity, GeometryInstance, HeadingPitchRange, JulianDate, KmlDataSource, Math, PolylineFocusMaterialProperty, Primitive, ScreenSpaceEventHandler, ScreenSpaceEventType, WallBubblingMaterialAppearance, WallGeometry, WallGraduallyMaterialAppearance, AdministrationTextureMaterialProperty, } from '../Lib/Cesium/index.js';
let ellipsoid;
let color;
let handler;
let viewer;
const entity_polyline_mapping = {};
const entity_label_mapping = {};
const entity_positions = {};
//记录上一个点击的entity
const last_obj = {};
export const example = async (viewer_param) => {
    viewer = viewer_param;
    ellipsoid = viewer.scene.globe.ellipsoid;
    color = new Color(0, 0.8, 0.8);
    handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    const entity = await Promise.all([loadProvincial(), loadCity()]);
    entity.forEach(v => {
        v.primitive.forEach(v => viewer.scene.primitives.add(v));
        v.entity.forEach(v => viewer.entities.add(v));
    });
    await viewer.flyTo(viewer.entities, {
        offset: new HeadingPitchRange(Math.toRadians(0), Math.toRadians(-90), 1000000),
    });
    handler.setInputAction(function (e) {
        const pick = viewer.scene.pick(e.endPosition);
        if (defined(pick) && defined(pick.id) && pick.id.name === 'region' && pick.id.id !== last_obj.move_region_id) {
            last_obj.polyline && viewer.entities.remove(last_obj.polyline);
            if (pick.id.id in entity_polyline_mapping) {
                last_obj.polyline = drawLine(entity_polyline_mapping[pick.id.id]);
                last_obj.move_region_id = pick.id.id;
            }
        }
    }, ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function (e) {
        const pick = viewer.scene.pick(e.position);
        if (defined(pick) && defined(pick.id) && pick.id.name === 'region' && pick.id.id !== last_obj.click_region_id) {
            last_obj.label && viewer.entities.remove(last_obj.label);
            last_obj.focus_wall && viewer.scene.primitives.remove(last_obj.focus_wall);
            if (pick.id.id in entity_positions) {
                const min = [];
                const max = [];
                let length_x = 0;
                entity_positions[pick.id.id].forEach((v, i) => {
                    if (i !== 0) {
                        const last = entity_positions[pick.id.id][i - 1];
                        const current = v;
                        length_x += window.Math.sqrt(window.Math.pow(current.x - last.x, 2) +
                            window.Math.pow(current.y - last.y, 2) +
                            window.Math.pow(current.z - last.z, 2));
                    }
                    min.push(0);
                    max.push(50000);
                });
                const wall = _createFocusWall(entity_positions[pick.id.id], min, max, length_x, 50000);
                last_obj.focus_wall = viewer.scene.primitives.add(wall);
                last_obj.click_region_id = pick.id.id;
            }
            if (pick.id.id in entity_label_mapping) {
                last_obj.label = drawLabel(entity_label_mapping[pick.id.id].positions, entity_label_mapping[pick.id.id].name);
            }
        }
    }, ScreenSpaceEventType.LEFT_CLICK);
};
function xyz2latlng(xyz) {
    let wgs84 = ellipsoid.cartesianToCartographic(xyz);
    let lng = Math.toDegrees(wgs84.longitude);
    let lat = Math.toDegrees(wgs84.latitude);
    return [lng, lat, 0];
}
const loadProvincial = async () => {
    //加载省市
    const re = { primitive: [], entity: [] };
    const dataSource = await KmlDataSource.load('Assets/File/VectorData/sichuan.kml');
    var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.polygon) {
            const max = [];
            const min = [];
            const polygon = entity.polygon.hierarchy.getValue(new JulianDate());
            let length_x = 0;
            polygon.positions.forEach((v, i) => {
                if (i !== 0) {
                    const last = polygon.positions[i - 1];
                    const current = v;
                    length_x += window.Math.sqrt(window.Math.pow(current.x - last.x, 2) +
                        window.Math.pow(current.y - last.y, 2) +
                        window.Math.pow(current.z - last.z, 2));
                }
                min.push(-100000);
                max.push(0);
            });
            const wall = _createWellWall(polygon.positions, min, max, length_x, 100000);
            const region = new Entity({
                polygon: {
                    hierarchy: polygon,
                    material: new AdministrationTextureMaterialProperty({
                        image: 'Assets/File/Texture/sc.png',
                        color: color,
                    }),
                    extrudedHeight: 0,
                },
            });
            const encircle_line = EncircleLine(wall.boundingSphere.center, wall.boundingSphere.radius, new Color(0.0, 0.8, 0.8, 0.5));
            re.primitive.push(wall.wall, encircle_line);
            re.entity.push(region);
        }
    }
    return re;
};
const loadCity = async () => {
    const re = { primitive: [], entity: [] };
    const dataSource = await KmlDataSource.load('Assets/File/VectorData/soncity.kml');
    var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.polygon) {
            const obj = new Entity({
                id: `region${i}`,
                name: 'region',
                polygon: {
                    height: 100,
                    hierarchy: entity.polygon.hierarchy.getValue(new JulianDate()),
                    material: Color.TRANSPARENT.withAlpha(0.01),
                    extrudedHeight: 0,
                },
            });
            re.entity.push(obj);
            let xyzs = entity.polygon.hierarchy.getValue(new JulianDate());
            //添加标注
            // drawLabel(xyzs.positions, entity.name);
            //画线
            const latlngs = xyzs.positions.flatMap((v) => {
                return xyz2latlng(v);
            });
            entity_polyline_mapping[obj.id] = latlngs;
            entity_label_mapping[obj.id] = {
                positions: xyzs.positions,
                name: entity.name,
            };
            entity_positions[obj.id] = xyzs.positions;
            // drawLine(latlngs);
        }
    }
    return re;
};
function drawLine(latlngs) {
    return viewer.entities.add({
        polyline: {
            positions: Cartesian3.fromDegreesArrayHeights(latlngs),
            width: 3.5,
            material: new PolylineFocusMaterialProperty({
                speed: 6,
            }),
        },
    });
}
function drawLabel(polyPositions, name) {
    let polyCenter = BoundingSphere.fromPoints(polyPositions).center;
    polyCenter = Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
    let xyz = new Cartesian3(polyCenter.x, polyCenter.y, polyCenter.z);
    let wgs84 = ellipsoid.cartesianToCartographic(xyz);
    let lng = Math.toDegrees(wgs84.longitude);
    let lat = Math.toDegrees(wgs84.latitude);
    return viewer.entities.add({
        position: Cartesian3.fromDegrees(lng, lat, 40000),
        label: {
            scale: 0.6,
            showBackground: true,
            backgroundColor: Color.TRANSPARENT,
            fillColor: Color.WHITE,
            text: name,
            disableDepthTestDistance: 900000,
        },
    });
}
function _createWellWall(position, min_heights, max_heights, width, height) {
    const geometryInstances = new GeometryInstance({
        geometry: WallGeometry.createGeometry(new WallGeometry({
            positions: position,
            maximumHeights: max_heights,
            minimumHeights: min_heights,
        })),
    });
    const wellWall = new Primitive({
        geometryInstances: geometryInstances,
        appearance: WallBubblingMaterialAppearance({
            color: new Color(0.0, 0.8, 0.8),
            speed: 12,
            ratio: width / height,
        }),
        asynchronous: false,
    });
    return { wall: wellWall, boundingSphere: geometryInstances.geometry.boundingSphere };
}
function _createFocusWall(position, min_heights, max_heights, width, height) {
    const geometryInstances = new GeometryInstance({
        geometry: WallGeometry.createGeometry(new WallGeometry({
            positions: position,
            maximumHeights: max_heights,
            minimumHeights: min_heights,
        })),
    });
    const wellWall = new Primitive({
        geometryInstances: geometryInstances,
        appearance: WallGraduallyMaterialAppearance({
            color: new Color(0.0, 0.8, 0.8, 0.5),
            ratio: width / height,
        }),
        asynchronous: false,
    });
    return wellWall;
}
//# sourceMappingURL=region-display-A.js.map