import { BoundingSphere, Cartesian2, Cartesian3, HeadingPitchRange, Math, ScreenSpaceEventHandler, ScreenSpaceEventType, defined, } from '../Lib/Cesium/index.js';
let _animationFrameHandle;
let _viewer;
const createAnimation = () => {
    const distanceDelta = 0.55, angleDelta = 0.1, pitchDelta = Math.toRadians(10);
    const position = _viewer.scene.pickPosition(new Cartesian2(window.Math.round(_viewer.container.clientWidth / 2), window.Math.round(_viewer.container.clientHeight / 2)));
    if (!defined(position) || !position)
        return;
    const orbitStartTime = performance.now();
    const cPitch = _viewer.camera.pitch, cHeading = _viewer.camera.heading, distance = Cartesian3.distance(position, _viewer.camera.position), play = () => {
        const angle = ((performance.now() - orbitStartTime) * angleDelta) / 1e3, nHeading = cHeading + angle, nPitch = cPitch + pitchDelta * window.Math.sin(angle), nDistance = distance + distanceDelta * distance * -window.Math.sin(angle);
        _viewer.camera.flyToBoundingSphere(new BoundingSphere(position, 0), {
            offset: new HeadingPitchRange(nHeading, nPitch, nDistance),
            duration: 0,
        }),
            (_animationFrameHandle = requestAnimationFrame(play));
    };
    play();
};
const cancelAnimation = () => {
    _animationFrameHandle && cancelAnimationFrame(_animationFrameHandle);
    _animationFrameHandle = undefined;
};
export const options = {
    power: false,
};
export const example = (viewer, gui) => {
    _viewer = viewer;
    const handler = new ScreenSpaceEventHandler(_viewer.scene.canvas);
    handler.setInputAction(function (_) {
        cancelAnimation();
        options.power = false;
    }, ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(function (_) {
        cancelAnimation();
        options.power = false;
    }, ScreenSpaceEventType.RIGHT_DOWN);
    handler.setInputAction(function (_) {
        cancelAnimation();
        options.power = false;
    }, ScreenSpaceEventType.WHEEL);
    handler.setInputAction(function (_) {
        cancelAnimation();
        options.power = false;
    }, ScreenSpaceEventType.MIDDLE_DOWN);
    options.power && createAnimation();
    const folder = gui.addFolder('相机漫游');
    folder
        .add(options, 'power')
        .name('绕屏幕中心')
        .listen()
        .onChange(v => {
        v ? createAnimation() : cancelAnimation();
    });
};
//# sourceMappingURL=screen-center-orbit-camera.js.map