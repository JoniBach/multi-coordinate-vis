import type {
	AffineObject,
	BarycentricObject,
	CartesianObject,
	GeographicObject,
	HexbinObject,
	LogPolarObject,
	ObliqueObject,
	ParallelObject,
	PolarObject,
	RadarObject,
	SphericalObject,
	TernaryObject
} from './coordinate.schema.js';

const affineScale = (data: Array<AffineObject>, config: any) => {};
const barycentricScale = (data: Array<BarycentricObject>, config: any) => {};
const cartesianScale = (data: Array<CartesianObject>, config: any) => {};
const geographicScale = (data: Array<GeographicObject>, config: any) => {};
const hexbinScale = (data: Array<HexbinObject>, config: any) => {};
const logPolarScale = (data: Array<LogPolarObject>, config: any) => {};
const obliqueScale = (data: Array<ObliqueObject>, config: any) => {};
const parallelScale = (data: Array<ParallelObject>, config: any) => {};
const polarScale = (data: Array<PolarObject>, config: any) => {};
const radarScale = (data: Array<RadarObject>, config: any) => {};
const sphericalScale = (data: Array<SphericalObject>, config: any) => {};
const ternaryScale = (data: Array<TernaryObject>, config: any) => {};

export const scales = {
	affine: affineScale,
	barycentric: barycentricScale,
	cartesian: cartesianScale,
	geographic: geographicScale,
	hexbin: hexbinScale,
	logPolar: logPolarScale,
	oblique: obliqueScale,
	parallel: parallelScale,
	polar: polarScale,
	radar: radarScale,
	spherical: sphericalScale,
	ternary: ternaryScale
};
