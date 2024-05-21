import {
	BoxGeometry,
	Cartesian3,
	Cesium3DTileFeature,
	Color,
	EllipsoidSurfaceAppearance,
	GeometryInstance,
	Label,
	Material,
	Model,
	ModelAnimationLoop,
	Primitive,
	ScreenSpaceEventHandler,
	ScreenSpaceEventType,
	Transforms,
	VertexFormat,
	Viewer,
	Entity,
	GridMaterialProperty,
	Cartesian2,
} from 'cesium';
import { GUI } from 'dat.gui';

let _viewer: Viewer;
let _gltf_model: Model;
let _box: Primitive;
let _box_entity: Entity;
let _handler: ScreenSpaceEventHandler;
let _last: any[];

const _loadTestData = async () => {
	const modelMatrix1 = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.48, 38.91, 0));
	const modelMatrix2 = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(121.5, 38.9, 0));
	// gltf
	let animations;
	_gltf_model = await Model.fromGltfAsync({
		url: 'Assets/File/BOX2.glb',
		modelMatrix: modelMatrix1,
		scale: 10,
		id: 'house',
		gltfCallback: gltf => {
			animations = gltf.animations;
		},
	});
	_viewer.scene.primitives.add(_gltf_model);
	_gltf_model.readyEvent.addEventListener(() => {
		_gltf_model.activeAnimations.add({
			index: animations.length - 1,
			loop: ModelAnimationLoop.REPEAT,
		});
	});

	// primitive
	const instance = new GeometryInstance({
		modelMatrix: modelMatrix2,
		geometry: new BoxGeometry({
			maximum: new Cartesian3(500.0, 500.0, 500.0),
			minimum: new Cartesian3(-500.0, -500.0, -500.0),
			vertexFormat: VertexFormat.POSITION_AND_ST,
		}),
		id: 'box',
	});
	_box = new Primitive({
		geometryInstances: instance,
		appearance: new EllipsoidSurfaceAppearance({
			material: Material.fromType('Color'),
		}),
	});
	_box.appearance.material.uniforms.color = new Color(0, 0.5, 1, 1);
	_viewer.scene.primitives.add(_box);

	// entity
	_box_entity = new Entity({
		position: Cartesian3.fromDegrees(121.53, 38.9, 1500),
		box: {
			material: new GridMaterialProperty({ color: Color.BLACK, lineCount: new Cartesian2(3, 3) }),
			dimensions: new Cartesian3(1000, 1000, 1000),
		},
	});
	_viewer.entities.add(_box_entity);
};

const _handlerEvent = function (movement: any) {
	var pick = _viewer.scene.pick(movement.endPosition); //获取的pick对象
	if (_last) _last.forEach((v: any) => _viewer.scene.bloom.remove(v));
	_last = [];
	if (pick && pick instanceof Cesium3DTileFeature) {
		_last.push(pick);
	} else if (pick && pick.primitive instanceof Label) {
		pick.primitive._glyphs.forEach((v: any) => {
			_last.push(v.billboard);
		});
	} else if (pick && pick.primitive) {
		_last.push(pick.primitive);
	}

	_last.forEach((v: any) => _viewer.scene.bloom.add(v));
};

export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	_loadTestData();
	const options = {
		power: false,
	};

	_handler = new ScreenSpaceEventHandler();
	_last = [];

	const folder = gui.addFolder('物体泛光');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			if (v) {
				_handler.setInputAction(_handlerEvent, ScreenSpaceEventType.MOUSE_MOVE);
			} else {
				_handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
				_viewer.scene.bloom.removeAll();
				_last = [];
			}
		});
};
