import {
	Cartesian3,
	Cartographic,
	Color,
	GeometryInstance,
	GroundPolylineGeometry,
	GroundPolylinePrimitive,
	PolylineGeometry,
	PolylineMaterialAppearance,
	PolylineMeteorMaterial,
	Primitive,
	PrimitiveCollection,
	Viewer,
} from 'cesium';
import { GUI } from 'dat.gui';

let _positions: Cartographic[];

// 0,2,4,1,3,0
const _loadTestData = () => {
	_positions = [
		new Cartographic(2.1217699176723204, 0.6795468081132844),
		new Cartographic(2.121405707738371, 0.6792729735758226),
		new Cartographic(2.121682190831303, 0.6788587814513853),
		new Cartographic(2.1222245527147052, 0.6790061794381441),
		new Cartographic(2.1222476015124574, 0.6793889957564032),
	];
};
export const example = (viewer: Viewer, gui: GUI) => {
	const options = {
		power: false,
	};

	const folder = gui.addFolder('线段特效');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			_primitives.show = v;
		});
	_loadTestData();
	const _primitives = new PrimitiveCollection({ show: options.power });
	viewer.scene.primitives.add(_primitives);

	const polyline = new GeometryInstance({
		geometry: new GroundPolylineGeometry({
			positions: [
				Cartographic.toCartesian(_positions[0]),
				Cartographic.toCartesian(_positions[2]),
				Cartographic.toCartesian(_positions[4]),
				Cartographic.toCartesian(_positions[1]),
				Cartographic.toCartesian(_positions[3]),
				Cartographic.toCartesian(_positions[0]),
			],
			width: 30.0,
		}),
	});
	_primitives.add(
		new GroundPolylinePrimitive({
			geometryInstances: polyline,
			appearance: new PolylineMaterialAppearance({
				translucent: true,
				material: PolylineMeteorMaterial.B(),
			}),
		})
	);

	const polyline2 = new GeometryInstance({
		geometry: new PolylineGeometry({
			positions: [
				Cartesian3.fromRadians(_positions[0].longitude, _positions[0].latitude, 5000),
				Cartographic.toCartesian(_positions[0]),
			],
			width: 30.0,
		}),
	});

	_primitives.add(
		new Primitive({
			geometryInstances: polyline2,
			appearance: new PolylineMaterialAppearance({
				translucent: true,
				material: PolylineMeteorMaterial.A({ color: Color.RED }),
			}),
		})
	);
	const polyline3 = new GeometryInstance({
		geometry: new PolylineGeometry({
			positions: [
				Cartesian3.fromRadians(_positions[1].longitude, _positions[1].latitude, 5000),
				Cartographic.toCartesian(_positions[1]),
			],
			width: 20.0,
		}),
	});
	_primitives.add(
		new Primitive({
			geometryInstances: polyline3,
			appearance: new PolylineMaterialAppearance({
				translucent: true,
				material: PolylineMeteorMaterial.B(),
			}),
		})
	);
	const polyline4 = new GeometryInstance({
		geometry: new PolylineGeometry({
			positions: [
				Cartesian3.fromRadians(_positions[2].longitude, _positions[2].latitude, 5000),
				Cartographic.toCartesian(_positions[2]),
			],
			width: 20.0,
		}),
	});
	_primitives.add(
		new Primitive({
			geometryInstances: polyline4,
			appearance: new PolylineMaterialAppearance({
				translucent: true,
				material: PolylineMeteorMaterial.C(),
			}),
		})
	);
	const polyline5 = new GeometryInstance({
		geometry: new PolylineGeometry({
			positions: [
				Cartesian3.fromRadians(_positions[3].longitude, _positions[3].latitude, 5000),
				Cartographic.toCartesian(_positions[3]),
			],
			width: 20.0,
		}),
	});
	_primitives.add(
		new Primitive({
			geometryInstances: polyline5,
			appearance: new PolylineMaterialAppearance({
				translucent: true,
				material: PolylineMeteorMaterial.D(),
			}),
		})
	);
	const polyline6 = new GeometryInstance({
		geometry: new PolylineGeometry({
			positions: [
				Cartesian3.fromRadians(_positions[4].longitude, _positions[4].latitude, 5000),
				Cartographic.toCartesian(_positions[4]),
			],
			width: 20,
		}),
	});
	_primitives.add(
		new Primitive({
			geometryInstances: polyline6,
			appearance: new PolylineMaterialAppearance({
				translucent: true,
				material: PolylineMeteorMaterial.A({ color: Color.BLUEVIOLET, inversion: true }),
			}),
		})
	);
};
