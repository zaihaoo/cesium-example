import { Cartesian3, Color, ContinuousPoint, NearFarScalar, PointPrimitiveSpriteType, Viewer } from 'cesium';
import { GUI } from 'dat.gui';

export const example = (viewer: Viewer, gui: GUI) => {
	const pos = [
		[121.5821378, 38.9477944],
		[121.5821287, 38.9459086],
		[121.5821011, 38.9455407],
		[121.581976, 38.9452128],
		[121.5817823, 38.9449439],
		[121.5814227, 38.9446158],
		[121.5796277, 38.943061],
		[121.5783708, 38.9419799],
		[121.5764526, 38.9403584],
		[121.5744965, 38.9387969],
		[121.5742507, 38.9385355],
		[121.5741628, 38.9383019],
		[121.5741358, 38.9380031],
		[121.5741897, 38.9377739],
		[121.5743185, 38.9375729],
		[121.5746109, 38.9373121],
		[121.5865814, 38.9282664],
		[121.586866, 38.9280303],
		[121.5871313, 38.9277274],
		[121.5872846, 38.9274432],
		[121.5876332, 38.9267312],
		[121.5877703, 38.9264844],
		[121.5878873, 38.9263237],
		[121.588104, 38.926082],
		[121.5883081, 38.9259449],
		[121.5884884, 38.925846],
		[121.5886761, 38.9257803],
		[121.5892405, 38.9257003],
		[121.5898826, 38.9256666],
		[121.5900136, 38.9256511],
	].map(v => Cartesian3.fromDegrees(v[0], v[1], 50));

	const options = {
		power: false,
		flickerThreshold: false,
		spriteType: PointPrimitiveSpriteType.shineSphere,
		animationSpeed: 60,
		color: new Color(1, 0.435, 0, 0.5).toCssColorString(),
	};

	const pointCollection = viewer.scene.primitives.add(
		ContinuousPoint(interpolate(pos), {
			spriteType: options.spriteType,
			flickerThreshold: options.flickerThreshold,
			pixelSize: 15.0,
			color: Color.fromCssColorString(options.color),
			scaleByDistance: new NearFarScalar(1.5e2, 1, 8.0e5, 0.0),
			animationSpeed: options.animationSpeed,
			show: options.power,
		})
	);

	const folder = gui.addFolder('点云线');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			pointCollection.show = v;
		});
	folder
		.addColor(options, 'color')
		.name('点的颜色')
		.onChange(v => {
			const len = pointCollection.length;
			for (let i = 0; i < len; ++i) {
				const p = pointCollection.get(i);
				p.color = Color.fromCssColorString(v);
			}
		});
	folder
		.add(options, 'flickerThreshold')
		.name('是否闪烁')
		.onChange(v => {
			const len = pointCollection.length;
			for (let i = 0; i < len; ++i) {
				const p = pointCollection.get(i);
				p.flickerThreshold = v;
			}
		});
	folder
		.add(options, 'animationSpeed')
		.name('点动画速度')
		.min(10)
		.max(200)
		.step(5)
		.onChange(v => {
			const len = pointCollection.length;
			for (let i = 0; i < len; ++i) {
				const p = pointCollection.get(i);
				p.animationSpeed = v;
			}
		});
	folder
		.add(options, 'spriteType', {
			shineSphere: PointPrimitiveSpriteType.shineSphere,
			petal: PointPrimitiveSpriteType.petal,
		})
		.name('点的类型')
		.onChange(v => {
			const len = pointCollection.length;
			for (let i = 0; i < len; ++i) {
				const p = pointCollection.get(i);
				p.spriteType = v;
			}
		});
};

/** 插值，两个点之间等距离插值 */
const DISTANCE = 25; // 根据这个距离进行插值

/** 对多个点进行插值*/
function interpolate(points: Cartesian3[]) {
	let interpolatedPoints: Cartesian3[] = [];
	for (let i = 0; i < points.length - 1; i++) {
		let point1 = points[i];
		let point2 = points[i + 1];
		let interpolatedTwoPoints = interpolateTwoPoint(point1, point2);
		interpolatedPoints = interpolatedPoints.concat(interpolatedTwoPoints);
	}
	interpolatedPoints.push(points[points.length - 1]);
	return interpolatedPoints;
}

/** 对两个点进行插值*/
function interpolateTwoPoint(p1: Cartesian3, p2: Cartesian3) {
	let interpolatedPoints: any = [];
	let distance = getDistance(p1, p2);
	let num = parseInt((distance / DISTANCE) as any); // 插几个点 向下取整
	let excess = distance % DISTANCE; // 多出来的距离
	const dir = Cartesian3.normalize(Cartesian3.subtract(p2, p1, new Cartesian3()), new Cartesian3());
	for (let i = 0; i < num; i++) {
		interpolatedPoints.push(getInterpolatePoint(p1, dir, i * DISTANCE));
	}
	if (excess === 0) {
		interpolatedPoints.pop();
	}
	// // 多出来的距离
	// if (excess > 0) {
	// 	interpolatedPoints.push(getInterpolatePoint(p1, dir, num * DISTANCE + excess));
	// }
	return interpolatedPoints;
}

/**  计算两个点之间的距离 */
function getDistance(p1: Cartesian3, p2: Cartesian3) {
	return Cartesian3.distance(p1, p2);
}

/** 根据初始点和角度等计算新的点的位置 */
function getInterpolatePoint(p1: Cartesian3, dir: Cartesian3, distance: number) {
	return Cartesian3.add(p1, Cartesian3.multiplyByScalar(dir, distance, new Cartesian3()), new Cartesian3());
}
