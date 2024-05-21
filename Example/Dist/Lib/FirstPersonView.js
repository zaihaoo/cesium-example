import { Cartesian2, Math, ScreenSpaceEventHandler, ScreenSpaceEventType, defined } from '../../Lib/Cesium/index.js';
class FirstPersonView {
    _camera;
    _handler;
    _mouseSensitivity;
    _heading;
    _pitch;
    _scene;
    _screenSpaceCameraControllerBackup;
    _working;
    constructor(camera) {
        this._working = false;
        this._heading = 0;
        this._pitch = 0;
        this._mouseSensitivity = new Cartesian2(0.25, 0.25);
        this._camera = camera;
        this._scene = this._camera._scene;
        this._handler = new ScreenSpaceEventHandler(this._scene.canvas);
        this._handler.setInputAction(this._mouseMoveEvent, ScreenSpaceEventType.MOUSE_MOVE);
        this._keyboardEventHandler('addEventListener');
    }
    _getFlagForKeyCode = (keyCode) => {
        switch (keyCode) {
            case 'w':
                return 'moveForward';
            case 's':
                return 'moveBackward';
            case 'q':
                return 'moveUp';
            case 'e':
                return 'moveDown';
            case 'd':
                return 'moveRight';
            case 'a':
                return 'moveLeft';
            default:
                return undefined;
        }
    };
    start = () => {
        if (this._working)
            return;
        // this._pitch = Math.toDegrees(this._camera.pitch);
        // this._heading = Math.toDegrees(this._camera.heading);
        this._heading = 0;
        this._pitch = 0;
        this._screenSpaceCameraControllerBackup = {
            enableRotate: this._scene.screenSpaceCameraController.enableRotate,
            enableTranslate: this._scene.screenSpaceCameraController.enableTranslate,
            enableZoom: this._scene.screenSpaceCameraController.enableZoom,
            enableTilt: this._scene.screenSpaceCameraController.enableTilt,
            enableLook: this._scene.screenSpaceCameraController.enableLook,
        };
        //如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D
        this._scene.screenSpaceCameraController.enableRotate = false;
        //如果为真，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式
        this._scene.screenSpaceCameraController.enableTranslate = false;
        //如果为真，则允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离。
        this._scene.screenSpaceCameraController.enableZoom = false;
        //如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
        this._scene.screenSpaceCameraController.enableTilt = false;
        //如果为真，则允许用户使用免费外观。如果为假，摄像机视图方向只能通过转换或旋转进行更改。此标志仅适用于3D和哥伦布视图模式。
        this._scene.screenSpaceCameraController.enableLook = false;
        this._working = true;
    };
    _keyboardEventHandler = (method) => {
        const flags = {
            moveForward: false,
            moveBackward: false,
            moveUp: false,
            moveDown: false,
            moveLeft: false,
            moveRight: false,
        };
        document[method]('keydown', (e) => {
            if (!this._working)
                return;
            const flagName = this._getFlagForKeyCode(e.key);
            defined(flagName) && (flags[flagName] = true);
        }, false);
        document[method]('keyup', (e) => {
            if (!this._working)
                return;
            const flagName = this._getFlagForKeyCode(e.key);
            defined(flagName) && (flags[flagName] = false);
        }, false);
        this._scene.preUpdate[method]((_) => {
            if (!this._working)
                return;
            const moveRate = 10;
            if (flags.moveForward) {
                this._camera.moveForward(moveRate);
            }
            if (flags.moveBackward) {
                this._camera.moveBackward(moveRate);
            }
            if (flags.moveUp) {
                this._camera.moveUp(moveRate);
            }
            if (flags.moveDown) {
                this._camera.moveDown(moveRate);
            }
            if (flags.moveLeft) {
                this._camera.moveLeft(moveRate);
            }
            if (flags.moveRight) {
                this._camera.moveRight(moveRate);
            }
        });
    };
    stop = () => {
        if (!this._working)
            return;
        // this._heading = 0;
        // this._pitch = 0;
        //如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D
        this._scene.screenSpaceCameraController.enableRotate = this._screenSpaceCameraControllerBackup.enableRotate;
        //如果为真，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式
        this._scene.screenSpaceCameraController.enableTranslate =
            this._screenSpaceCameraControllerBackup.enableTranslate;
        //如果为真，则允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离。
        this._scene.screenSpaceCameraController.enableZoom = this._screenSpaceCameraControllerBackup.enableZoom;
        //如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
        this._scene.screenSpaceCameraController.enableTilt = this._screenSpaceCameraControllerBackup.enableTilt;
        //如果为真，则允许用户使用免费外观。如果为假，摄像机视图方向只能通过转换或旋转进行更改。此标志仅适用于3D和哥伦布视图模式。
        this._scene.screenSpaceCameraController.enableLook = this._screenSpaceCameraControllerBackup.enableLook;
        this._working = false;
    };
    _mouseMoveEvent = (event) => {
        if (!this._working)
            return;
        const screenPositionDelta = Cartesian2.subtract(event.endPosition, event.startPosition, new Cartesian2());
        if (window.Math.abs(screenPositionDelta.x) > 200 || window.Math.abs(screenPositionDelta.y) > 200)
            return;
        const x = screenPositionDelta.x * this._mouseSensitivity.x;
        this._heading += x;
        this._heading = this._heading > 360 ? this._heading - 360 : this._heading;
        this._heading = this._heading < -360 ? this._heading + 360 : this._heading;
        this._heading = Math.clamp(this._heading, -360, 360);
        const y = -screenPositionDelta.y * this._mouseSensitivity.y;
        this._pitch += y;
        this._pitch = this._pitch > 360 ? this._pitch - 360 : this._pitch;
        this._pitch = this._pitch < -360 ? this._pitch + 360 : this._pitch;
        this._pitch = Math.clamp(this._pitch, -87, 87);
        this._camera.setView({
            orientation: {
                heading: Math.toRadians(this._heading),
                pitch: Math.toRadians(this._pitch),
                roll: 0.0,
            },
        });
    };
    destroy = () => {
        this._handler.destroy();
        this._keyboardEventHandler('removeEventListener');
    };
}
export default FirstPersonView;
//# sourceMappingURL=FirstPersonView.js.map