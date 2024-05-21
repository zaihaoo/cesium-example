import {
	Cartesian3,
	Color,
	CompositeProperty,
	ConstantProperty,
	JulianDate,
	SampledPositionProperty,
	SampledProperty,
	TimeInterval,
	Viewer,
	Entity,
	LerpByHeightAndColorMaterialProperty,
} from 'cesium';
import { GUI } from 'dat.gui';

function _createBox(
	lng: number,
	lat: number,
	bottom: number,
	top: number,
	second: number,
	bottomColor: Color,
	topColor: Color
) {
	const property = new SampledProperty(Cartesian3);
	const constProperty = new ConstantProperty(new Cartesian3(500, 500, top));

	const now = JulianDate.now();
	const end = JulianDate.addSeconds(now, second, new JulianDate());
	property.addSample(now, new Cartesian3(500.0, 500.0, bottom));

	property.addSample(end, new Cartesian3(500, 500, top));

	const compositeProperty = new CompositeProperty();
	compositeProperty.intervals.addInterval(
		new TimeInterval({
			start: now,
			stop: end,
			data: property,
		})
	);

	compositeProperty.intervals.addInterval(
		new TimeInterval({
			start: end,
			stop: JulianDate.addDays(end, 1, new JulianDate()),
			data: constProperty,
		})
	);

	const positionProperty = new SampledPositionProperty();
	const constPositionProperty = new ConstantProperty(Cartesian3.fromDegrees(lng, lat, top / 2));
	positionProperty.addSample(now, Cartesian3.fromDegrees(lng, lat, bottom / 2));

	positionProperty.addSample(end, Cartesian3.fromDegrees(lng, lat, top / 2));

	const compositePositionProperty = new CompositeProperty();
	compositePositionProperty.intervals.addInterval(
		new TimeInterval({
			start: now,
			stop: end,
			data: positionProperty,
		})
	);

	compositePositionProperty.intervals.addInterval(
		new TimeInterval({
			start: end,
			stop: JulianDate.addDays(end, 1, new JulianDate()),
			data: constPositionProperty,
		})
	);

	// 创建盒子
	const blueBox = {
		position: compositePositionProperty,
		box: {
			// 设置box的长宽高
			dimensions: compositeProperty,
			// 设置box的颜色
			material: new LerpByHeightAndColorMaterialProperty({
				height: 5000,
				topColor: topColor,
				bottomColor: bottomColor,
			}),
		},
	};

	return new Entity(blueBox as any);
}

export const example = (viewer: Viewer, gui: GUI) => {
	const options = { power: false };
	let entity: Entity;

	const folder = gui.addFolder('动态box');
	folder
		.add(options, 'power')
		.name('是否开启')
		.onChange(v => {
			if (v) {
				entity = _createBox(121.58, 38.91, 0, 10000, 10, new Color(0, 0.5, 0.8, 1), new Color(0.8, 0.2, 0, 1));
				viewer.entities.add(entity);
			} else {
				entity && viewer.entities.remove(entity);
			}
		});
};
