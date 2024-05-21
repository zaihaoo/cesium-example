import {
	BoundingSphere,
	Cartesian2,
	Cartesian3,
	Cartographic,
	// Cesium3DTileset,
	CloudCollection,
	Color,
	CumulusCloud,
	Math,
	Matrix4,
	Model,
	Plane,
	Transforms,
	Viewer,
} from 'cesium';
import { GUI } from 'dat.gui';

async function createModel(url: string, height: number) {
	// viewer.entities.removeAll();

	const position = Cartesian3.fromDegrees(-123.0744619, 44.0503706, height);
	// const heading = Math.toRadians(135);
	// const pitch = 0;
	// const roll = 0;
	// const hpr = new HeadingPitchRoll(heading, pitch, roll);
	// const orientation = Transforms.headingPitchRollQuaternion(position, hpr);

	// {
	// 	name: url,
	// 	position: position,
	// 	orientation: new ConstantProperty(orientation),
	// 	model: {
	// 		scale: 100,
	// 		uri: url,
	// 		minimumPixelSize: 128,
	// 		maximumScale: 20000,
	// 	},
	// }
	const palaceTileset = _viewer.scene.primitives.add(
		await Model.fromGltfAsync({
			url: url,
			modelMatrix: Transforms.eastNorthUpToFixedFrame(position),
			// minimumPixelSize: 128,
			maximumScale: 20000,
			scale: 10,
		})
	);
	palaceTileset.readyEvent.addEventListener(() => {
		cloud(palaceTileset.boundingSphere, _viewer);
	});
	// v.lightColor = new Cartesian3(0.1, 0.1, 0.1);
	// v.imageBasedLighting.imageBasedLightingFactor = new Cartesian2(0.1, 0.1);
	_viewer.camera.flyTo({
		destination: Cartesian3.fromDegrees(-123.0744619, 44.0503706, 500),
		orientation: {
			heading: 0,
			pitch: Math.toRadians(-90 || -Math.PI_OVER_FOUR),
			roll: Math.toRadians(360 || 0),
		},
		duration: 3,
		complete: () => {
			console.log('flyto complete');
		},
	});

	// const palaceTileset = _viewer.entities.add({
	// 	position: position,
	// 	model: {
	// 		// scale: 100,
	// 		uri: url,
	// 		// minimumPixelSize: 128,
	// 		// maximumScale: 20000,
	// 		// modelMatrix: Transforms.eastNorthUpToFixedFrame(position),
	// 	},
	// });

	// _viewer.trackedEntity = palaceTileset;

	// const primitive = _viewer.scene.primitives.add(
	// 	new Cesium3DTileset({
	// 		url: './Assets/File/Build/building/tileset.json',
	// 		modelMatrix: Transforms.eastNorthUpToFixedFrame(position),
	// 	})
	// );

	//加载倾斜示范数据
	// var palaceTileset = new Cesium3DTileset({
	// 	url: './Assets/File/Build/lon/tileset.json',
	// 	// url: './Assets/File/Build/area/tileset.json',
	// 	//控制切片视角显示的数量，可调整性能
	// 	// maximumScreenSpaceError: 2,
	// });
	// //添加到场景
	// _viewer.scene.primitives.add(palaceTileset);
	//控制模型的位置
	// palaceTileset.readyPromise.then(function (palaceTileset) {
	// 	var heightOffset = 0.0; //可以改变3Dtiles的高度
	// 	var boundingSphere = palaceTileset.boundingSphere;
	// 	var cartographic = Cartographic.fromCartesian(boundingSphere.center);
	// 	var surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
	// 	var offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
	// 	var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
	// 	palaceTileset.modelMatrix = Matrix4.fromTranslation(translation);
	// 	_viewer.zoomTo(palaceTileset, new HeadingPitchRange(0.5, -0.2, palaceTileset.boundingSphere.radius * 1.0));
	// 	const boundingbox = palaceTileset.boundingSphere;
	// 	cloud(boundingbox);
	// });
	return palaceTileset;
}

