import { Cartesian3, Cartographic, Color, ColorBlendMode, ConstantProperty, Electricity, Math, Matrix3, Matrix4, Primitive, Quaternion, Transforms, } from '../Lib/Cesium/index.js';
export const example = (viewer, _) => {
    const material = Electricity.initWriggleMaterial(new Color(0.2, 0.2, 0.5));
    const materialViolet = Electricity.initWaveMaterial(new Color(0.7, 0.48, 0.78));
    const bias = [
        {
            name: 'middle',
            dx: 0.4,
            dz: 0.5,
            x: 0,
            y: 0,
            z: 32.5,
            rx: 1,
            sum: 4,
            low: 10,
            color: Color.RED,
        },
        {
            name: 'left',
            dx: 0.3,
            dz: 0.3,
            x: -12.3,
            y: 0,
            z: 30.8,
            low: 10,
            sum: 4,
            color: Color.BLUE,
        },
        {
            name: 'right',
            dx: 0.3,
            dz: 0.5,
            x: 12.3,
            y: 0,
            z: 31,
            low: 10,
            color: Color.BLUE,
            sum: 4,
        },
        {
            name: 'top',
            x: 0,
            y: 0,
            dx: 11.4,
            low: 0,
            z: 42.3,
            sum: 2,
            color: Color.GRAY,
        },
    ];
    const points = [];
    bias.map(v => {
        const parseData = [];
        if (v.sum === 2) {
            for (let i = 0; i < v.sum; i++) {
                const tmpV = copy(v);
                tmpV.color = Color.clone(v.color);
                tmpV.x = window.Math.pow(-1, i) * v.dx + tmpV.x;
                parseData.push(tmpV);
            }
        }
        else if (v.sum === 4) {
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    const tmpV = copy(v);
                    tmpV.color = Color.clone(v.color);
                    tmpV.x = window.Math.pow(-1, i) * v.dx + tmpV.x;
                    tmpV.z = window.Math.pow(-1, j) * v.dz + tmpV.z;
                    parseData.push(tmpV);
                }
            }
        }
        points.push(...parseData);
    });
    const data = [
        {
            lng: 103.49840214583618,
            lat: 30.613011543291208,
            h: 529.7339725729729,
            points: points,
        },
        {
            lng: 103.4962033333436,
            lat: 30.616468524322016,
            h: 527.8181329376896,
            points: points,
        },
        {
            lng: 103.49416273777332,
            lat: 30.620568749466283,
            h: 561.8972190878422,
            points: points,
        },
        {
            lng: 103.48953364340878,
            lat: 30.624293668151648,
            h: 573.3406834008338,
            points: points,
        },
    ];
    // 先计算每个杆塔的朝向
    for (let i = 0; i < data.length; i++) {
        let matrix = Matrix3.IDENTITY;
        if (i === 0) {
            const cPos = Cartesian3.fromDegrees(data[i].lng, data[i].lat, 0);
            const nPos = Cartesian3.fromDegrees(data[i + 1].lng, data[i + 1].lat, 0);
            const v = Cartesian3.normalize(Cartesian3.subtract(nPos, cPos, new Cartesian3()), new Cartesian3());
            matrix = Transforms.rotationMatrixFromPositionVelocity(cPos, v);
            const rm = Matrix3.fromRotationZ(Math.toRadians(-90));
            Matrix3.multiply(matrix, rm, matrix);
        }
        else if (i === data.length - 1) {
            const cPos = Cartesian3.fromDegrees(data[i].lng, data[i].lat, 0);
            const lPos = Cartesian3.fromDegrees(data[i - 1].lng, data[i - 1].lat, 0);
            const v = Cartesian3.normalize(Cartesian3.subtract(cPos, lPos, new Cartesian3()), new Cartesian3());
            matrix = Transforms.rotationMatrixFromPositionVelocity(cPos, v);
            const rm = Matrix3.fromRotationZ(Math.toRadians(-90));
            Matrix3.multiply(matrix, rm, matrix);
        }
        else {
            const cPos = Cartesian3.fromDegrees(data[i].lng, data[i].lat, 0);
            const lPos = Cartesian3.fromDegrees(data[i - 1].lng, data[i - 1].lat, 0);
            const nPos = Cartesian3.fromDegrees(data[i + 1].lng, data[i + 1].lat, 0);
            const originEast = Cartesian3.normalize(Matrix3.getColumn(Transforms.eastNorthUpToFixedFrame(cPos), 0, new Cartesian3()), new Cartesian3());
            const v = Cartesian3.normalize(Cartesian3.add(Cartesian3.normalize(Cartesian3.subtract(lPos, cPos, new Cartesian3()), new Cartesian3()), Cartesian3.normalize(Cartesian3.subtract(nPos, cPos, new Cartesian3()), new Cartesian3()), new Cartesian3()), new Cartesian3());
            matrix = Transforms.rotationMatrixFromPositionVelocity(cPos, v);
            if (Cartesian3.dot(originEast, v) < 0) {
                const rm = Matrix3.fromRotationZ(Math.toRadians(-180));
                Matrix3.multiply(matrix, rm, matrix);
            }
        }
        // const f = Cartesian3.normalize(Matrix3.getColumn(matrix, 0, new Cartesian3()), new Cartesian3());
        // const r = Cartesian3.normalize(Matrix3.getColumn(matrix, 1, new Cartesian3()), new Cartesian3());
        // const u = Cartesian3.normalize(Matrix3.getColumn(matrix, 2, new Cartesian3()), new Cartesian3());
        // const cPos = Cartesian3.fromDegrees(data[i].lng, data[i].lat, data[i].h);
        // viewer.entities.add({
        // 	polyline: {
        // 		show: true,
        // 		positions: [
        // 			cPos,
        // 			Cartesian3.add(cPos, Cartesian3.multiplyByScalar(f, 100, new Cartesian3()), new Cartesian3()),
        // 		],
        // 		material: Color.RED.withAlpha(0.5),
        // 		width: 5,
        // 	},
        // });
        // viewer.entities.add({
        // 	polyline: {
        // 		show: true,
        // 		positions: [
        // 			cPos,
        // 			Cartesian3.add(cPos, Cartesian3.multiplyByScalar(r, 100, new Cartesian3()), new Cartesian3()),
        // 		],
        // 		material: Color.GREEN.withAlpha(0.5),
        // 		width: 5,
        // 	},
        // });
        // viewer.entities.add({
        // 	polyline: {
        // 		show: true,
        // 		positions: [
        // 			cPos,
        // 			Cartesian3.add(cPos, Cartesian3.multiplyByScalar(u, 100, new Cartesian3()), new Cartesian3()),
        // 		],
        // 		material: Color.BLUE.withAlpha(0.5),
        // 		width: 5,
        // 	},
        // });
        data[i].matrix = matrix;
    }
    const geometrys = [];
    for (let i = 0; i < data.length; i++) {
        if (i < data.length - 1) {
            data[i].points.map(v => {
                const startPoint = transformBias(data[i], v), endPoint = transformBias(data[i + 1], v);
                // viewer.entities.add({
                // 	polyline: {
                // 		show: true,
                // 		positions: [
                // 			Cartesian3.fromDegrees(startPoint.lng, startPoint.lat, startPoint.h),
                // 			Cartesian3.fromDegrees(endPoint.lng, endPoint.lat, endPoint.h),
                // 		],
                // 		material: Color.BLACK.withAlpha(0.5),
                // 		width: 5,
                // 	},
                // });
                if (!v.low) {
                    const geometry = Electricity.createGeometry([startPoint, endPoint]);
                    viewer.scene.primitives.add(new Primitive({
                        geometryInstances: geometry,
                        appearance: material,
                    }));
                }
                else {
                    const path = getPath(startPoint, endPoint, 20, v.low);
                    const p = [];
                    for (let i = 0; i < path.length; i += 3) {
                        p.push(Cartographic.fromRadians(path[i], path[i + 1], path[i + 2]));
                    }
                    const geometry = Electricity.createGeometry(p);
                    geometrys.push(...geometry);
                }
            });
        }
        viewer.entities.add({
            position: Cartesian3.fromDegrees(data[i].lng, data[i].lat, data[i].h),
            orientation: new ConstantProperty(Quaternion.fromRotationMatrix(data[i].matrix)),
            model: {
                color: new Color(220 / 255, 220 / 255, 220 / 255, 1.0),
                colorBlendMode: ColorBlendMode.REPLACE,
                uri: 'Assets/File/Model/bcc.glb',
            },
        });
    }
    if (geometrys.length > 0) {
        viewer.scene.primitives.add(new Primitive({
            geometryInstances: geometrys,
            appearance: materialViolet,
        }));
    }
};
function copy(bias) {
    return JSON.parse(JSON.stringify(bias));
}
function transformBias(point, bias) {
    const center = Cartesian3.fromDegrees(point.lng, point.lat, point.h);
    // 模型坐标系到地固坐标系旋转平移矩阵
    const matrix = Matrix4.fromRotationTranslation(point.matrix, center);
    return Cartographic.fromCartesian(Matrix4.multiplyByPoint(matrix, new Cartesian3(bias.x, bias.y, bias.z), new Cartesian3()));
}
function getPath(start, end, sum, low) {
    const path = [];
    const half = sum / 2;
    const tmpH = {
        s: 0,
        e: 0,
    };
    if (start.height > end.height) {
        tmpH.s = start.height - end.height + low;
        tmpH.e = low;
    }
    else {
        tmpH.e = -start.height + end.height + low;
        tmpH.s = low;
    }
    for (let i = 0; i <= sum; i++) {
        path.push(start.longitude + ((end.longitude - start.longitude) * i) / sum);
        path.push(start.latitude + ((end.latitude - start.latitude) * i) / sum);
        if (i <= half) {
            let x = (90 * i) / half;
            x = (x * Math.PI) / 180;
            path.push(start.height - tmpH.s * window.Math.sin(x));
        }
        else {
            let x = (90 * (i - half)) / half;
            x = (x * Math.PI) / 180;
            path.push(end.height - tmpH.e * window.Math.cos(x));
        }
    }
    return path;
}
//# sourceMappingURL=overhead-line.js.map