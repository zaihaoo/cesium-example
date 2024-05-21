import { Cartesian3, CatmullRomSpline, Clock, ClockRange, JulianDate, LagrangePolynomialApproximation, SampledPositionProperty, VelocityVectorProperty, defaultValue, defined, } from '../../Lib/Cesium/index.js';
import FirstPersonView from './FirstPersonView.js';
class CameraRoutePlanning {
    constructor(options) {
        this._camera = options.camera;
        this._clock = defaultValue(options.clock, new Clock());
        this._loop = defaultValue(options.loop, false);
        this._clock.shouldAnimate = false;
        this._clock.onTick.addEventListener(this._onTick);
        this.timeSynchronization(this._loop);
        this._firstPersonView = new FirstPersonView(this._camera);
        this._control = defaultValue(options.control, false);
    }
    timeSynchronization = (loop) => {
        defined(loop) && (this._loop = loop);
        this._start = JulianDate.fromDate(new Date());
        this._stop = JulianDate.addSeconds(this._start, 60, new JulianDate());
        this._start = JulianDate.addHours(this._start, 8, new JulianDate());
        this._stop = JulianDate.addHours(this._stop, 8, new JulianDate());
        // 设置始时钟始时间
        this._clock.startTime = this._start.clone();
        // 设置时钟当前时间
        this._clock.currentTime = this._start.clone();
        // 设置始终停止时间
        this._clock.stopTime = this._stop.clone();
        // 时间速率，数字越大时间过的越快
        this._clock.multiplier = 1;
        // 循环执行,即为2，到达终止时间，重新从起点时间开始
        this._clock.clockRange = this._loop ? ClockRange.LOOP_STOP : ClockRange.CLAMPED;
        if (this._timePositions) {
            this._property = this._createProperty(this._timePositions);
            this._property.setInterpolationOptions({
                interpolationDegree: 5,
                interpolationAlgorithm: LagrangePolynomialApproximation,
            });
            this._orienta = new VelocityVectorProperty(this._property, true);
        }
    };
    _onTick = (v) => {
        if (!this._property || !this._orienta || !this._clock.shouldAnimate)
            return;
        const position = this._property.getValue(v.currentTime);
        const dir = this._orienta.getValue(v.currentTime);
        if (!position || !dir)
            return;
        this._control
            ? (this._camera.position = position)
            : this._camera.setView({
                destination: position,
                orientation: {
                    direction: dir,
                    up: Cartesian3.cross(Cartesian3.cross(dir, Cartesian3.normalize(position, new Cartesian3()), new Cartesian3()), dir, new Cartesian3()),
                },
            });
    };
    start = () => {
        this._control && this._firstPersonView.start();
        this._clock.shouldAnimate = true;
    };
    stop = () => {
        this._control && this._firstPersonView.stop();
        this._clock.shouldAnimate = false;
    };
    reset = () => {
        this._clock.currentTime = this._clock.startTime;
    };
    destroy = () => {
        this._clock.onTick.removeEventListener(this._onTick);
        this._control && this._firstPersonView.destroy();
    };
    setPath = (controls, time = 60, count = 200) => {
        this._positions = [];
        const times = [];
        controls.forEach((_, i) => {
            times.push(i / (controls.length - 1));
        });
        // const spline = HermiteSpline.createNaturalCubic({
        const spline = new CatmullRomSpline({
            // times: [0.0, 0.25, 0.5, 0.75, 1],
            times: times,
            points: controls,
        });
        for (let i = 0; i <= count; i++) {
            const cartesian3 = spline.evaluate(i / count);
            this._positions.push(cartesian3);
        }
        this._timePositions = [];
        this._positions.forEach((v, i) => this._timePositions.push({ position: v, time: i * (time / this._positions.length) }));
        this._property = this._createProperty(this._timePositions);
        this._property.setInterpolationOptions({
            interpolationDegree: 5,
            interpolationAlgorithm: LagrangePolynomialApproximation,
        });
        this._orienta = new VelocityVectorProperty(this._property, true);
        return this._positions;
    };
    _createProperty = (source) => {
        // 取样位置 相当于一个集合
        const property = new SampledPositionProperty();
        for (let i = 0; i < source.length; i++) {
            const time = JulianDate.addSeconds(this._start, source[i].time, new JulianDate());
            const position = source[i].position;
            // 添加位置，和时间对应
            property.addSample(time, position);
        }
        return property;
    };
}
Object.defineProperties(CameraRoutePlanning.prototype, {
    control: {
        get: function () {
            return this._control;
        },
        set: function (control) {
            if (this._control === control)
                return;
            this._control = control;
            this._control ? this._firstPersonView.start() : this._firstPersonView.stop();
        },
    },
});
export default CameraRoutePlanning;
//# sourceMappingURL=CameraRoutePlanning.js.map