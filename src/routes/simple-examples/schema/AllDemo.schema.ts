import { z } from 'zod';

// Affine
export const AffineObjectSchema = z.object({
	x: z.number(),
	y: z.number(),
	label: z.string()
});
export type AffineObject = z.infer<typeof AffineObjectSchema>;
export const AffineSchema = z.array(AffineObjectSchema);

// Barycentric
export const BarycentricObjectSchema = z.object({
	A: z.number(),
	B: z.number(),
	C: z.number(),
	label: z.string()
});
export type BarycentricObject = z.infer<typeof BarycentricObjectSchema>;
export const BarycentricSchema = z.array(BarycentricObjectSchema);

// Cartesian
export const CartesianObjectSchema = z.object({
	x: z.number(),
	y: z.number()
});
export type CartesianObject = z.infer<typeof CartesianObjectSchema>;
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
export type Feature = z.infer<typeof FeatureSchema>;

// Geographic
export const GeographicObjectSchema = z.object({
	type: z.literal('FeatureCollection'),
	features: z.array(FeatureSchema)
});
export type GeographicObject = z.infer<typeof GeographicObjectSchema>;
export const GeographicSchema = z.array(GeographicObjectSchema);

// Hexbin
export const HexbinObjectSchema = z.object({
	x: z.number(),
	y: z.number()
});
export type HexbinObject = z.infer<typeof HexbinObjectSchema>;
export const HexbinSchema = z.array(HexbinObjectSchema);

// LogPolar
export const LogPolarObjectSchema = z.object({
	r: z.number(),
	theta: z.number()
});
export type LogPolarObject = z.infer<typeof LogPolarObjectSchema>;
export const LogPolarSchema = z.array(LogPolarObjectSchema);

// Oblique
export const ObliqueObjectSchema = z.object({
	x: z.number(),
	y: z.number(),
	label: z.string()
});
export type ObliqueObject = z.infer<typeof ObliqueObjectSchema>;
export const ObliqueSchema = z.array(ObliqueObjectSchema);

// Parallel (Polar)
export const PolarObjectSchema = z.object({
	r: z.number(),
	theta: z.number()
});
export type PolarObject = z.infer<typeof PolarObjectSchema>;
export const ParallelSchema = z.array(PolarObjectSchema);

// Radar
export const RadarObjectSchema = z.object({
	species: z.string(),
	sepal_length: z.number(),
	sepal_width: z.number(),
	petal_length: z.number(),
	petal_width: z.number()
});
export type RadarObject = z.infer<typeof RadarObjectSchema>;
export const RadarSchema = z.array(RadarObjectSchema);

// Spherical
export const SphericalObjectSchema = z.object({
	r: z.number(),
	theta: z.number(),
	phi: z.number(),
	label: z.string()
});
export type SphericalObject = z.infer<typeof SphericalObjectSchema>;
export const SphericalSchema = z.array(SphericalObjectSchema);

// Ternary
export const TernaryObjectSchema = z.object({
	A: z.number(),
	B: z.number(),
	C: z.number(),
	label: z.string()
});
export type TernaryObject = z.infer<typeof TernaryObjectSchema>;
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
