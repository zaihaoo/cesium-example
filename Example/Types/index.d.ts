/**
 * 经度
 */
export type LON = number;
/**
 * 纬度
 */
export type LAT = number;

/**
 * WGS84坐标类型
 *
 * @param IS_ARRAY 是否为数组
 * @param IS_HEIGHT 是否包含高度
 * @returns WGS84坐标类型
 *
 * @example
 * 1.包含高度的WGS84数组坐标类型
 * ```ts
 * 	WGS84_POSITION<true, true>
 * ```
 * =>
 * ```ts
 * 	[number, number, number]
 * ```
 * 2.包含高度的WGS84对象坐标类型
 * ```ts
 * 	WGS84_POSITION<false, true>
 * ```
 * =>
 * ```ts
 * 	{ lon: number, lat: number, height: number };
 * ```
 */

export type WGS84_POSITION<IS_ARRAY extends boolean, IS_HEIGHT extends boolean> = IS_ARRAY extends true
	? IS_HEIGHT extends true
		? [LON, LAT, number]
		: [LON, LAT]
	: IS_HEIGHT extends true
	? {
			lon: LON;
			lat: LAT;
			height: number;
	  }
	: {
			lon: LON;
			lat: LAT;
	  };
