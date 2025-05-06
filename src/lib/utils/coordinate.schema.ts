import { z, ZodError } from 'zod';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
	isValid,
	isDate,
	parseISO,
	format,
	isWithinInterval,
	startOfDay,
	endOfDay
} from 'date-fns';

export const SupportedTypeSchema = z.enum([
	'any',
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

export const numberSchema = z.number();
export const stringSchema = z.string();
export const booleanSchema = z.boolean();
export const dateSchema = z.date();
export const date_isoSchema = z
	.string()
	.refine(
		(v, ctx?) => {
			const parsed = parseISO(v);
			const isValidDate = isValid(parsed);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: "Expected a date in format 'YYYY-MM-DDTHH:mm:ss.sssZ'"
				});
				return isValidDate;
			}

			return true;
		},
		{ message: "Expected a date in format 'YYYY-MM-DDTHH:mm:ss.sssZ'" }
	)
	.transform((v) => parseISO(v));

export const date_onlySchema = z
	.string()
	.refine(
		(v, ctx?) => {
			const parsed = parseISO(v);
			const isValidDate = isValid(parsed);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: "Expected a date in format 'YYYY-MM-DD'"
				});
				return isValidDate;
			}

			return true;
		},
		{ message: "Expected a date in format 'YYYY-MM-DD'" }
	)
	.transform((v) => parseISO(v));

export const date_timeSchema = z
	.string()
	.refine(
		(v, ctx?) => {
			const parsed = parseISO(v);
			const isValidDate = isValid(parsed);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: "Expected a date in format 'YYYY-MM-DD 00:00:00'"
				});
				return isValidDate;
			}

			return true;
		},
		{ message: "Expected a date in format 'YYYY-MM-DD 00:00:00'" }
	)
	.transform((v) => parseISO(v));

export const date_unix_sSchema = z
	.number()
	.refine(
		(v, ctx?) => {
			const date = new Date(v * 1000);
			const isValidDate = isValid(date);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: 'Expected a valid unix timestamp in seconds'
				});
				return isValidDate;
			}

			return true;
		},
		{ message: 'Expected a valid unix timestamp in seconds' }
	)
	.transform((v) => new Date(v * 1000));

export const date_unix_msSchema = z
	.number()
	.refine(
		(v, ctx?) => {
			const date = new Date(v);
			const isValidDate = isValid(date);

			if (!isValidDate) {
				ctx?.addIssue?.({
					code: 'custom',
					message: 'Expected a valid unix timestamp in milliseconds'
				});
				return isValidDate;
			}

			return true;
		},
		{ message: 'Expected a valid unix timestamp in milliseconds' }
	)
	.transform((v) => new Date(v));
export type NumberSchema = z.infer<typeof numberSchema>;
export type StringSchema = z.infer<typeof stringSchema>;
export type BooleanSchema = z.infer<typeof booleanSchema>;
export type DateSchema = z.infer<typeof dateSchema>;
export type DateIsoSchema = z.infer<typeof date_isoSchema>;
export type DateOnlySchema = z.infer<typeof date_onlySchema>;
export type DateTimeSchema = z.infer<typeof date_timeSchema>;
export type DateUnixSSchema = z.infer<typeof date_unix_sSchema>;
export type DateUnixMSchema = z.infer<typeof date_unix_msSchema>;

const isoToDate = (iso: string) => new Date(iso);
const dateOnlyToDate = (dateOnly: string) => new Date(dateOnly);
const dateTimeToDate = (dateTime: string) => new Date(dateTime);
const unixSToDate = (unixS: number) => new Date(unixS * 1000);
const unixMsToDate = (unixM: number) => new Date(unixM);

export const DataTypeSchema = z.union([
	// basics
	numberSchema,
	stringSchema,
	booleanSchema,
	// date
	dateSchema,
	date_isoSchema,
	date_onlySchema,
	date_timeSchema,
	date_unix_sSchema,
	date_unix_msSchema
]);

export const SupportedTypeMap = {
	any: DataTypeSchema,
	// basics
	number: numberSchema,
	string: stringSchema,
	boolean: booleanSchema,
	// date
	date: dateSchema,
	date_iso: date_isoSchema,
	date_only: date_onlySchema,
	date_time: date_timeSchema,
	date_unix_s: date_unix_sSchema,
	date_unix_ms: date_unix_msSchema
};

