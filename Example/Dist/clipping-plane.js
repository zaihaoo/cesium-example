import { Cartesian3, Cartographic, Color, ConstantProperty, EntityCollection, JulianDate, PerInstanceColorAppearance, PolygonGeometry, PolygonHierarchy, sampleTerrainMostDetailed, } from '../Lib/Cesium/index.js';
let sinkDistanceByTerrain = 0;
const positions = [];
let minHeight = Number.POSITIVE_INFINITY;
let maxHeight = Number.NEGATIVE_INFINITY;
let cartographic_positions;
let cartesian3_positions;
let batch_index = undefined;
let _viewer;
let subTriangleCartographicPositions = [];
let subTriangleGeometry;
const entityCollection = new EntityCollection();
let textLabel;
const options = {
    globeShow: true,
    fillShow: false,
    // 填方底部到ellipsoid表面的距离(下挖到距离ellipsoid表面多少米)
    // 为了方便展示直接规定底部在ellipsoid表面之下 因为高程可能为负数
    excavateDistanceByEllipsoidSurface: -50,
    // 填方顶部下沉距离(距离地表高程向下多少米)
    sinkDistanceByTerrain: sinkDistanceByTerrain,
    batch: false,
    draw: undefined,
    removeAll: undefined,
    upthrow: false,
};
const _loadTestData = async () => {
    positions.push(Cartographic.fromDegrees(121.515, 38.955), Cartographic.fromDegrees(121.515, 38.92), Cartographic.fromDegrees(121.53, 38.92), Cartographic.fromDegrees(121.53, 38.945), Cartographic.fromDegrees(121.575, 38.934), Cartographic.fromDegrees(121.575, 38.955));
    // 准备填方数据
    cartographic_positions = positions;
    cartesian3_positions = cartographic_positions.map(v => Cartesian3.fromRadians(v.longitude, v.latitude, v.height));
    const granularity = window.Math.PI / window.Math.pow(2, 11) / 64;
    //polygon subdivision
    subTriangleGeometry = PolygonGeometry.createGeometry(PolygonGeometry.fromPositions({
        positions: cartesian3_positions,
        vertexFormat: PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
        granularity: granularity,
    }));
    for (let i = 0; i < subTriangleGeometry.attributes.position.values.length; i += 3) {
        subTriangleCartographicPositions.push(Cartographic.fromCartesian(new Cartesian3(subTriangleGeometry.attributes.position.values[i], subTriangleGeometry.attributes.position.values[i + 1], subTriangleGeometry.attributes.position.values[i + 2])));
    }
    subTriangleCartographicPositions = await sampleTerrainMostDetailed(_viewer.terrainProvider, subTriangleCartographicPositions);
};
export const example = async (viewer, gui) => {
    _viewer = viewer;
    if (!_viewer.terrainProvider.availability) {
        throw new Error('未获取到地形');
    }
    await _loadTestData();
    _computeCutVolume();
    entityCollection.values.forEach(v => _viewer.entities.add(v));
    // 大致算下和填方对应的挖方深度
    const offset = minHeight + options.sinkDistanceByTerrain - options.excavateDistanceByEllipsoidSurface;
    const multiClippingPlane = viewer.scene.globe.excavate;
    options.draw = multiClippingPlane.draw.bind(multiClippingPlane, offset);
    options.removeAll = multiClippingPlane.removeAll.bind(multiClippingPlane);
    options.globeShow = _viewer.scene.globe.show;
    const folder = gui.addFolder('地形挖方/填方');
    folder
        .add(options, 'globeShow')
        .name('显示地表')
        .onChange(v => {
        _viewer.scene.globe.show = v;
    });
    folder.add(options, 'draw').name('绘制挖方');
    // todo: 地形抬高有问题 还未修复
    // folder
    // 	.add(options, 'upthrow')
    // 	.name('是否抬高挖方的区域')
    // 	.onChange(v => {
    // 		options.draw = multiClippingPlane.draw.bind(multiClippingPlane, v, offset) as any;
    // 		(multiClippingPlane as any)._clippingPlaneCollections.forEach((clippingPlaneCollections: any[]) => {
    // 			clippingPlaneCollections.forEach(
    // 				clippingPlaneCollection => (clippingPlaneCollection.terrainUpthrow = v)
    // 			);
    // 		});
    // 		(multiClippingPlane as any)._upthrowWall.forEach((upthrowWall: { show: any; }) => (upthrowWall.show = v));
    // 	});
    folder
        .add(options, 'removeAll')
        .name('删除所有挖方')
        .onChange(async (_) => {
        batch_index = undefined;
        options.batch = false;
    });
    folder
        .add(options, 'batch')
        .name('顶点导入挖方')
        .listen()
        .onChange(async (v) => {
        if (batch_index !== undefined) {
            if (await multiClippingPlane.remove(batch_index)) {
                batch_index = undefined;
            }
            else {
                options.batch = !v;
                return;
            }
        }
        if (v) {
            const pid = await multiClippingPlane.draw(offset, positions);
            if (pid === undefined) {
                options.batch = !v;
                return;
            }
            batch_index = pid;
        }
    });
    folder
        .add(options, 'fillShow')
        .name('填方展示')
        .onChange(v => {
        entityCollection.values.forEach(entity => (entity.show = v));
    });
    folder
        .add(options, 'excavateDistanceByEllipsoidSurface')
        .name('填方底部到ellipsoid表面的距离(下挖到距离ellipsoid表面多少米)')
        .min(-100)
        .max(100)
        .step(1)
        .onChange(v => {
        let totalCutVolume = 0;
        entityCollection.values.forEach(entity => {
            if (!entity.polygon)
                return;
            entity.polygon.extrudedHeight = new ConstantProperty(v);
            // 更新方量计算
            const polygon = entity.polygon.hierarchy.getValue(new JulianDate());
            const cartographicP1 = Cartographic.fromCartesian(polygon.positions[0]);
            const bottomP1 = Cartesian3.fromRadians(cartographicP1.longitude, cartographicP1.latitude, 0);
            const cartographicP2 = Cartographic.fromCartesian(polygon.positions[1]);
            const bottomP2 = Cartesian3.fromRadians(cartographicP2.longitude, cartographicP2.latitude, 0);
            const cartographicP3 = Cartographic.fromCartesian(polygon.positions[2]);
            const bottomP3 = Cartesian3.fromRadians(cartographicP3.longitude, cartographicP3.latitude, 0);
            const bottomArea = computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);
            totalCutVolume =
                totalCutVolume +
                    (bottomArea *
                        (window.Math.abs(cartographicP1.height - v) +
                            window.Math.abs(cartographicP2.height - v) +
                            window.Math.abs(cartographicP3.height - v))) /
                        3;
        });
        // 更新方量显示
        textLabel.label.text = new ConstantProperty(`方量 ${totalCutVolume} m3`);
    });
    folder
        .add(options, 'sinkDistanceByTerrain')
        .name('填方顶部下沉距离(距离地表高程向下多少米)')
        .min(-1000)
        .max(1000)
        .step(1)
        .onChange(v => {
        let totalCutVolume = 0;
        entityCollection.values.forEach(entity => {
            if (!entity.polygon)
                return;
            const polygon = entity.polygon.hierarchy.getValue(new JulianDate());
            const positions = polygon.positions.map(car3 => {
                const cartographic = Cartographic.fromCartesian(car3);
                cartographic.height -= v - sinkDistanceByTerrain;
                return Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            });
            entity.polygon.hierarchy = new ConstantProperty(new PolygonHierarchy(positions));
            // 更新方量计算
            const cartographicP1 = Cartographic.fromCartesian(positions[0]);
            const bottomP1 = Cartesian3.fromRadians(cartographicP1.longitude, cartographicP1.latitude, 0);
            const cartographicP2 = Cartographic.fromCartesian(positions[1]);
            const bottomP2 = Cartesian3.fromRadians(cartographicP2.longitude, cartographicP2.latitude, 0);
            const cartographicP3 = Cartographic.fromCartesian(positions[2]);
            const bottomP3 = Cartesian3.fromRadians(cartographicP3.longitude, cartographicP3.latitude, 0);
            const bottomArea = computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);
            totalCutVolume =
                totalCutVolume +
                    (bottomArea *
                        (window.Math.abs(cartographicP1.height - options.excavateDistanceByEllipsoidSurface) +
                            window.Math.abs(cartographicP2.height - options.excavateDistanceByEllipsoidSurface) +
                            window.Math.abs(cartographicP3.height - options.excavateDistanceByEllipsoidSurface))) /
                        3;
        });
        // 更新方量显示
        textLabel.label.text = new ConstantProperty(`Cut Volume ${totalCutVolume} m3`);
        sinkDistanceByTerrain = v;
    });
};
/**
 * 计算方量
 */