export const cloud = (boundingbox: BoundingSphere, viewer: Viewer) => {
	// viewer.entities.add({
	// 	position: boundingbox.center,
	// 	ellipsoid: {
	// 		radii: new Cartesian3(boundingbox.radius, boundingbox.radius, boundingbox.radius),
	// 		innerRadii: new Cartesian3(100, 100, 100), //球从正北0-360
	// 		minimumClock: Math.toRadians(0),
	// 		maximumClock: Math.toRadians(360), //球从上到下0-180
	// 		minimumCone: Math.toRadians(0),
	// 		maximumCone: Math.toRadians(180),
	// 		fill: true, //是否填充
	// 		material: Color.fromCssColorString(`rgba(255,0,0,1)`), //填充颜色,
	// 	},
	// });

	// These noise parameters are set to default, but can be changed
	// to produce different cloud results. However, the noise is precomputed,
	// so this cannot be changed dynamically.
	const cloudCollection = viewer.scene.primitives.add(
		new CloudCollection({
			noiseDetail: 16.0,
			noiseOffset: 0.5,
		})
	);

	const cloudParameters = {
		scaleWithMaximumSize: true,
		scaleX: 6000,
		scaleY: 1200,
		maximumSizeX: 50,
		maximumSizeY: 12,
		maximumSizeZ: 15,
		renderSlice: true, // if false, renders the entire surface of the ellipsoid
		slice: 0.36,
		brightness: 1.0,
	};

	const wgs84 = Cartographic.fromCartesian(boundingbox.center);
	wgs84.height = 1000;
	const position = Cartographic.toCartesian(wgs84);
	const margin = 10000;
	const radius = boundingbox.radius + margin;
	const normal = Cartesian3.normalize(position, new Cartesian3());
	const count = 200;
	const heightDomain = 500;
	const plane = Plane.fromPointNormal(position, normal);

	const frame = Transforms.eastNorthUpToFixedFrame(position);
	const northAxis = Cartesian3.normalize(
		Cartesian3.subtract(
			Plane.projectPointOntoPlane(
				plane,
				Matrix4.multiplyByPoint(frame, new Cartesian3(0, 1, 0), new Cartesian3()),
				new Cartesian3()
			),
			position,
			new Cartesian3()
		),
		new Cartesian3()
	);

	let i = 0;
	const clouds: CumulusCloud[] = [];
	const beginning_pos: Cartesian3[] = [];
	while (i < count) {
		const x = position.x + (window.Math.random() * 2 - 1) * radius;
		const y = position.y + (window.Math.random() * 2 - 1) * radius;
		const z = position.z + (window.Math.random() * 2 - 1) * radius;
		const pos = new Cartesian3(x, y, z);
		const vec = Cartesian3.subtract(pos, position, new Cartesian3());
		const dot = Cartesian3.dot(normal, Cartesian3.normalize(vec, new Cartesian3()));
		const nPos = Cartesian3.add(
			pos,
			Cartesian3.multiplyByScalar(northAxis, 50 * 3, new Cartesian3()),
			new Cartesian3()
		);
		const projectPos = Plane.projectPointOntoPlane(plane, nPos, new Cartesian3());

		if (
			dot >= 0 &&
			Cartesian3.magnitude(vec) * dot < heightDomain &&
			Cartesian3.distance(projectPos, position) < window.Math.sqrt(2 * window.Math.pow(radius, 2))
		) {
			const cloud = cloudCollection.add({
				position: pos,
				scale: new Cartesian2(cloudParameters.scaleX, cloudParameters.scaleY),
				maximumSize: new Cartesian3(
					cloudParameters.maximumSizeX,
					cloudParameters.maximumSizeY,
					cloudParameters.maximumSizeZ
				),
				color: Color.WHITE,
				slice: cloudParameters.renderSlice ? cloudParameters.slice : -1.0,
				brightness: cloudParameters.brightness,
			});

			clouds.push(cloud);
			beginning_pos.push(pos);
			i++;
		}
	}

	viewer.clock.onTick.addEventListener(v => {
		const sunWC = (viewer.scene as any)._context.uniformState.sunPositionWC;
		const brightness = (Cartesian3.dot(sunWC, position) + 1) / 2;

		const speed = 50;
		const kernel = ((v.currentTime.secondsOfDay - v.startTime.secondsOfDay) * speed) / 1000;
		const offset = (kernel - window.Math.floor(kernel)) * 2 - 1;
		clouds.forEach((c, i) => {
			c.brightness = brightness;
			// const pos = c.position.clone();
			const nPos = Cartesian3.add(
				// pos,
				beginning_pos[i],
				// Cartesian3.multiplyByScalar(northAxis, 50, new Cartesian3()),
				Cartesian3.multiplyByScalar(northAxis, offset * radius, new Cartesian3()),
				new Cartesian3()
			);

			const projectPos = Plane.projectPointOntoPlane(plane, nPos, new Cartesian3());

			c.position = nPos;

			// if (Cartesian3.distance(projectPos, position) > window.Math.sqrt(2 * window.Math.pow(radius, 2))) {
			// 	c.position = Cartesian3.add(
			// 		pos,
			// 		Cartesian3.multiplyByScalar(
			// 			Cartesian3.multiplyByScalar(northAxis, -1, new Cartesian3()),
			// 			2 * radius,
			// 			new Cartesian3()
			// 		),
			// 		new Cartesian3()
			// 	);
			// } else {
			// 	c.position = nPos;
			// }

			if (Cartesian3.distance(projectPos, position) > window.Math.sqrt(2 * window.Math.pow(2 * radius, 2))) {
				c.show = false;
			}
		});
	});
};

let _viewer: Viewer;
export const example = (viewer: Viewer, _: GUI) => {
	// const modelURL = './Assets/File/Model/glTF/BoomBox.gltf';
	const modelURL = './Assets/File/Build/build1.glb';
	_viewer = viewer;
	createModel(modelURL, 0);
};
