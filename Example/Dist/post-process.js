import { PostProcessStageComposite, PostProcessStageLibrary, ScreenSpaceEventHandler, ScreenSpaceEventType, getTimestamp, } from '../Lib/Cesium/index.js';
export const _controlNightVision = () => {
    return new PostProcessStageComposite({
        stages: [PostProcessStageLibrary.createNightVisionStage()],
    });
};
let _handler;
let _viewer;
export let waterRipplePower;
export const example = (viewer, gui) => {
    _viewer = viewer;
    _handler = new ScreenSpaceEventHandler(_viewer.scene.canvas);
    const options = {
        nightPower: false,
        skylinePower: false,
        waterRipplePower: false,
    };
    const _nightControl = _controlNightVision();
    _nightControl.enabled = options.nightPower;
    viewer.postProcessStages.add(_nightControl);
    const _skylineControl = PostProcessStageComposite.createSkylineComposite();
    _skylineControl.enabled = options.skylinePower;
    viewer.postProcessStages.add(_skylineControl);
    const _waterRippleControl = PostProcessStageLibrary.createWaterRipple();
    _waterRippleControl.enabled = options.waterRipplePower;
    viewer.postProcessStages.add(_waterRippleControl);
    const folder = gui.addFolder('辅助效果');
    folder
        .add(options, 'nightPower')
        .name('夜视模式')
        .onChange(v => {
        _nightControl.enabled = v;
    });
    folder
        .add(options, 'skylinePower')
        .name('天际线')
        .onChange(v => {
        _skylineControl.enabled = v;
    });
    waterRipplePower = folder
        .add(options, 'waterRipplePower')
        .name('水波纹')
        .onChange(v => {
        _waterRippleControl.enabled = v;
        if (v) {
            _handler.setInputAction((event) => {
                _waterRippleControl.uniforms.startTime = getTimestamp() / 1000;
                _waterRippleControl.uniforms.pos.x =
                    event.position.x / document.getElementById('canvas').clientWidth;
                _waterRippleControl.uniforms.pos.y =
                    1 - event.position.y / document.getElementById('canvas').clientHeight;
            }, ScreenSpaceEventType.LEFT_CLICK);
        }
        else {
            _handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        }
    });
};
//# sourceMappingURL=post-process.js.map