const _computeCutVolume = async () => {
    let totalCutVolume = 0;
    let i0, i1, i2;
    let p1, p2, p3;
    let bottomP1, bottomP2, bottomP3;
    let bottomArea;
    for (let i = 0; i < subTriangleGeometry.indices.length; i += 3) {
        i0 = subTriangleGeometry.indices[i];
        i1 = subTriangleGeometry.indices[i + 1];
        i2 = subTriangleGeometry.indices[i + 2];
        const height1 = subTriangleCartographicPositions[i0].height - options.sinkDistanceByTerrain;
        p1 = Cartesian3.fromRadians(subTriangleCartographicPositions[i0].longitude, subTriangleCartographicPositions[i0].latitude, height1);
        bottomP1 = Cartesian3.fromRadians(subTriangleCartographicPositions[i0].longitude, subTriangleCartographicPositions[i0].latitude, 0);
        const height2 = subTriangleCartographicPositions[i1].height - options.sinkDistanceByTerrain;
        p2 = Cartesian3.fromRadians(subTriangleCartographicPositions[i1].longitude, subTriangleCartographicPositions[i1].latitude, height2);
        bottomP2 = Cartesian3.fromRadians(subTriangleCartographicPositions[i1].longitude, subTriangleCartographicPositions[i1].latitude, 0);
        const height3 = subTriangleCartographicPositions[i2].height - options.sinkDistanceByTerrain;
        p3 = Cartesian3.fromRadians(subTriangleCartographicPositions[i2].longitude, subTriangleCartographicPositions[i2].latitude, height3);
        bottomP3 = Cartesian3.fromRadians(subTriangleCartographicPositions[i2].longitude, subTriangleCartographicPositions[i2].latitude, 0);
        maxHeight = window.Math.max(maxHeight, subTriangleCartographicPositions[i0].height, subTriangleCartographicPositions[i1].height, subTriangleCartographicPositions[i2].height);
        minHeight = window.Math.min(minHeight, height1, height2, height3);
        bottomArea = computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);
        totalCutVolume =
            totalCutVolume +
                (bottomArea *
                    (window.Math.abs(height1 - options.excavateDistanceByEllipsoidSurface) +
                        window.Math.abs(height2 - options.excavateDistanceByEllipsoidSurface) +
                        window.Math.abs(height3 - options.excavateDistanceByEllipsoidSurface))) /
                    3;
        // draw
        const positionsarr = [];
        positionsarr.push(p1);
        positionsarr.push(p2);
        positionsarr.push(p3);
        const drawingPolygon = {
            polygon: {
                hierarchy: new PolygonHierarchy(positionsarr),
                extrudedHeight: options.excavateDistanceByEllipsoidSurface,
                perPositionHeight: true,
                material: Color.fromRandom().withAlpha(0.5),
                outline: true,
                closeTop: true,
                closeBottom: true,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
            },
            show: options.fillShow,
        };
        entityCollection.add(drawingPolygon);
    }
    const centroid = computeCentroidOfPolygon(cartesian3_positions);
    textLabel = entityCollection.add({
        position: Cartesian3.fromRadians(centroid.longitude, centroid.latitude, maxHeight + 500),
        label: {
            text: `Cut Volume ${totalCutVolume} m3`,
        },
        show: options.fillShow,
    });
    return maxHeight;
};
function computeAreaOfTriangle(pos1, pos2, pos3) {
    let a = Cartesian3.distance(pos1, pos2);
    let b = Cartesian3.distance(pos2, pos3);
    let c = Cartesian3.distance(pos3, pos1);
    let S = (a + b + c) / 2;
    return window.Math.sqrt(S * (S - a) * (S - b) * (S - c));
}
function computeCentroidOfPolygon(positions) {
    let x = [];
    let y = [];
    for (let i = 0; i < positions.length; i++) {
        let cartographic = Cartographic.fromCartesian(positions[i]);
        x.push(cartographic.longitude);
        y.push(cartographic.latitude);
    }
    let x0 = 0.0, y0 = 0.0, x1 = 0.0, y1 = 0.0;
    let signedArea = 0.0;
    let a = 0.0;
    let centroidx = 0.0, centroidy = 0.0;
    for (let i = 0; i < positions.length; i++) {
        x0 = x[i];
        y0 = y[i];
        if (i == positions.length - 1) {
            x1 = x[0];
            y1 = y[0];
        }
        else {
            x1 = x[i + 1];
            y1 = y[i + 1];
        }
        a = x0 * y1 - x1 * y0;
        signedArea += a;
        centroidx += (x0 + x1) * a;
        centroidy += (y0 + y1) * a;
    }
    signedArea *= 0.5;
    centroidx /= 6.0 * signedArea;
    centroidy /= 6.0 * signedArea;
    return new Cartographic(centroidx, centroidy);
}
//# sourceMappingURL=clipping-plane.js.map