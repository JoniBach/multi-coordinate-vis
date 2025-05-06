import { z, ZodError } from 'zod';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const SupportedTypeSchema = z.enum([
	// basics
	'number',
	'string',
	'boolean',
	// date
	'date', // "Mon May 06 2025 14:42:10 GMT+0100 (British Summer Time)"
	'date_iso', // "2025-05-06T14:35:00Z"
	'date_only', // "2025-05-06"
	'date_time', // "2025-05-06T14:35:00"
	'date_unix_s', // 1715066100
	'date_unix_ms' // 1715066100000
]);

export type SupportedType = z.infer<typeof SupportedTypeSchema>;

export const SupportedTypeMap = {
	// basics
	number: z.number(),
	string: z.string(),
	boolean: z.boolean(),
	// date
	date: z.date(),
	date_iso: z.date().refine((v) => v instanceof Date && v.toISOString() === v.toISOString(), {
		message: "Expected a date in format 'YYYY-MM-DDTHH:mm:ss.sssZ'"
	}),
	date_only: z
		.date()
		.refine(
			(v) => v instanceof Date && v.toISOString().split('T')[0] === v.toISOString().split('T')[0],
			{
				message: "Expected a date in format 'YYYY-MM-DD'"
			}
		),
	date_time: z
		.date()
		.refine(
			(v) =>
				v instanceof Date &&
				v.toISOString().split('T')[0] === v.toISOString().split('T')[0] &&
				v.getHours() === 0 &&
				v.getMinutes() === 0 &&
				v.getSeconds() === 0,
			{
				message: "Expected a date in format 'YYYY-MM-DD 00:00:00'"
			}
		),
	date_unix_s: z.number().refine((v) => Number.isInteger(v / 1000), {
		message: 'Expected a unix timestamp in milliseconds'
	}),
	date_unix_ms: z.number().refine((v) => Number.isInteger(v), {
		message: 'Expected a unix timestamp in seconds'
	})
};

export const DataTypeSchema = z.union([
	// basics
	SupportedTypeMap.number,
	SupportedTypeMap.string,
	SupportedTypeMap.boolean,
	// date
	SupportedTypeMap.date,
	SupportedTypeMap.date_iso,
	SupportedTypeMap.date_only,
	SupportedTypeMap.date_time,
	SupportedTypeMap.date_unix_s,
	SupportedTypeMap.date_unix_ms
]);

export type DataType = z.infer<typeof DataTypeSchema>;

export const CoordinateObjectSchema = z.object({
	key: z.string(), // The key of the coordinate
	type: SupportedTypeSchema, // The data type of the coordinate's value
	label: z.string() // The label of the coordinate
});

// Affine
export const AffineObjectSchema = z.object({
	x: DataTypeSchema,
	y: DataTypeSchema
});
export const AffineRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema
});
export type AffineObject = z.infer<typeof AffineObjectSchema>;
export type AffineRemap = z.infer<typeof AffineRemapSchema>;
export const AffineSchema = z.array(AffineObjectSchema);

// Barycentric
export const BarycentricObjectSchema = z.object({
	A: z.number(),
	B: z.number(),
	C: z.number()
});
export const BarycentricRemapSchema = z.object({
	A: CoordinateObjectSchema,
	B: CoordinateObjectSchema,
	C: CoordinateObjectSchema
});
export type BarycentricObject = z.infer<typeof BarycentricObjectSchema>;
export type BarycentricRemap = z.infer<typeof BarycentricRemapSchema>;
export const BarycentricSchema = z.array(BarycentricObjectSchema);

// Cartesian
export const CartesianObjectSchema = z.object({
	x: DataTypeSchema,
	y: DataTypeSchema
});
export const CartesianRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema
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
	latitude: CoordinateObjectSchema,
	longitude: CoordinateObjectSchema,
	name: CoordinateObjectSchema
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
	x: DataTypeSchema,
	y: DataTypeSchema
});
export const HexbinRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema
});
export type HexbinObject = z.infer<typeof HexbinObjectSchema>;
export type HexbinRemap = z.infer<typeof HexbinRemapSchema>;
export const HexbinSchema = z.array(HexbinObjectSchema);

// LogPolar
export const LogPolarObjectSchema = z.object({
	r: DataTypeSchema,
	theta: DataTypeSchema
});
export const LogPolarRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema
});
export type LogPolarObject = z.infer<typeof LogPolarObjectSchema>;
export type LogPolarRemap = z.infer<typeof LogPolarRemapSchema>;
export const LogPolarSchema = z.array(LogPolarObjectSchema);

// Oblique
export const ObliqueObjectSchema = z.object({
	x: DataTypeSchema,
	y: DataTypeSchema
});
export const ObliqueRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema
});
export type ObliqueObject = z.infer<typeof ObliqueObjectSchema>;
export type ObliqueRemap = z.infer<typeof ObliqueRemapSchema>;
export const ObliqueSchema = z.array(ObliqueObjectSchema);

// Parallel (Polar)
export const PolarObjectSchema = z.object({
	r: DataTypeSchema,
	theta: DataTypeSchema
});
export const PolarRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema
});
export type PolarObject = z.infer<typeof PolarObjectSchema>;
export type PolarRemap = z.infer<typeof PolarRemapSchema>;
export const PolarSchema = z.array(PolarObjectSchema);

