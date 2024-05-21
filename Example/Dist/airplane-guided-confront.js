import { Cartesian2, Cartesian3, Color, HeadingPitchRoll, JulianDate, LagrangePolynomialApproximation, Matrix4, ParticleBurst, ParticleSystem, Quaternion, SampledPositionProperty, SphereEmitter, TimeInterval, TimeIntervalCollection, TranslationRotationScale, VelocityOrientationProperty, } from '../Lib/Cesium/index.js';
let _viewer;
const _animation = () => {
    // 121.58, 38.91, 20000
    const data = [
        { longitude: 119.1, latitude: 41.559967, height: 20000, time: 0 },
        { longitude: 120.58, latitude: 40.55, height: 20000, time: 20 },
        { longitude: 121.58, latitude: 38.91, height: 20000, time: 40 },
    ];
    const guided_data = [
        { longitude: 122.58, latitude: 41.55, height: 0, time: 25 },
        { longitude: 123.5, latitude: 40.55, height: 60000, time: 35 },
        { longitude: 121.58, latitude: 38.91, height: 20000, time: 40 },
    ];
    const viewModel = {
        emissionRate: 600,
        gravity: 36.8 * 36.8, //设置重力参数
        minimumParticleLife: 0.3,
        maximumParticleLife: 0.5,
        minimumSpeed: 1.0, //粒子发射的最小速度
        maximumSpeed: 40.0, //粒子发射的最大速度
        startScale: 2.5,
        endScale: 10.0,
        particleSize: 20.0,
    };
    const guided_viewModel = {
        emissionRate: 600,
        gravity: 36.8 * 36.8, //设置重力参数
        minimumParticleLife: 0,
        maximumParticleLife: 0.3,
        minimumSpeed: 1.0, //粒子发射的最小速度
        maximumSpeed: 5.0, //粒子发射的最大速度
        startScale: 0.0,
        endScale: 30.0,
        particleSize: 20.0,
    };
    let emitterModelMatrix = new Matrix4();
    let translation = new Cartesian3();
    let rotation = new Quaternion();
    let hpr = new HeadingPitchRoll();
    let trs = new TranslationRotationScale();
    let main_blast;
    const entity = _viewer.entities.add({
        //选择粒子放置的坐标
        position: Cartesian3.fromDegrees(121.59, 38.92, 20000),
        show: false,
    });
    const computeModelMatrix = (entity, time) => {
        return entity.computeModelMatrix(time, new Matrix4());
    };
    function computeEmitterModelMatrix() {
        hpr = HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
        trs.translation = Cartesian3.fromElements(-4.0, 0.0, 1.4, translation);
        trs.rotation = Quaternion.fromHeadingPitchRoll(hpr, rotation);
        return Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
    }
    // 起始时间
    let start = JulianDate.fromDate(new Date());
    let guided_start = JulianDate.addSeconds(start, 25, new JulianDate());
    // 结束时间
    let stop = JulianDate.addSeconds(start, 40, new JulianDate());
    let spread_stop = JulianDate.addSeconds(start, 43, new JulianDate());
    let main_stop = JulianDate.addSeconds(start, 45, new JulianDate());
    let total_stop = JulianDate.addSeconds(start, 47, new JulianDate());
    start = JulianDate.addHours(start, 8, new JulianDate());
    guided_start = JulianDate.addHours(guided_start, 8, new JulianDate());
    stop = JulianDate.addHours(stop, 8, new JulianDate());
    spread_stop = JulianDate.addHours(spread_stop, 8, new JulianDate());
    main_stop = JulianDate.addHours(main_stop, 8, new JulianDate());
    total_stop = JulianDate.addHours(total_stop, 8, new JulianDate());
    // 设置始时钟始时间
    _viewer.clock.startTime = start.clone();
    // 设置时钟当前时间
    _viewer.clock.currentTime = start.clone();
    // 设置始终停止时间
    _viewer.clock.stopTime = total_stop.clone();
    // 时间速率，数字越大时间过的越快
    _viewer.clock.multiplier = 1;
    // 时间轴
    _viewer.timeline.zoomTo(start, total_stop);
    // 循环执行,即为2，到达终止时间，重新从起点时间开始
    // _viewer.clock.clockRange = ClockRange.LOOP_STOP;
    var gravityVector = new Cartesian3();
    var gravity = -(36.8 * 36.8);
    function applyGravity(p, dt) {
        // Compute a local up vector for each particle in geocentric space.
        var position = p.position;
        Cartesian3.normalize(position, gravityVector);
        Cartesian3.multiplyByScalar(gravityVector, gravity * dt, gravityVector);
        p.velocity = Cartesian3.add(p.velocity, gravityVector, p.velocity);
    }
    main_blast = new ParticleSystem({
        // Particle appearance
        image: './Assets/File/Texture/fire1.png',
        imageSize: new Cartesian2(200, 200),
        // imageSize: new Cartesian2(25, 25),
        startScale: 1.0,
        endScale: 10.0,
        // minimumSpeed: 50.,
        // maximumSpeed: 80.,
        // Particle behavior
        particleLife: 2.5,
        // speed: 5.0,
        speed: 50,
        // Emitter parameters
        // emitter: new BoxEmitter(new Cartesian3(1000.0, 1000.0, 1000.0)),
        emitter: new SphereEmitter(1000.0),
        // emissionRate: 50.0,
        emissionRate: 15.0,
        modelMatrix: computeModelMatrix(entity, _viewer.clock.startTime),
        lifetime: 16.0,
        sizeInMeters: true,
        // updateCallback: applyGravity,
    });
    function tick(clock) {
        if (clock.currentTime.dayNumber >= stop.dayNumber && clock.currentTime.secondsOfDay > stop.secondsOfDay) {
            if (clock.currentTime.dayNumber >= clock.stopTime.dayNumber &&
                clock.currentTime.secondsOfDay > clock.stopTime.secondsOfDay) {
                _viewer.scene.primitives.remove(main_blast);
                _viewer.clock.onTick.removeEventListener(tick);
            }
            else if (clock.currentTime.dayNumber >= main_stop.dayNumber &&
                clock.currentTime.secondsOfDay > main_stop.secondsOfDay) {
                main_blast.emissionRate = 4.0;
                main_blast.endScale = 5;
                gravity = -(150 * 150);
            }
            else if (clock.currentTime.dayNumber >= spread_stop.dayNumber &&
                clock.currentTime.secondsOfDay > spread_stop.secondsOfDay) {
                main_blast.updateCallback = applyGravity;
                main_blast.particleLife = 1;
                main_blast.speed = 5;
                main_blast.emissionRate = 10;
            }
            else {
                _viewer.scene.primitives.remove(air_flame);
                _viewer.scene.primitives.remove(guided_flame);
                if (!_viewer.scene.primitives.contains(main_blast)) {
                    main_blast.modelMatrix = air.computeModelMatrix(stop, new Matrix4());
                    _viewer.scene.primitives.add(main_blast);
                }
            }
        }
        else if (clock.currentTime.dayNumber >= guided_start.dayNumber &&
            clock.currentTime.secondsOfDay > guided_start.secondsOfDay &&
            !_viewer.scene.primitives.contains(guided_flame)) {
            _viewer.scene.primitives.add(guided_flame);
        }
    }
    _viewer.clock.onTick.addEventListener(tick);
    /**
     * 计算飞行路径
     * @param source 数据坐标
     * @returns {SampledPositionProperty|*}
     */
    function createProperty(source) {
        // 取样位置 相当于一个集合
        let property = new SampledPositionProperty();
        for (let i = 0; i < source.length; i++) {
            let time = JulianDate.addSeconds(start, source[i].time, new JulianDate());
            let position = Cartesian3.fromDegrees(source[i].longitude, source[i].latitude, source[i].height);
            // 添加位置，和时间对应
            property.addSample(time, position);
        }
        return property;
    }
    function loadAirPlane() {
        let property = createProperty(data);
        property.setInterpolationOptions({
            interpolationDegree: 5,
            interpolationAlgorithm: LagrangePolynomialApproximation,
        });
        const availability = new TimeIntervalCollection([
            new TimeInterval({
                start: start,
                stop: stop,
            }),
            // new TimeInterval({
            // 	start: start,
            // 	stop: main_stop,
            // }),
        ]);
        const orientation = new VelocityOrientationProperty(property);
        // 添加entity实体
        let planeModel = _viewer.entities.add({
            // 和时间轴关联
            availability: availability,
            id: 'move',
            position: property,
            // 根据所提供的位置计算模型的朝向
            orientation: orientation,
            // 模型
            model: {
                uri: './Assets/File/Model/J-20.glb',
                scale: 100,
                // minimumPixelSize: 64,
            },
        });
        let path = _viewer.entities.add({
            // 和时间轴关联
            availability: availability,
            id: 'move_path',
            position: property,
            // 根据所提供的位置计算模型的朝向
            orientation: orientation,
            path: {
                resolution: 1,
                material: Color.BLUE,
                // leadTime、trailTime 不设置 path全显示
                // leadTime:0,// 设置为0时 模型通过后显示path
                trailTime: 0, // 设置为0时 模型通过后隐藏path
                width: 2.5,
            },
        });
        _viewer.scene.bloom.add(path);
        return planeModel;
    }
    const air = loadAirPlane();
    const air_matrix = air.computeModelMatrix(_viewer.clock.startTime, new Matrix4());
    const air_position = Matrix4.multiplyByPoint(air_matrix, new Cartesian3(0, 0, 0), new Cartesian3());
    const trans_matrix = Matrix4.fromTranslation(new Cartesian3(-1000, 0, 0));
    const flame_matrix = Matrix4.multiply(air_matrix, trans_matrix, new Matrix4());
    const gravityScratch = new Cartesian3();
    function applyAirGravity(p, dt) {
        // 计算每个粒子的向上向量（相对地心）
        const position = p.position;
        Cartesian3.normalize(Cartesian3.subtract(position, air_position, new Cartesian3()), gravityScratch);
        Cartesian3.multiplyByScalar(gravityScratch, viewModel.gravity * dt, gravityScratch);
        p.velocity = Cartesian3.add(p.velocity, gravityScratch, p.velocity);
        const air_matrix = air.computeModelMatrix(_viewer.clock.currentTime, new Matrix4());
        if (!air_matrix) {
            return;
        }
        else {
            const trans_matrix = Matrix4.fromTranslation(new Cartesian3(-1000, 0, 0));
            const flame_matrix = Matrix4.multiply(air_matrix, trans_matrix, new Matrix4());
            air_flame.modelMatrix = flame_matrix;
        }
    }
    const air_flame = new ParticleSystem({
        //每个粒子的图像
        image: './Assets/File/Texture/smoke.png',
        //设置发射出的图像大小
        imageSize: new Cartesian2(viewModel.particleSize, viewModel.particleSize),
        startColor: Color.LIGHTSEAGREEN.withAlpha(0.7),
        endColor: Color.WHITE.withAlpha(0.0),
        //设置粒子图发射之后的最小/最大速度(以米/秒为单位),值越大，尾巴飘的越高
        minimumSpeed: viewModel.minimumSpeed,
        maximumSpeed: viewModel.maximumSpeed,
        //startScale endScale，代替scale设置粒子在生命周期内显示的初始和结束尺寸，
        //也是动态混合的作用。 值越大，初始时粒子图的大小越大
        startScale: viewModel.startScale,
        endScale: viewModel.endScale,
        //maximumParticleLife：设置粒子寿命的可能持续时间的最大界限（以秒为单位），粒子的实际寿命将随
        //机生成
        //值越大，尾巴越长
        minimumParticleLife: viewModel.minimumParticleLife,
        maximumParticleLife: viewModel.maximumParticleLife,
        //particleLife：设置该值将会覆盖minimumParticleLife和maximumParticleLife
        //minimumParticleLife：设置粒子寿命的可能持续时间的最小界限（以秒为单位），粒子的实际寿命将随
        //机生成
        //每秒发射的粒子数。数值越大，越浓密
        emissionRate: viewModel.emissionRate,
        //粒子系统生命周期内，按照指定周期，爆发一定数量的粒子。三个参数（time，minimum，maximum）
        bursts: [
            // 爆炸出的粒子的密度
            new ParticleBurst({
                time: 1.0,
                minimum: 10,
                maximum: 100,
            }),
            new ParticleBurst({
                time: 2.5,
                minimum: 50,
                maximum: 100,
            }),
            new ParticleBurst({
                time: 4.0,
                minimum: 200,
                maximum: 300,
            }),
        ],
        //粒子系统会发射多久粒子，以秒为单位。默认为最大值
        lifetime: 5.0,
        // 粒子系统的粒子发射器；包括四种发射器：圆形、锥体、球体、长方体
        // emitter: new CircleEmitter(2.0),
        emitter: new SphereEmitter(5.0),
        //modelMatrix： 4x4变换矩阵，将粒子系统从模型转换为世界坐标。
        // modelMatrix: computeModelMatrix(entity, _viewer.clock.startTime),
        modelMatrix: flame_matrix,
        //4x4变换矩阵，用于在粒子系统内部坐标系中转换粒子系统发射器。
        emitterModelMatrix: computeEmitterModelMatrix(),
        //一组强制回调。回调被传递一个粒子和上次的差值
        //每帧都要调用的回调函数来更新粒子。此updateCallback作用是用来改变粒子系统在每一个时间步长的属
        //性，可以强制改变粒子系统的颜色、大小等值。在updateCallback更改gravity重力参数，值越大，烟雾
        //离模型越近的地方飘的越高，可能出现负值，此时烟雾会向下方飘。
        updateCallback: applyAirGravity,
        sizeInMeters: true,
    });
    _viewer.scene.primitives.add(air_flame);
    function loadGuided() {
        let property = createProperty(guided_data);
        property.setInterpolationOptions({
            interpolationDegree: 10,
            interpolationAlgorithm: LagrangePolynomialApproximation,
        });
        const availability = new TimeIntervalCollection([
            new TimeInterval({
                start: guided_start,
                // start: start,
                stop: stop,
            }),
        ]);
        const orientation = new VelocityOrientationProperty(property);
        // 添加entity实体
        let guidedModel = _viewer.entities.add({
            // 和时间轴关联
            availability: availability,
            id: 'move_guided',
            position: property,
            // 根据所提供的位置计算模型的朝向
            orientation: orientation,
            // 模型
            model: {
                uri: './Assets/File/Model/guided.glb',
                scale: 100,
                // minimumPixelSize: 64,
            },
        });
        let path = _viewer.entities.add({
            // 和时间轴关联
            availability: availability,
            id: 'move_guided_path',
            position: property,
            // 根据所提供的位置计算模型的朝向
            orientation: orientation,
            path: {
                resolution: 1,
                material: Color.RED,
                // leadTime、trailTime 不设置 path全显示
                // leadTime:0,// 设置为0时 模型通过后显示path
                trailTime: 0, // 设置为0时 模型通过后隐藏path
                width: 2.5,
            },
        });
        _viewer.scene.bloom.add(path);
        return guidedModel;
    }
    const guided = loadGuided();
    const guided_matrix = guided.computeModelMatrix(guided_start, new Matrix4());
    const guided_trans_matrix = Matrix4.fromTranslation(new Cartesian3(-600, 0, 190));
    const guided_flame_matrix = Matrix4.multiply(guided_matrix, guided_trans_matrix, new Matrix4());
    const guided_flame = new ParticleSystem({
        //每个粒子的图像
        image: './Assets/File/Texture/smoke.png',
        //设置发射出的图像大小
        imageSize: new Cartesian2(guided_viewModel.particleSize, guided_viewModel.particleSize),
        startColor: Color.LIGHTSEAGREEN.withAlpha(0.7),
        endColor: Color.WHITE.withAlpha(0.0),
        //设置粒子图发射之后的最小/最大速度(以米/秒为单位),值越大，尾巴飘的越高
        minimumSpeed: guided_viewModel.minimumSpeed,
        maximumSpeed: guided_viewModel.maximumSpeed,
        //startScale endScale，代替scale设置粒子在生命周期内显示的初始和结束尺寸，
        //也是动态混合的作用。 值越大，初始时粒子图的大小越大
        startScale: guided_viewModel.startScale,
        endScale: guided_viewModel.endScale,
        //maximumParticleLife：设置粒子寿命的可能持续时间的最大界限（以秒为单位），粒子的实际寿命将随
        //机生成
        //值越大，尾巴越长
        minimumParticleLife: guided_viewModel.minimumParticleLife,
        maximumParticleLife: guided_viewModel.maximumParticleLife,
        //particleLife：设置该值将会覆盖minimumParticleLife和maximumParticleLife
        //minimumParticleLife：设置粒子寿命的可能持续时间的最小界限（以秒为单位），粒子的实际寿命将随
        //机生成
        //每秒发射的粒子数。数值越大，越浓密
        emissionRate: guided_viewModel.emissionRate,
        //粒子系统生命周期内，按照指定周期，爆发一定数量的粒子。三个参数（time，minimum，maximum）
        bursts: [
            // 爆炸出的粒子的密度
            new ParticleBurst({
                time: 1.0,
                minimum: 10,
                maximum: 100,
            }),
            new ParticleBurst({
                time: 2.5,
                minimum: 50,
                maximum: 100,
            }),
            new ParticleBurst({
                time: 4.0,
                minimum: 100,
                maximum: 200,
            }),
        ],
        //粒子系统会发射多久粒子，以秒为单位。默认为最大值
        lifetime: 5.0,
        // 粒子系统的粒子发射器；包括四种发射器：圆形、锥体、球体、长方体
        // emitter: new CircleEmitter(2.0),
        emitter: new SphereEmitter(5.0),
        //modelMatrix： 4x4变换矩阵，将粒子系统从模型转换为世界坐标。
        // modelMatrix: computeModelMatrix(entity, _viewer.clock.startTime),
        modelMatrix: guided_flame_matrix,
        // modelMatrix: new Matrix4(),
        //4x4变换矩阵，用于在粒子系统内部坐标系中转换粒子系统发射器。
        emitterModelMatrix: computeEmitterModelMatrix(),
        //一组强制回调。回调被传递一个粒子和上次的差值
        //每帧都要调用的回调函数来更新粒子。此updateCallback作用是用来改变粒子系统在每一个时间步长的属
        //性，可以强制改变粒子系统的颜色、大小等值。在updateCallback更改gravity重力参数，值越大，烟雾
        //离模型越近的地方飘的越高，可能出现负值，此时烟雾会向下方飘。
        updateCallback: applyGuidedGravity,
        sizeInMeters: true,
    });
    const gravityGuidedScratch = new Cartesian3();
    function applyGuidedGravity(p, dt) {
        // 计算每个粒子的向上向量（相对地心）
        const guided_matrix = guided.computeModelMatrix(_viewer.clock.currentTime, new Matrix4());
        if (!guided_matrix) {
            return;
        }
        else {
            const position = p.position;
            const guided_position = Matrix4.multiplyByPoint(guided_matrix, new Cartesian3(0, 0, 0), new Cartesian3());
            Cartesian3.normalize(Cartesian3.subtract(position, guided_position, new Cartesian3()), gravityGuidedScratch);
            Cartesian3.multiplyByScalar(gravityGuidedScratch, guided_viewModel.gravity * dt, gravityGuidedScratch);
            p.velocity = Cartesian3.add(p.velocity, gravityGuidedScratch, p.velocity);
            const trans_matrix = Matrix4.fromTranslation(new Cartesian3(-600, 0, 190));
            const flame_matrix = Matrix4.multiply(guided_matrix, trans_matrix, new Matrix4());
            guided_flame.modelMatrix = flame_matrix;
        }
    }
};
export const example = (viewer, _) => {
    _viewer = viewer;
    _animation();
};
//# sourceMappingURL=airplane-guided-confront.js.map