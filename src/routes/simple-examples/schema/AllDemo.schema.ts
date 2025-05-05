import { z } from 'zod';

// Affine
export const AffineObjectSchema = z.object({
	x: z.number(),
	y: z.number(),
	label: z.string()
});
export const AffineRemapSchema = z.object({
	x: z.string(),
	y: z.string(),
	label: z.string()
});
export type AffineObject = z.infer<typeof AffineObjectSchema>;
export type AffineRemap = z.infer<typeof AffineRemapSchema>;
export const AffineSchema = z.array(AffineObjectSchema);

// Barycentric
export const BarycentricObjectSchema = z.object({
	A: z.number(),
	B: z.number(),
	C: z.number(),
	label: z.string()
});
export const BarycentricRemapSchema = z.object({
	A: z.string(),
	B: z.string(),
	C: z.string(),
	label: z.string()
});
export type BarycentricObject = z.infer<typeof BarycentricObjectSchema>;
export type BarycentricRemap = z.infer<typeof BarycentricRemapSchema>;
export const BarycentricSchema = z.array(BarycentricObjectSchema);

// Cartesian
export const CartesianObjectSchema = z.object({
	x: z.number(),
	y: z.number()
});
export const CartesianRemapSchema = z.object({
	x: z.string(),
	y: z.string()
});
export type CartesianObject = z.infer<typeof CartesianObjectSchema>;
export type CartesianRemap = z.infer<typeof CartesianRemapSchema>;
export const CartesianSchema = z.array(CartesianObjectSchema);

// Feature (for Geographic)
export const FeatureSchema = z.object({
	type: z.literal('Feature'),
	geometry: z.object({
		type: z.literal('Point'),
		coordinates: z.tuple([z.number(), z.number()])
	}),
	properties: z.object({
		name: z.string()
	})
});
export const FeatureRemapSchema = z.object({
	latitude: z.string(),
	longitude: z.string(),
	name: z.string()
});
export type Feature = z.infer<typeof FeatureSchema>;
export type FeatureRemap = z.infer<typeof FeatureRemapSchema>;

// Geographic
export const GeographicObjectSchema = z.object({
	type: z.literal('FeatureCollection'),
	features: z.array(FeatureSchema)
});
export const GeographicRemapSchema = z.object({
	features: z.array(FeatureRemapSchema)
});
export type GeographicObject = z.infer<typeof GeographicObjectSchema>;
export type GeographicRemap = z.infer<typeof GeographicRemapSchema>;
export const GeographicSchema = z.array(GeographicObjectSchema);

// Hexbin
export const HexbinObjectSchema = z.object({
	x: z.number(),
	y: z.number()
});
export const HexbinRemapSchema = z.object({
	x: z.string(),
	y: z.string()
});
export type HexbinObject = z.infer<typeof HexbinObjectSchema>;
export type HexbinRemap = z.infer<typeof HexbinRemapSchema>;
export const HexbinSchema = z.array(HexbinObjectSchema);

// LogPolar
export const LogPolarObjectSchema = z.object({
	r: z.number(),
	theta: z.number()
});
export const LogPolarRemapSchema = z.object({
	r: z.string(),
	theta: z.string()
});
export type LogPolarObject = z.infer<typeof LogPolarObjectSchema>;
export type LogPolarRemap = z.infer<typeof LogPolarRemapSchema>;
export const LogPolarSchema = z.array(LogPolarObjectSchema);

// Oblique
export const ObliqueObjectSchema = z.object({
	x: z.number(),
	y: z.number(),
	label: z.string()
});
export const ObliqueRemapSchema = z.object({
	x: z.string(),
	y: z.string(),
	label: z.string()
});
export type ObliqueObject = z.infer<typeof ObliqueObjectSchema>;
export type ObliqueRemap = z.infer<typeof ObliqueRemapSchema>;
export const ObliqueSchema = z.array(ObliqueObjectSchema);