export type DataType = z.infer<typeof DataTypeSchema>;

export const CoordinateObjectSchema = z.object({
	key: z.string(), // The key of the coordinate
	type: SupportedTypeSchema, // The data type of the coordinate's value
	label: z.string() // The label of the coordinate
});
// Affine
export const AffineRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const AffineObjectSchema = (dataPointType: AffineRemap) =>
	z.object({
		x: SupportedTypeMap[dataPointType.x.type],
		y: SupportedTypeMap[dataPointType.y.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const AffineSchema = (dataPointType: AffineRemap) =>
	z.array(AffineObjectSchema(dataPointType));

export type AffineObject = z.infer<ReturnType<typeof AffineObjectSchema>>;
export type AffineRemap = z.infer<typeof AffineRemapSchema>;

// Barycentric
export const BarycentricObjectSchema = (dataPointType: BarycentricRemap) =>
	z.object({
		A: SupportedTypeMap[dataPointType.A.type],
		B: SupportedTypeMap[dataPointType.B.type],
		C: SupportedTypeMap[dataPointType.C.type]
	});
export const BarycentricRemapSchema = z.object({
	A: CoordinateObjectSchema,
	B: CoordinateObjectSchema,
	C: CoordinateObjectSchema
});
export const BarycentricSchema = (dataPointType: BarycentricRemap) =>
	z.array(BarycentricObjectSchema(dataPointType));

export type BarycentricObject = z.infer<ReturnType<typeof BarycentricObjectSchema>>;
export type BarycentricRemap = z.infer<typeof BarycentricRemapSchema>;

// Cartesian
export const CartesianObjectSchema = (dataPointType: CartesianRemap) =>
	z.object({
		x: SupportedTypeMap[dataPointType.x.type],
		y: SupportedTypeMap[dataPointType.y.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const CartesianRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const CartesianSchema = (dataPointType: CartesianRemap) =>
	z.array(CartesianObjectSchema(dataPointType));

export type CartesianObject = z.infer<ReturnType<typeof CartesianObjectSchema>>;
export type CartesianRemap = z.infer<typeof CartesianRemapSchema>;

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
export const GeographicObjectSchema = (dataPointType: FeatureRemap) =>
	z.object({
		type: z.literal('FeatureCollection'),
		features: z.array(FeatureSchema)
	});

export const GeographicRemapSchema = z.object({
	features: z.array(FeatureRemapSchema)
});

export const GeographicSchema = (dataPointType: FeatureRemap) =>
	z.array(GeographicObjectSchema(dataPointType));

export type GeographicObject = z.infer<ReturnType<typeof GeographicObjectSchema>>;
export type GeographicRemap = z.infer<typeof GeographicRemapSchema>;

// Hexbin
export const HexbinObjectSchema = (dataPointType: HexbinRemap) =>
	z.object({
		x: SupportedTypeMap[dataPointType.x.type],
		y: SupportedTypeMap[dataPointType.y.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const HexbinRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const HexbinSchema = (dataPointType: HexbinRemap) =>
	z.array(HexbinObjectSchema(dataPointType));

export type HexbinObject = z.infer<ReturnType<typeof HexbinObjectSchema>>;
export type HexbinRemap = z.infer<typeof HexbinRemapSchema>;

// LogPolar
export const LogPolarObjectSchema = (dataPointType: LogPolarRemap) =>
	z.object({
		r: SupportedTypeMap[dataPointType.r.type],
		theta: SupportedTypeMap[dataPointType.theta.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const LogPolarRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const LogPolarSchema = (dataPointType: LogPolarRemap) =>
	z.array(LogPolarObjectSchema(dataPointType));

export type LogPolarObject = z.infer<ReturnType<typeof LogPolarObjectSchema>>;
export type LogPolarRemap = z.infer<typeof LogPolarRemapSchema>;

// Oblique
export const ObliqueObjectSchema = (dataPointType: ObliqueRemap) =>
	z.object({
		x: SupportedTypeMap[dataPointType.x.type],
		y: SupportedTypeMap[dataPointType.y.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const ObliqueRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const ObliqueSchema = (dataPointType: ObliqueRemap) =>
	z.array(ObliqueObjectSchema(dataPointType));

export type ObliqueObject = z.infer<ReturnType<typeof ObliqueObjectSchema>>;
export type ObliqueRemap = z.infer<typeof ObliqueRemapSchema>;

// Polar
export const PolarObjectSchema = (dataPointType: PolarRemap) =>
	z.object({
		r: SupportedTypeMap[dataPointType.r.type],
		theta: SupportedTypeMap[dataPointType.theta.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const PolarRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const PolarSchema = (dataPointType: PolarRemap) => z.array(PolarObjectSchema(dataPointType));

export type PolarObject = z.infer<ReturnType<typeof PolarObjectSchema>>;
export type PolarRemap = z.infer<typeof PolarRemapSchema>;

// Radar
export const RadarObjectSchema = (dataPointType: RadarRemap) =>
	z.object({
		species: z.string(),
		sepal_length: z.union([SupportedTypeMap[dataPointType.sepal_length.type], z.string()]),
		sepal_width: z.union([SupportedTypeMap[dataPointType.sepal_width.type], z.string()]),
		petal_length: z.union([SupportedTypeMap[dataPointType.petal_length.type], z.string()]),
		petal_width: z.union([SupportedTypeMap[dataPointType], z.string()])
	});

export const RadarRemapSchema = z.object({
	species: z.string(),
	sepal_length: CoordinateObjectSchema,
	sepal_width: CoordinateObjectSchema,
	petal_length: CoordinateObjectSchema,
	petal_width: CoordinateObjectSchema
});

export const RadarSchema = (dataPointType: RadarRemap) => z.array(RadarObjectSchema(dataPointType));

export type RadarObject = z.infer<ReturnType<typeof RadarObjectSchema>>;
export type RadarRemap = z.infer<typeof RadarRemapSchema>;

// Parallel
export const ParallelObjectSchema = (dataPointType: ParallelRemap) =>
	z.object({
		r: SupportedTypeMap[dataPointType.r.type],
		theta: SupportedTypeMap[dataPointType.theta.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const ParallelRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const ParallelSchema = (dataPointType: ParallelRemap) =>
	z.array(ParallelObjectSchema(dataPointType));

export type ParallelObject = z.infer<ReturnType<typeof ParallelObjectSchema>>;
export type ParallelRemap = z.infer<typeof ParallelRemapSchema>;

// Spherical
export const SphericalObjectSchema = (dataPointType: SphericalRemap) =>
	z.object({
		r: SupportedTypeMap[dataPointType.r.type],
		theta: SupportedTypeMap[dataPointType.theta.type],
		phi: SupportedTypeMap[dataPointType.phi.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const SphericalRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	phi: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const SphericalSchema = (dataPointType: SphericalRemap) =>
	z.array(SphericalObjectSchema(dataPointType));

export type SphericalObject = z.infer<ReturnType<typeof SphericalObjectSchema>>;
export type SphericalRemap = z.infer<typeof SphericalRemapSchema>;

// Ternary
export const TernaryObjectSchema = (dataPointType: TernaryRemap) =>
	z.object({
		A: SupportedTypeMap[dataPointType.A.type],
		B: SupportedTypeMap[dataPointType.B.type],
		C: SupportedTypeMap[dataPointType.C.type],
		entity: SupportedTypeMap[dataPointType.entity.type]
	});
export const TernaryRemapSchema = z.object({
	A: CoordinateObjectSchema,
	B: CoordinateObjectSchema,
	C: CoordinateObjectSchema,
	entity: CoordinateObjectSchema
});
export const TernarySchema = (dataPointType: TernaryRemap) =>
	z.array(TernaryObjectSchema(dataPointType));

export type TernaryObject = z.infer<ReturnType<typeof TernaryObjectSchema>>;
export type TernaryRemap = z.infer<typeof TernaryRemapSchema>;

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
	const validatedRemapData = coordinateSchema[validatedCoordinateType.data](
		validatedUserInputSchemaConfiguration.data
	).safeParse(remappedUserData);
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
