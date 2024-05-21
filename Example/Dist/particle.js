// 粒子效果用show控制显隐会非常耗GPU 不清楚什么原因 只能直接使用primitive控制显隐
import { Cartesian3, CircleEmitter, Color, ConeEmitter, HeadingPitchRoll, Math, Matrix4, ParticleSystem, Quaternion, Transforms, TranslationRotationScale, } from '../Lib/Cesium/index.js';
const options = {
    waterA: false,
    waterB: false,
    waterC: false,
};
const _loadWaterC = () => {
    const waterC = [];
    // 水柱位置
    const posArr = [
        [121.580031, 38.91217, 100],
        [121.580104, 38.91217, 100],
        [121.580163, 38.91217, 100],
        [121.580246, 38.91217, 100],
        [121.580324, 38.91217, 100],
        [121.580404, 38.91217, 100],
        [121.580484, 38.91217, 100],
        [121.580563, 38.91217, 100],
        [121.580646, 38.91217, 100],
        [121.580727, 38.91217, 100],
        [121.580806, 38.91217, 100],
        [121.580886, 38.91217, 100],
        [121.580967, 38.91217, 100],
    ];
    for (let i = 0, len = posArr.length; i < len; i++) {
        const pos = posArr[i];
        const gravityVector3 = new Cartesian3();
        const particleSystem = new ParticleSystem({
            modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(pos[0], pos[1], pos[2])), // 粒子系统位置矩阵
            image: './Assets/File/Texture/smoke.png',
            // particleSize: 56, // 粒子大小（单位：像素）
            emissionRate: 10.0, // 发射速率 （单位：次/秒）
            startScale: 15, // 初始缩放比例
            endScale: 30, // 最终缩放比例
            // emitter: new ConeEmitter(Math.toRadians(25.0)),// 锥形发射器
            emitter: new CircleEmitter(Math.toRadians(10.0)),
            emitterModelMatrix: computeEmitterodelMatrix(0, 0, 60, 0, 0, 0),
            startColor: Color.LIGHTCYAN.withAlpha(0.3), // 开始颜色
            endColor: Color.WHITE.withAlpha(0.0), // 结束颜色
            minimumParticleLife: 1, // 最小寿命时间（秒）
            maximumParticleLife: 10, // 最大寿命时间（秒）
            minimumSpeed: 10.0, // 最小速度(米/秒)
            maximumSpeed: 14.0, // 最大速度(米/秒)
            sizeInMeters: true,
            updateCallback: (p, dt) => {
                const gravity3 = -2.5; // !!!重力方向向上向下 -(9.8*9.8)
                const position = p.position;
                Cartesian3.normalize(position, gravityVector3);
                Cartesian3.multiplyByScalar(gravityVector3, gravity3 * dt, gravityVector3);
                p.velocity = Cartesian3.add(p.velocity, gravityVector3, p.velocity);
            },
        });
        waterC.push(particleSystem);
    }
    return waterC;
};
const _loadWaterB = () => {
    const waterB = new ParticleSystem({
        image: './Assets/File/Texture/smoke.png',
        startColor: Color.CADETBLUE,
        endColor: Color.WHITE.withAlpha(0.0),
        startScale: 10, // 初始缩放比例
        endScale: 30, // 最终缩放比例
        minimumSpeed: 20,
        maximumSpeed: 50,
        sizeInMeters: true, //使用米为单位，位false时以像素位单位
        emissionRate: 1000,
        lifetime: 0.2,
        emitter: new ConeEmitter(Math.toRadians(90.0)), // 锥形发射器
        modelMatrix: Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.58, 38.91, 1000)), // 粒子系统位置矩阵
        // 增加重力场
        updateCallback: (p, dt) => {
            let gravityVector = new Cartesian3();
            let position = p.position;
            Cartesian3.normalize(position, gravityVector);
            Cartesian3.multiplyByScalar(gravityVector, -1 * dt, gravityVector);
            p.velocity = Cartesian3.add(p.velocity, gravityVector, p.velocity);
        },
    });
    return waterB;
};
const _loadWaterA = () => {
    const gravityVector = new Cartesian3();
    const waterA = new ParticleSystem({
        image: './Assets/File/Texture/smoke.png',
        // 从绿色到白色淡出
        startColor: Color.LIGHTSEAGREEN.withAlpha(0.8),
        endColor: Color.WHITE.withAlpha(0.0),
        // 通过startScale和endScale使粒子随着时间的推移而增大或缩小。
        startScale: 1, // 初始缩放比例
        endScale: 50, // 最终缩放比例
        minimumSpeed: 180,
        maximumSpeed: 200,
        sizeInMeters: true, //使用米为单位，位false时以像素位单位
        emissionRate: 1000, // 发射速率
        // bursts : [// 每秒发射多少粒子，可以改变粒子的浓度
        //  new ParticleBurst({time : 5.0, minimum : 300, maximum : 500}),
        //  new ParticleBurst({time : 10.0, minimum : 50, maximum : 100}),
        //   new ParticleBurst({time : 15.0, minimum : 200, maximum : 300})
        // ],
        lifetime: 0.2, // 粒子寿命 秒
        emitter: new ConeEmitter(Math.toRadians(30.0)), // 锥形发射器
        modelMatrix: computeModelMatrix(Cartesian3.fromDegrees(121.58, 38.91, 1000)), // 粒子系统位置矩阵
        updateCallback: (p, dt) => {
            const gravity = -70; // !!!重力方向向上向下 -(9.8*9.8)
            const position = p.position;
            Cartesian3.normalize(position, gravityVector);
            Cartesian3.multiplyByScalar(gravityVector, gravity * dt, gravityVector);
            p.velocity = Cartesian3.add(p.velocity, gravityVector, p.velocity);
        },
    });
    return waterA;
};
export const example = (viewer, gui) => {
    const folder = gui.addFolder('粒子效果');
    let waterA = _loadWaterA();
    let waterB = _loadWaterB();
    let waterC = _loadWaterC();
    folder
        .add(options, 'waterA')
        .name('水粒子A')
        .onChange(v => {
        if (v) {
            if (waterA.isDestroyed()) {
                waterA = _loadWaterA();
            }
            if (!viewer.scene.primitives.contains(waterA)) {
                viewer.scene.primitives.add(waterA);
            }
        }
        else {
            viewer.scene.primitives.remove(waterA);
        }
    });
    folder
        .add(options, 'waterB')
        .name('水粒子B')
        .onChange(v => {
        if (v) {
            if (waterB.isDestroyed()) {
                waterB = _loadWaterB();
            }
            if (!viewer.scene.primitives.contains(waterB)) {
                viewer.scene.primitives.add(waterB);
            }
        }
        else {
            viewer.scene.primitives.remove(waterB);
        }
    });
    folder
        .add(options, 'waterC')
        .name('水粒子C')
        .onChange(v => {
        if (v && waterC[0].isDestroyed()) {
            waterC = _loadWaterC();
        }
        waterC.forEach(water => {
            if (v) {
                if (!viewer.scene.primitives.contains(water)) {
                    viewer.scene.primitives.add(water);
                }
            }
            else {
                viewer.scene.primitives.remove(water);
            }
        });
    });
};
function computeModelMatrix(position) {
    let modelMatrix = Transforms.eastNorthUpToFixedFrame(position);
    return modelMatrix;
}
// 计算粒子发射器的位置姿态
function computeEmitterodelMatrix(rx, ry, rz, tx, ty, tz) {
    let hpr = HeadingPitchRoll.fromDegrees(rx, ry, rz); //!!!发射粒子的方向
    let trs = new TranslationRotationScale();
    trs.translation = Cartesian3.fromElements(tx, ty, tz);
    trs.rotation = Quaternion.fromHeadingPitchRoll(hpr);
    let Matrix = Matrix4.fromTranslationRotationScale(trs);
    return Matrix;
}
//# sourceMappingURL=particle.js.map