import {
	Cartesian3,
	Color,
	ColorGeometryInstanceAttribute,
	DatumPlaneAnalysis,
	EventHelper,
	GeometryInstance,
	GroundPrimitive,
	Material,
	MaterialAppearance,
	Math,
	Matrix3,
	Matrix4,
	PolygonGeometry,
	PolygonHierarchy,
	PolylineColorAppearance,
	PolylineGeometry,
	Primitive,
	PrimitiveCollection,
	Text3D,
	Transforms,
	Viewer,
} from 'cesium';
import { GUI } from 'dat.gui';
import BigeMapUtils from './Lib/BigeMapUtils/BigeMapUtils.es.js';

let _viewer: Viewer;
let _typeface: any;
let _modelMatrix1: Matrix4;
let _modelMatrix2: Matrix4;
let _modelMatrix3: Matrix4;
let _fontGeo1: any;
let _fontGeo2: any;
let _fontGeo3: any;
let _text3d1: Text3D;
let _text3d2: Text3D;
let _text3d3: Text3D;
const _primitiveCollection = new PrimitiveCollection();
const _positions = [
	[86.87999390201867, 28.005400592303793],
	[86.87439911685212, 27.94713359319177],
	[86.95506267264994, 27.94769754773391],
	[86.9703064099265, 27.996796123763904],
	[86.94293320867732, 28.018685010313277],
	// +1
	[86.87999390201867, 28.005400592303793],
];
let _init = false;

const _updateVolume = () => {
	if (!_init || !_options.power) return;
	_primitiveCollection.removeAll();

	const volume = DatumPlaneAnalysis.volumeAnalysis(_viewer, _positions, _options.height, _options.maxFineness);

	// 绘制参考面
	const datumPlane = Cartesian3.fromDegreesArrayHeights(
		_positions.flatMap(v => {
			return [v[0], v[1], _options.height];
		})
	);
	volume.instances.push(
		new GeometryInstance({
			geometry: new PolylineGeometry({
				positions: datumPlane,
				width: 5.0,
			}),
			attributes: {
				color: ColorGeometryInstanceAttribute.fromColor(Color.GREEN),
			},
		})
	);

	_positions.forEach(v => {
		volume.instances.push(
			new GeometryInstance({
				geometry: new PolylineGeometry({
					positions: [
						Cartesian3.fromDegrees(v[0], v[1], _options.height),
						Cartesian3.fromDegrees(v[0], v[1]),
					],
					width: 5.0,
				}),
				attributes: {
					color: ColorGeometryInstanceAttribute.fromColor(Color.GREEN),
				},
			})
		);
	});

	_primitiveCollection.add(
		new Primitive({
			geometryInstances: volume.instances,
			appearance: new PolylineColorAppearance({
				translucent: false, //是否透明
			}),
		})
	);

	_primitiveCollection.add(
		new GroundPrimitive({
			geometryInstances: new GeometryInstance({
				geometry: new PolygonGeometry({
					polygonHierarchy: new PolygonHierarchy(datumPlane),
				}),
			}),
			appearance: new MaterialAppearance({
				translucent: true,
				material: new Material({
					fabric: {
						type: 'Color',
						uniforms: {
							color: Color.GRAY.withAlpha(0.5),
						},
					},
				}),
			}),
		})
	);

	_label(volume);
};
const _options = {
	power: false,
	height: 6500,
	maxFineness: 12,
	update: _updateVolume,
};

