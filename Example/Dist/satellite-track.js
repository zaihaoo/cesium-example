import { Cartesian3, Color, ConstantPositionProperty, ConstantProperty, EventHelper, JulianDate, Math, Matrix3, Matrix4, Quaternion, SampledPositionProperty, TimeInterval, TimeIntervalCollection, VelocityOrientationProperty, } from '../Lib/Cesium/index.js';
let _viewer;
let _start;
let _stop;
export const example = (viewer, gui) => {
    const options = {
        power: false,
        tail: false,
    };
    _viewer = viewer;
    const helper = new EventHelper();
    helper.add(viewer.scene.globe.tileLoadProgressEvent, e => {
        if (e == 0) {
            _start = viewer.clock.currentTime.clone();
            _stop = JulianDate.addSeconds(_start, 40, new JulianDate());
            const _tracks = [];
            const modelA = './Assets/File/Model/old_satellite.glb';
            const modelB = './Assets/File/Model/satellite.glb';
            const trackA = drawCircle(10000000, new SampledPositionProperty(), new ConstantPositionProperty(), new ConstantProperty(), 30, 20, 0.01, -0.01, 100, 40, Color.PURPLE, modelA);
            _tracks.push(trackA.model, trackA.path);
            const trackB = drawCircle(9000000, new SampledPositionProperty(), new ConstantPositionProperty(), new ConstantProperty(), -30, -20, -0.01, 0.01, 100, 20, Color.GREEN, modelB);
            _tracks.push(trackB.model, trackB.path);
            for (let i = 0; i < 4; i++) {
                const track = drawCircle(8500000 - window.Math.random() * 1000000, new SampledPositionProperty(), new ConstantPositionProperty(), new ConstantProperty(), window.Math.sin(window.Math.random() * 2) * 30, window.Math.cos(window.Math.random() * 2) * 30, window.Math.sin(window.Math.random() * 2) * 0.1, window.Math.cos(window.Math.random() * 2) * 0.1, 100, 40, Color.fromRandom(), modelB);
                _tracks.push(track.model, track.path);
            }
            const folder = gui.addFolder('卫星轨迹');
            folder
                .add(options, 'power')
                .name('是否开启')
                .onChange(v => {
                _tracks.forEach(track => (track.show = v));
            });
            folder
                .add(options, 'tail')
                .name('卫星视角跟随')
                .onChange(v => {
                if (v) {
                    _viewer.trackedEntity = trackA.model;
                }
                else {
                    _viewer.trackedEntity = undefined;
                }
            });
            helper.removeAll();
        }
    });
    // 设置始时钟始时间
    // viewer.clock.startTime = _start.clone();
    // 设置时钟当前时间
    // viewer.clock.currentTime = _start.clone();
    // 设置始终停止时间
    // viewer.clock.stopTime = _stop.clone();
    // 时间轴
    // viewer.timeline.zoomTo(_start, _stop);
    // 循环执行,即为2，到达终止时间，重新从起点时间开始
    // viewer.clock.clockRange = ClockRange.LOOP_STOP;
};
const createCircle = (r, alphaX, alphaY, count, time) => {
    const pos = [];
    const times = [];
    let _modelMatrix = Matrix4.IDENTITY;
    const rotationX = Matrix4.fromRotationTranslation(Matrix3.fromRotationX(Math.toRadians(alphaX)));
    _modelMatrix = Matrix4.multiply(_modelMatrix, rotationX, new Matrix4());
    const rotationY = Matrix4.fromRotationTranslation(Matrix3.fromRotationY(Math.toRadians(alphaY)));
    _modelMatrix = Matrix4.multiply(_modelMatrix, rotationY, new Matrix4());
    for (let i = 0; i <= count; i++) {
        times.push((time / count) * i);
        const angle = (360 / count) * i;
        const x = r * window.Math.cos((angle * Math.PI) / 180);
        const y = r * window.Math.sin((angle * Math.PI) / 180);
        const z = 0;
        const p = Matrix4.multiplyByPoint(_modelMatrix, new Cartesian3(x, y, z), new Cartesian3());
        pos.push(p);
    }
    return { pos: pos, times: times };
};
const drawCircle = (radius, property, position, orientation, alphaX, alphaY, deltaX, deltaY, count, time, pathColor, uri) => {
    const pos = createCircle(radius, alphaX, alphaY, count, time);
    updateProperty(pos.pos, pos.times, property);
    // let polyline_rhumb = viewer.entities.add({
    // 	name: 'circ1',
    // 	polyline: {
    // 		show: true, //是否显示，默认显示
    // 		positions: property,
    // 		width: 1, //线的宽度（像素），默认为1
    // 		granularity: Math.RADIANS_PER_DEGREE,
    // 		material: Color.GREEN, //线的颜色，默认为白色
    // 		// arcType: ArcType.NONE,
    // 		arcType: ArcType.GEODESIC,
    // 		// arcType: ArcType.RHUMB,
    // 		clampToGround: false,
    // 	},
    // });
    // viewer.scene.bloom.add(polyline_rhumb);
    // property.setInterpolationOptions({
    // 	interpolationDegree: 5,
    // 	interpolationAlgorithm: LinearApproximation,
    // });
    const timeInter = new TimeInterval({
        start: _start,
        stop: _stop,
    });
    const availability = new TimeIntervalCollection([timeInter]);
    const velocity = new VelocityOrientationProperty(property);
    position.setValue(pos.pos[0]);
    orientation.setValue(velocity.getValue(_start, new Quaternion()));
    let model = _viewer.entities.add({
        // 和时间轴关联
        // availability: availability,
        position: position,
        // 根据所提供的位置计算模型的朝向
        orientation: orientation,
        // 模型
        model: {
            uri: uri,
            scale: 200000,
            // minimumPixelSize: 64,
        },
        show: false,
    });
    // 添加entity实体
    let path = _viewer.entities.add({
        // 和时间轴关联
        availability: availability,
        position: property,
        // 根据所提供的位置计算模型的朝向
        // orientation: orientation,
        //路径
        path: {
            resolution: 1,
            material: pathColor,
            width: 1,
        },
        show: false,
    });
    _viewer.scene.bloom.add(path);
    _viewer.scene.bloom.add(model);
    _viewer.clock.onTick.addEventListener(v => {
        alphaX += deltaX;
        alphaY += deltaY;
        const pos = createCircle(radius, alphaX, alphaY, count, time);
        const currentTime = v.currentTime;
        const second = JulianDate.secondsDifference(currentTime, _start);
        // 保证path一直存在 因为path必须有availability属性才能生效 而model则不受availability属性影响
        timeInter.stop = JulianDate.addSeconds(_stop, second, new JulianDate());
        // 并且利用更新后的timeInter清空SampledPositionProperty
        property.removeSamples(timeInter);
        updateProperty(pos.pos, pos.times, property);
        const s = second % time;
        const nowTime = JulianDate.addSeconds(_start, s, new JulianDate());
        const newpos = property.getValue(nowTime);
        position.setValue(newpos);
        // 这里可以根据path方向 修正model的朝向 示例没有使用
        // const velocity = new VelocityOrientationProperty(property);
        // orientation.setValue(velocity.getValue(nowTime));
    });
    return { model: model, path: path };
};
const updateProperty = (source, times, property) => {
    // 取样位置 相当于一个集合
    for (let i = 0; i < source.length; i++) {
        let time = JulianDate.addSeconds(_start, times[i], new JulianDate());
        let position = source[i];
        // 添加位置，和时间对应
        property.addSample(time, position);
    }
};
//# sourceMappingURL=satellite-track.js.map