// Parallel
export const ParallelObjectSchema = z.object({
	r: DataTypeSchema,
	theta: DataTypeSchema
});
export const ParallelRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema
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
	sepal_length: CoordinateObjectSchema,
	sepal_width: CoordinateObjectSchema,
	petal_length: CoordinateObjectSchema,
	petal_width: CoordinateObjectSchema
});
export type RadarObject = z.infer<typeof RadarObjectSchema>;
export type RadarRemap = z.infer<typeof RadarRemapSchema>;
export const RadarSchema = z.array(RadarObjectSchema);

// Spherical
export const SphericalObjectSchema = z.object({
	r: DataTypeSchema,
	theta: DataTypeSchema,
	phi: DataTypeSchema
});
export const SphericalRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	phi: CoordinateObjectSchema
});
export type SphericalObject = z.infer<typeof SphericalObjectSchema>;
export type SphericalRemap = z.infer<typeof SphericalRemapSchema>;
export const SphericalSchema = z.array(SphericalObjectSchema);

// Ternary
export const TernaryObjectSchema = z.object({
	A: DataTypeSchema,
	B: DataTypeSchema,
	C: DataTypeSchema
});
export const TernaryRemapSchema = z.object({
	A: CoordinateObjectSchema,
	B: CoordinateObjectSchema,
	C: CoordinateObjectSchema
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
function remapData<T>(userData: Array<unknown>, remap: InputSchemaConfiguration): T[] {
	return userData.map((item) => {
		const mapped: Record<string, unknown> = {};
		for (const [outKey, config] of Object.entries(remap)) {
			// If config is a CoordinateObjectSchema, extract by its key
			if (typeof config === 'object' && 'key' in config) {
				mapped[outKey] = _.get(item, config.key);
			} else {
				// Fallback to previous behavior if needed
				mapped[outKey] = _.get(item, config);
			}
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

export const ConfigSchema = z.object({
	height: z.number().positive().int(),
	width: z.number().positive().int(),
	margin: z.number().positive().int(),
	skewX: z.number().int().optional().nullable(),
	skewY: z.number().int().optional().nullable()
});

export type Config = z.infer<typeof ConfigSchema>;

export interface LoadedSystem {
	uuid: string;
	valid: {
		validCoordinateType: boolean;
		validOriginalUserData: boolean;
		validUserInputSchemaConfiguration: boolean;
		validRemapData: boolean;
	};
	error?: { name: string; zodError?: ZodError };
	data: Array<unknown>;
	success: boolean;
	loading: boolean;
	config: Config;
}

export interface UnloadedSystem {
	loading: boolean;
	success: boolean;
}

export type System = LoadedSystem | UnloadedSystem;
export type InputSchemaConfiguration =
	| z.infer<typeof AffineRemapSchema>
	| z.infer<typeof BarycentricRemapSchema>
	| z.infer<typeof CartesianRemapSchema>
	| z.infer<typeof GeographicRemapSchema>
	| z.infer<typeof HexbinRemapSchema>
	| z.infer<typeof LogPolarRemapSchema>
	| z.infer<typeof ObliqueRemapSchema>
	| z.infer<typeof ParallelRemapSchema>
	| z.infer<typeof PolarRemapSchema>
	| z.infer<typeof RadarRemapSchema>
	| z.infer<typeof SphericalRemapSchema>
	| z.infer<typeof TernaryRemapSchema>;

export const createSystem = (
	coordinateType: CoordinateType,
	userData: Array<unknown>,
	inputSchemaConfiguration: InputSchemaConfiguration,
	config: Config
): System => {
	const loading = true;
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

	const uuid = uuidv4();
	const validatedCoordinateType = CoordinateTypeSchema.safeParse(coordinateType);
	if (!validatedCoordinateType.success) {
		console.error('Invalid coordinate type', validatedCoordinateType.error);
		error.name = 'Invalid coordinate type';
		error.zodError = validatedCoordinateType.error;
		return { uuid, data: [], valid, error, success: false, loading };
	}
	valid.validCoordinateType = true;
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
		error.name = 'Invalid user data';
		error.zodError = validateOriginalUserData.error;
		return { uuid, data: [], valid, error, success: false, loading };
	}
	valid.validOriginalUserData = true;
	const validatedUserInputSchemaConfiguration =
		remapSchema[validatedCoordinateType.data].safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		error.name = 'Invalid schema configuration';
		error.zodError = validatedUserInputSchemaConfiguration.error;
		return { uuid, data: [], valid, error, success: false, loading };
	}
	valid.validUserInputSchemaConfiguration = true;
	const remappedUserData = remapData(userData, inputSchemaConfiguration);
	const validatedRemapData =
		coordinateSchema[validatedCoordinateType.data].safeParse(remappedUserData);
	if (!validatedRemapData.success) {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		error.name = 'Invalid coordinate data (after remap)';
		error.zodError = validatedRemapData.error;
		return { uuid, data: [], valid, error, success: false, loading };
	}
	valid.validRemapData = true;
	return {
		uuid,
		data: validatedRemapData.data,
		valid,
		success: true,
		loading: false,
		config
	};
};