const _loadTestData = () => {
	const rotationX = Matrix4.fromRotationTranslation(Matrix3.fromRotationX(Math.toRadians(90)));
	_modelMatrix1 = Transforms.eastNorthUpToFixedFrame(
		Cartesian3.fromDegrees(86.84999390201867, 28.005400592303793, 7500)
	);
	_modelMatrix2 = Transforms.eastNorthUpToFixedFrame(
		Cartesian3.fromDegrees(86.84439911685212, 27.94713359319177, 7500)
	);
	_modelMatrix3 = Transforms.eastNorthUpToFixedFrame(
		Cartesian3.fromDegrees(86.9403064099265, 27.996796123763904, 8500)
	);
	Matrix4.multiply(_modelMatrix1, rotationX, _modelMatrix1);
	Matrix4.multiplyByScale(_modelMatrix1, new Cartesian3(2.5, 2.5, 2.5), _modelMatrix1);
	Matrix4.multiply(_modelMatrix2, rotationX, _modelMatrix2);
	Matrix4.multiplyByScale(_modelMatrix2, new Cartesian3(2.5, 2.5, 2.5), _modelMatrix2);
	Matrix4.multiply(_modelMatrix3, rotationX, _modelMatrix3);
	Matrix4.multiplyByScale(_modelMatrix3, new Cartesian3(2.5, 2.5, 2.5), _modelMatrix3);
	return (BigeMapUtils as any).fontLoader('Assets/File/Typeface/KaiTi_Regular.json') as Promise<Object>;
};
export const example = (viewer: Viewer, gui: GUI) => {
	_viewer = viewer;
	const folder = gui.addFolder('基准面体积分析');
	folder
		.add(_options, 'power')
		.name('开启基准面体积分析')
		.onChange(v => {
			_primitiveCollection.show = v;
			if (_primitiveCollection.length === 0 && v) {
				const promise = _loadTestData();
				// 第一次开启初始化数据和相机位置 相机视角(平滑)移动到指定经纬度位置
				viewer.camera.flyTo({
					destination: Cartesian3.fromElements(290055.8719199525, 5641421.129721272, 2986987.0604518624), //经度、纬度、高度
					orientation: {
						heading: 4.296325377749298,
						pitch: -0.656815701273846,
						roll: 6.28316244697332,
					},
					duration: 3,
					complete: () => {
						console.log('flyto complete');
						const helper = new EventHelper();
						helper.add(viewer.scene.globe.tileLoadProgressEvent, async e => {
							if (e == 0) {
								_typeface = await promise;
								_init = true;
								_updateVolume();
								helper.removeAll();
							}
						});
					},
				});
			}
		});
	folder.add(_options, 'height').name('基准面高度').min(0).max(9000).step(10);
	folder.add(_options, 'maxFineness').name('体积分析使用的最大细腻度').min(5).max(12).step(1);
	folder.add(_options, 'update').name('重新进行体积分析');

	viewer.scene.primitives.add(_primitiveCollection);
};

const _label = (volume: any) => {
	_viewer.scene.bloom.remove(_text3d1);
	_viewer.scene.bloom.remove(_text3d2);
	_viewer.scene.bloom.remove(_text3d3);

	_fontGeo1 = (BigeMapUtils as any).createText3DGeometryAttribute(`最低海拔 ${volume.minHeight} 米`, _typeface);
	_text3d1 = _primitiveCollection.add(
		new Text3D({
			position_buffer: _fontGeo1.position,
			st_buffer: _fontGeo1.st,
			modelMatrix: _modelMatrix1,
			show: true,
		})
	);

	_viewer.scene.bloom.add(_text3d1);

	_fontGeo2 = (BigeMapUtils as any).createText3DGeometryAttribute(
		`基准面以上体积 ${volume.scoopVolume} 立方米`,
		_typeface
	);
	_text3d2 = _primitiveCollection.add(
		new Text3D({
			position_buffer: _fontGeo2.position,
			st_buffer: _fontGeo2.st,
			modelMatrix: _modelMatrix2,
			show: true,
		})
	);

	_viewer.scene.bloom.add(_text3d2);

	_fontGeo3 = (BigeMapUtils as any).createText3DGeometryAttribute(
		`基准面以下体积 ${volume.fillVolume} 立方米`,
		_typeface
	);
	_text3d3 = _primitiveCollection.add(
		new Text3D({
			position_buffer: _fontGeo3.position,
			st_buffer: _fontGeo3.st,
			modelMatrix: _modelMatrix3,
			show: true,
		})
	);

	_viewer.scene.bloom.add(_text3d3);
};
