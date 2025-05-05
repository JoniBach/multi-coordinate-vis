import { z, ZodError } from 'zod';
import _ from 'lodash';

// Affine
export const AffineObjectSchema = z.object({
	x: z.union([z.number(), z.string()]),
	y: z.union([z.number(), z.string()]),
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
	x: z.union([z.number(), z.string()]),
	y: z.union([z.number(), z.string()])
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
	x: z.union([z.number(), z.string()]),
	y: z.union([z.number(), z.string()])
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
	r: z.union([z.number(), z.string()]),
	theta: z.union([z.number(), z.string()])
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
	x: z.union([z.number(), z.string()]),
	y: z.union([z.number(), z.string()]),
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
	r: z.union([z.number(), z.string()]),
	theta: z.union([z.number(), z.string()])
});
export const PolarRemapSchema = z.object({
	r: z.string(),
	theta: z.string()
});
export type PolarObject = z.infer<typeof PolarObjectSchema>;
export type PolarRemap = z.infer<typeof PolarRemapSchema>;
export const PolarSchema = z.array(PolarObjectSchema);

// Parallel
export const ParallelObjectSchema = z.object({
	r: z.union([z.number(), z.string()]),
	theta: z.union([z.number(), z.string()])
});
export const ParallelRemapSchema = z.object({
	r: z.string(),
	theta: z.string()
});
export type ParallelObject = z.infer<typeof ParallelObjectSchema>;
export type ParallelRemap = z.infer<typeof ParallelRemapSchema>;
export const ParallelSchema = z.array(ParallelObjectSchema);

// Radar
export const RadarObjectSchema = z.object({
	species: z.string(),
	sepal_length: z.union([z.number(), z.string()]),
	sepal_width: z.union([z.number(), z.string()]),
	petal_length: z.union([z.number(), z.string()]),
	petal_width: z.union([z.number(), z.string()])
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
	polar: PolarSchema,
	radar: RadarSchema,
	spherical: SphericalSchema,
	ternary: TernarySchema
};

export const remapSchema = {
	affine: AffineRemapSchema,
	barycentric: BarycentricRemapSchema,
	cartesian: CartesianRemapSchema,
	geographic: GeographicRemapSchema,
	hexbin: HexbinRemapSchema,
	logPolar: LogPolarRemapSchema,
	oblique: ObliqueRemapSchema,
	parallel: ParallelRemapSchema,
	polar: PolarRemapSchema,
	radar: RadarRemapSchema,
	spherical: SphericalRemapSchema,
	ternary: TernaryRemapSchema
};

export const UserDataTableSchema = z.array(z.unknown());

// Remap utility
function remapData<T>(userData: Array<unknown>, remap: Record<string, string>): T[] {
	return userData.map((item) => {
		const mapped: Record<string, unknown> = {};
		for (const [outKey, inPath] of Object.entries(remap)) {
			mapped[outKey] = _.get(item, inPath);
		}
		return mapped as T;
	});
}

export const CoordinateTypeSchema = z.enum([
	'affine',
	'barycentric',
	'cartesian',
	'geographic',
	'hexbin',
	'logPolar',
	'oblique',
	'parallel',
	'polar',
	'radar',
	'spherical',
	'ternary'
]);
export type CoordinateType = z.infer<typeof CoordinateTypeSchema>;

export const processData = (
	coordinateType: CoordinateType,
	userData: Array<unknown>,
	inputSchemaConfiguration: Record<string, string>
) => {
	const valid = {
		validCoordinateType: false,
		validOriginalUserData: false,
		validUserInputSchemaConfiguration: false,
		validRemapData: false
	};
	const error: { name: string; zodError?: ZodError } = {
		name: '',
		zodError: undefined
	};

	const validatedCoordinateType = CoordinateTypeSchema.safeParse(coordinateType);
	if (!validatedCoordinateType.success) {
		console.error('Invalid coordinate type', validatedCoordinateType.error);
		error.name = 'Invalid coordinate type';
		error.zodError = validatedCoordinateType.error;
		return { data: [], valid, error, success: false };
	}
	valid.validCoordinateType = true;
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
		error.name = 'Invalid user data';
		error.zodError = validateOriginalUserData.error;
		return { data: [], valid, error, success: false };
	}
	valid.validOriginalUserData = true;
	const validatedUserInputSchemaConfiguration =
		remapSchema[validatedCoordinateType.data].safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		error.name = 'Invalid schema configuration';
		error.zodError = validatedUserInputSchemaConfiguration.error;
		return { data: [], valid, error, success: false };
	}
	valid.validUserInputSchemaConfiguration = true;
	const remappedUserData = remapData(userData, inputSchemaConfiguration);
	const validatedRemapData =
		coordinateSchema[validatedCoordinateType.data].safeParse(remappedUserData);
	if (!validatedRemapData.success) {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		error.name = 'Invalid coordinate data (after remap)';
		error.zodError = validatedRemapData.error;
		return { data: [], valid, error, success: false };
	}
	valid.validRemapData = true;
	return {
		data: validatedRemapData.data,
		valid,
		success: true
	};
};