// Parallel (Polar)
export const PolarObjectSchema = z.object({
	r: z.number(),
	theta: z.number()
});
export const PolarRemapSchema = z.object({
	r: z.string(),
	theta: z.string()
});
export type PolarObject = z.infer<typeof PolarObjectSchema>;
export type PolarRemap = z.infer<typeof PolarRemapSchema>;
export const ParallelSchema = z.array(PolarObjectSchema);

// Radar
export const RadarObjectSchema = z.object({
	species: z.string(),
	sepal_length: z.number(),
	sepal_width: z.number(),
	petal_length: z.number(),
	petal_width: z.number()
});
export const RadarRemapSchema = z.object({
	species: z.string(),
	sepal_length: z.string(),
	sepal_width: z.string(),
	petal_length: z.string(),
	petal_width: z.string()
});
export type RadarObject = z.infer<typeof RadarObjectSchema>;
export type RadarRemap = z.infer<typeof RadarRemapSchema>;
export const RadarSchema = z.array(RadarObjectSchema);

// Spherical
export const SphericalObjectSchema = z.object({
	r: z.number(),
	theta: z.number(),
	phi: z.number(),
	label: z.string()
});
export const SphericalRemapSchema = z.object({
	r: z.string(),
	theta: z.string(),
	phi: z.string(),
	label: z.string()
});
export type SphericalObject = z.infer<typeof SphericalObjectSchema>;
export type SphericalRemap = z.infer<typeof SphericalRemapSchema>;
export const SphericalSchema = z.array(SphericalObjectSchema);

// Ternary
export const TernaryObjectSchema = z.object({
	A: z.number(),
	B: z.number(),
	C: z.number(),
	label: z.string()
});
export const TernaryRemapSchema = z.object({
	A: z.string(),
	B: z.string(),
	C: z.string(),
	label: z.string()
});
export type TernaryObject = z.infer<typeof TernaryObjectSchema>;
export type TernaryRemap = z.infer<typeof TernaryRemapSchema>;
export const TernarySchema = z.array(TernaryObjectSchema);

// Unified schema object
export const coordinateSchema = {
	affine: AffineSchema,
	barycentric: BarycentricSchema,
	cartesian: CartesianSchema,
	geographic: GeographicSchema,
	hexbin: HexbinSchema,
	logPolar: LogPolarSchema,
	oblique: ObliqueSchema,
	parallel: ParallelSchema,
	radar: RadarSchema,
	spherical: SphericalSchema,
	ternary: TernarySchema
};

const toAffine = (userData: Array<unknown>, inputSchemaConfiguration: AffineRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = AffineObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toBarycentric = (userData: Array<unknown>, inputSchemaConfiguration: BarycentricRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = BarycentricObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toCartesian = (userData: Array<unknown>, inputSchemaConfiguration: CartesianRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = CartesianObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toGeographic = (userData: Array<unknown>, inputSchemaConfiguration: GeographicRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = GeographicObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toHexbin = (userData: Array<unknown>, inputSchemaConfiguration: HexbinRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = HexbinObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toLogPolar = (userData: Array<unknown>, inputSchemaConfiguration: LogPolarRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = LogPolarObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toOblique = (userData: Array<unknown>, inputSchemaConfiguration: ObliqueRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = ObliqueObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toParallel = (userData: Array<unknown>, inputSchemaConfiguration: PolarRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = PolarObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toRadar = (userData: Array<unknown>, inputSchemaConfiguration: RadarRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = RadarObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toSpherical = (userData: Array<unknown>, inputSchemaConfiguration: SphericalRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = SphericalObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};
const toTernary = (userData: Array<unknown>, inputSchemaConfiguration: TernaryRemap) => {
	// handle remap
	const remappeUserData = userData;
	const validatedRemapData = TernaryObjectSchema.safeParse(remappeUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid data:', validatedRemapData.error);
		return [];
	}
};

export const coordinateMapping = {
	affine: toAffine,
	barycentric: toBarycentric,
	cartesian: toCartesian,
	geographic: toGeographic,
	hexbin: toHexbin,
	logPolar: toLogPolar,
	oblique: toOblique,
	parallel: toParallel,
	radar: toRadar,
	spherical: toSpherical,
	ternary: toTernary
};
