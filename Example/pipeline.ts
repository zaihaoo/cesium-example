import {
	Cartesian2,
	Color,
	getTimestamp,
	Math,
	Cartesian3,
	PolylineArrowsSlideMaterialProperty,
	ColorMaterialProperty,
	MultiClippingPlane,
	Viewer,
	Cartographic,
} from 'cesium';
import { GUI } from 'dat.gui';
let positions: Cartographic[];
let batch_index: number | undefined = undefined;
let batch_time: number;
let pipeline_arrow: number[];
let clip: MultiClippingPlane;
const _loadTestData = () => {
	pipeline_arrow = [
		104.06061172485352, 30.691622364099512, 400, 104.06056880950928, 30.688264036271132, 400, 104.06374454498291,
		30.688337846929571, 400, 104.06383037567137, 30.697157814291458, 400, 104.0710186958313, 30.69704710839882, 400,
		104.07076120376585, 30.688190225556248, 400, 104.07631874084473, 30.686400298443729, 400, 104.08073902130127,
		30.684794871670618, 400, 104.08696174621582, 30.694390128878513, 400, 104.09258365631104, 30.691364035337518,
		-100, 104.09039497375487, 30.688190225556248, 400, 104.0875196456909, 30.689629524317517, 400,
		104.08533096313477, 30.686289580212929, 400, 104.09106016159056, 30.683521583179978, 400, 104.08915042877197,
		30.680661236218103, -100, 104.08354997634888, 30.68355849032903, 400, 104.08108234405518, 30.679849251318913,
		400, 104.07537460327147, 30.682617353621485, 400, 104.07385110855103, 30.679959976934466, 400,
		104.0744948387146, 30.679738525576433, 400, 104.06885147094727, 30.671396821317973, 400, 104.0681219100952,
		30.671729026853139, 400, 104.06837940216063, 30.673832968713747, 400, 104.05807971954346, 30.678520534030415,
		400, 104.05829429626463, 30.656446389991498, -100, 104.05305862426756, 30.649321049788398, 400,
		104.0469217300415, 30.646662757292184, 400, 104.0435743331909, 30.646293544221333, 400, 104.03872489929199,
		30.64422592497429, 400, 104.0386390686035, 30.657553908665772, 400, 104.03816699981689, 30.669182088556568, 400,
		104.03803825378418, 30.676010684831887, 400, 104.03868198394774, 30.678483624955902, 400, 104.04168605804443,
		30.68309714995188, 400, 104.04374599456787, 30.685422283012443, 400, 104.04983997344969, 30.68700924644352, 400,
		104.04889583587646, 30.690662853784424, 400, 104.04820919036865, 30.695054380615961, 400, 104.04404640197752,
		30.70158594586032, 400, 104.04074192047118, 30.705940077083433, 400, 104.03610706329346, 30.712065047663003,
		400, 104.04031276702881, 30.712692281732235, 400, 104.05112743377686, 30.713725364248265, 400,
		104.05262947082518, 30.714278796758435, 400, 104.05584812164305, 30.716935228598953, -100, 104.06370162963867,
		30.707674294968463, 400, 104.0639591217041, 30.696751892064274, 400, 104.06044006347656, 30.69704710839882, 400,
		104.06061172485352, 30.691142610134154, 400,
	];

	positions = [
		{
			lon: 1.81618,
			lat: 0.53587,
		},
		{
			lon: 1.8171,
			lat: 0.5357,
		},
		{
			lon: 1.81634,
			lat: 0.5348,
		},
		{
			lon: 1.8156,
			lat: 0.5349,
		},
	].map(v => new Cartographic(v.lon, v.lat));
};
const _computeCircle = (radius: number) => {
	var positions: any = [];
	for (var i = 0; i < 360; i++) {
		var radians = Math.toRadians(i);
		positions.push(new Cartesian2(radius * window.Math.cos(radians), radius * window.Math.sin(radians)));
	}
	return positions;
};
export const example = async (viewer: Viewer, gui: GUI) => {
	_loadTestData();
	clip = new MultiClippingPlane(viewer.scene);
	// 添加管网
	viewer.entities.add({
		polylineVolume: {
			positions: Cartesian3.fromDegreesArrayHeights(pipeline_arrow),
			shape: _computeCircle(10.0),
			material: new ColorMaterialProperty(Color.GREY.withAlpha(0.8)),
		},
	});

	// 添加流动箭头
	const material = new PolylineArrowsSlideMaterialProperty(new Color(1, 0, 0, 1), 10, 3000);
	const _arrow_entity = viewer.entities.add({
		show: false,
		polyline: {
			positions: Cartesian3.fromDegreesArrayHeights(pipeline_arrow),
			width: 5,
			material: material,
		},
	});

	const options = {
		batch: false,
		arrow: false,
	};
	const folder = gui.addFolder('地下管网');
	folder
		.add(options, 'batch')
		.name('挖出地下管道')
		.listen()
		.onChange(async (v: Boolean) => {
			const ctime = (batch_time = getTimestamp());
			batch_index !== undefined && (await clip.remove(batch_index));
			batch_index = undefined;
			if (v) {
				batch_index = await clip.draw(50, positions);
				if (ctime !== batch_time) {
					await clip.remove(batch_index);
					batch_index = undefined;
				}
			}
		});
	folder
		.add(options, 'arrow')
		.name('是否开启管网流向')
		.onChange((v: Boolean) => {
			v ? (_arrow_entity.show = true) : (_arrow_entity.show = false);
		});
};
