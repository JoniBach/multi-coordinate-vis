import { z, ZodError } from 'zod';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { isValid, parseISO } from 'date-fns';
import sizeof from 'object-sizeof';

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
// .transform((v) => (v.startsWith('date_') ? 'date' : v));

export type SupportedType = z.infer<typeof SupportedTypeSchema>;

export const numberSchema = z.number();
export const stringSchema = z.string();
export const booleanSchema = z.boolean();
export const dateSchema = z.date();
export const date_isoSchema = z
	.string()
	.refine(
		(v, ctx?: any) => {
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
		(v, ctx?: any) => {
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
		(v, ctx?: any) => {
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
		(v, ctx?: any) => {
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
		(v, ctx?: any) => {
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
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
});
export const AffineObjectSchema = (dataPointType: AffineRemap) =>
	z.object({
		x: SupportedTypeMap[dataPointType.x.type],
		y: SupportedTypeMap[dataPointType.y.type],
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
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
		C: SupportedTypeMap[dataPointType.C.type],
		dataMapping: z.record(z.string()).optional()
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
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const CartesianRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
});
export const CartesianSchema = (dataPointType: CartesianRemap) =>
	z.array(CartesianObjectSchema(dataPointType));

export type CartesianObject = z.infer<ReturnType<typeof CartesianObjectSchema>>;
export type CartesianRemap = z.infer<typeof CartesianRemapSchema>;

// Hexbin
export const HexbinObjectSchema = (dataPointType: HexbinRemap) =>
	z.object({
		x: SupportedTypeMap[dataPointType.x.type],
		y: SupportedTypeMap[dataPointType.y.type],
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const HexbinRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
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
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const LogPolarRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
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
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const ObliqueRemapSchema = z.object({
	x: CoordinateObjectSchema,
	y: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
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
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const PolarRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
});
export const PolarSchema = (dataPointType: PolarRemap) => z.array(PolarObjectSchema(dataPointType));

export type PolarObject = z.infer<ReturnType<typeof PolarObjectSchema>>;
export type PolarRemap = z.infer<typeof PolarRemapSchema>;

// Radar
export const RadarObjectSchema = (dataPointType: RadarRemap) =>
	z.object({
		sepal_length: SupportedTypeMap[dataPointType.sepal_length.type],
		sepal_width: SupportedTypeMap[dataPointType.sepal_width.type],
		petal_length: SupportedTypeMap[dataPointType.petal_length.type],
		petal_width: SupportedTypeMap[dataPointType.petal_width.type],
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});

export const RadarRemapSchema = z.object({
	sepal_length: CoordinateObjectSchema,
	sepal_width: CoordinateObjectSchema,
	petal_length: CoordinateObjectSchema,
	petal_width: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional()
});

export const RadarSchema = (dataPointType: RadarRemap) => z.array(RadarObjectSchema(dataPointType));

export type RadarObject = z.infer<ReturnType<typeof RadarObjectSchema>>;
export type RadarRemap = z.infer<typeof RadarRemapSchema>;

// Parallel
export const ParallelObjectSchema = (dataPointType: ParallelRemap) =>
	z.object({
		r: SupportedTypeMap[dataPointType.r.type],
		theta: SupportedTypeMap[dataPointType.theta.type],
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const ParallelRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
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
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const SphericalRemapSchema = z.object({
	r: CoordinateObjectSchema,
	theta: CoordinateObjectSchema,
	phi: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
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
		entity: SupportedTypeMap[dataPointType.entity.type],
		dataMapping: z.record(z.string()).optional()
	});
export const TernaryRemapSchema = z.object({
	A: CoordinateObjectSchema,
	B: CoordinateObjectSchema,
	C: CoordinateObjectSchema,
	entity: CoordinateObjectSchema,
	dataMapping: z.record(z.string()).optional() // Add this line
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
function remapData<T>(userData: Array<unknown>, dataMapping: InputSchemaConfiguration): T[] {
	return userData.map((item) => {
		const mapped: Record<string, unknown> = {};
		const simplifiedMapping: Record<string, string> = {};
		for (const [outKey, config] of Object.entries(dataMapping)) {
			if (typeof config === 'object' && 'key' in config) {
				mapped[outKey] = _.get(item, config.key);
				simplifiedMapping[outKey] = config.key;
			}
		}
		return { ...mapped, dataMapping: simplifiedMapping } as T;
	});
}

export const CoordinateTypeSchema = z.enum([
	'affine',
	'barycentric',
	'cartesian',
	// 'geographic', // TODO: Add geographic support
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
	skewY: z.number().int().optional().nullable(),
	gridLevels: z.number().int().optional().nullable(),
	scaleExtent: z.number().int().optional().nullable(),
	title: z.string().nullable().optional()
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
	| z.infer<typeof HexbinRemapSchema>
	| z.infer<typeof LogPolarRemapSchema>
	| z.infer<typeof ObliqueRemapSchema>
	| z.infer<typeof ParallelRemapSchema>
	| z.infer<typeof PolarRemapSchema>
	| z.infer<typeof RadarRemapSchema>
	| z.infer<typeof SphericalRemapSchema>
	| z.infer<typeof TernaryRemapSchema>;
function remapInputSchema(inputSchema: InputSchemaConfiguration): Record<string, CoordinateObject> {
	const remapped: Record<string, CoordinateObject> = {};

	// Process each field in the input schema
	for (const [key, value] of Object.entries(inputSchema)) {
		// Skip dataMapping and entity fields as they're not part of the coordinate mapping
		if (key === 'dataMapping' || key === 'entity') continue;

		// Handle array values
		if (Array.isArray(value)) {
			value.forEach((item) => {
				if (typeof item === 'object' && 'key' in item && 'type' in item && 'label' in item) {
					let type = item.type;
					if (type.startsWith('date_')) {
						type = 'date';
					}
					remapped[item.key] = {
						key,
						type,
						label: item.label
					};
				}
			});
		}
		// Handle single values
		else if (typeof value === 'object' && 'key' in value && 'type' in value && 'label' in value) {
			let type = value.type;
			if (type.startsWith('date_')) {
				type = 'date';
			}
			remapped[value.key] = {
				key,
				type,
				label: value.label
			};
		}
	}
	return remapped;
}

const normalizeDateType = (inputSchema: InputSchemaConfiguration) => {
	return Object.fromEntries(
		Object.entries(inputSchema).map(([key, value]) => {
			if (Array.isArray(value)) {
				return [
					key,
					value.map((item) => {
						if (item.type.startsWith('date_')) {
							return { ...item, type: 'date' };
						}
						return item;
					})
				];
			}

			if (typeof value === 'object' && value.type.startsWith('date_')) {
				return [key, { ...value, type: 'date' }];
			}
			return [key, value];
		})
	);
};

export const createSystem = ({
	system,
	data,
	schema,
	config
}: {
	system: CoordinateType;
	data: Array<unknown>;
	schema: InputSchemaConfiguration;
	config: Config;
}): System => {
	const coordinateType = system;
	const userData = data;
	const inputSchema = schema;
	const chartConfig = config;
	// const config =
	const startTime = performance.now();
	const loading = true;
	const valid = {
		validCoordinateType: false,
		validOriginalUserData: false,
		validUserInputSchema: false,
		validRemapData: false
	};

	const error: { name: string; zodError?: ZodError } = {
		name: '',
		zodError: undefined
	};

	const uuid = uuidv4();

	const metadata = {
		size: {
			in: sizeof(userData),
			out: 0,
			res: 0
		},
		duration: {
			validCoordinateType: 0,
			validOriginalUserData: 0,
			validUserInputSchemaConfiguration: 0,
			validRemapData: 0
		},
		valid: {
			validCoordinateType: false,
			validOriginalUserData: false,
			validUserInputSchemaConfiguration: false,
			validRemapData: false
		},
		series: {
			isMultiSeries: false,
			multiSeriesKeys: [],
			singleSeriesKeys: []
		}
	};
	const referenceSchema = remapInputSchema(inputSchema);

	const completeTask = (key: keyof typeof metadata.valid) => {
		metadata.duration[key] = performance.now() - startTime;
		metadata.valid[key] = true;
	};
	const validatedCoordinateType = CoordinateTypeSchema.safeParse(coordinateType);
	if (!validatedCoordinateType.success) {
		console.error('Invalid coordinate type', validatedCoordinateType.error);
		error.name = 'Invalid coordinate type';
		error.zodError = validatedCoordinateType.error;
		return { uuid, coordinateType, data: [], valid, error, success: false, loading };
	}
	completeTask('validCoordinateType');
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
		error.name = 'Invalid user data';
		error.zodError = validateOriginalUserData.error;
		return { uuid, coordinateType, data: [], valid, error, success: false, loading };
	}
	const normalizedSchema = normalizeDateType(
		Object.fromEntries(Object.entries(inputSchema).filter(([key]) => key !== 'entity'))
	);
	completeTask('validOriginalUserData');

	// todo: handle multi remap

	const isSingleSeries = Object.values(inputSchema).every(
		(param) => typeof param === 'object' && !Array.isArray(param)
	);

	const isMultiSeries =
		Object.values(inputSchema).some((param) => Array.isArray(param)) &&
		Object.values(inputSchema).every((param, index, array) =>
			Array.isArray(param)
				? array
						.filter((item, i) => i !== index)
						.every((item) => typeof item === 'object' && !Array.isArray(item))
				: true
		);

	const allKeys = Object.values(inputSchema)
		.map((value) => (value?.key ? value.key : undefined))
		.filter((key) => key !== undefined && key !== 'entity') as string[];

	console.log(allKeys);
	if (isMultiSeries) {
		const selectionWithSeriesInfo: Record<string, boolean> = {};
		Object.entries(inputSchema).forEach(([key, value]) => {
			selectionWithSeriesInfo[key] = Array.isArray(value);
		});
		const seriesKey = Object.entries(selectionWithSeriesInfo).find(([key, value]) => value)?.[0];
		const seriesConfigData = inputSchema[seriesKey];
		let multiSeriesData = [];

		for (const series of seriesConfigData) {
			if (inputSchema?.entity) {
				console.error('Entity is not supported with multi series');
			} else {
				const validatedUserInputSchema = remapSchema[validatedCoordinateType.data].safeParse({
					...inputSchema,
					[seriesKey]: {
						...series
					}
				});

				if (!validatedUserInputSchema.success) {
					console.error('Invalid schema configuration', validatedUserInputSchema.error);
					error.name = 'Invalid schema configuration';
					error.zodError = validatedUserInputSchema.error;
					return { uuid, coordinateType, data: [], valid, error, success: false, loading };
				}
				completeTask('validUserInputSchemaConfiguration');

				const remappedUserData = remapData(userData, {
					...inputSchema,
					[seriesKey]: {
						...series
					}
				});

				const validatedRemapData = coordinateSchema[validatedCoordinateType.data](
					validatedUserInputSchema.data
				).safeParse(remappedUserData);

				if (!validatedRemapData.success) {
					console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
					error.name = 'Invalid coordinate data (after remap)';
					error.zodError = validatedRemapData.error;
					return { uuid, coordinateType, data: [], valid, error, success: false, loading };
				}
				multiSeriesData = [...multiSeriesData, ...validatedRemapData.data];
				metadata.series.multiSeriesKeys.push(series.key);
				metadata.series.singleSeriesKeys = allKeys.filter((key) => key !== seriesKey);
			}
		}
		completeTask('validRemapData');

		metadata.size.out = sizeof(multiSeriesData);
		metadata.series.isMultiSeries = true;
		const res = {
			data: multiSeriesData,
			system: coordinateType,
			uuid,
			metadata,
			error,
			schema: {
				input: normalizedSchema,
				output: referenceSchema,
				entity: inputSchema.entity
			},
			success: true,
			loading: false,
			config: chartConfig
		};

		res.metadata.size.res = sizeof(res);
		return res;
	} else if (isSingleSeries) {
		const validatedUserInputSchema =
			remapSchema[validatedCoordinateType.data].safeParse(inputSchema);
		if (!validatedUserInputSchema.success) {
			console.error('Invalid schema configuration', validatedUserInputSchema.error);
			error.name = 'Invalid schema configuration';
			error.zodError = validatedUserInputSchema.error;
			return { uuid, coordinateType, data: [], valid, error, success: false, loading };
		}
		completeTask('validUserInputSchemaConfiguration');
		const remappedUserData = remapData(userData, inputSchema);
		const validatedRemapData = coordinateSchema[validatedCoordinateType.data](
			validatedUserInputSchema.data
		).safeParse(remappedUserData);
		if (!validatedRemapData.success) {
			console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
			error.name = 'Invalid coordinate data (after remap)';
			error.zodError = validatedRemapData.error;
			return { uuid, coordinateType, data: [], valid, error, success: false, loading };
		}
		completeTask('validRemapData');

		metadata.size.out = sizeof(validatedRemapData.data);

		const res = {
			data: validatedRemapData.data,
			system: coordinateType,
			uuid,
			metadata,
			schema: {
				input: normalizedSchema,
				output: referenceSchema,
				entity: inputSchema.entity
			},
			error: null,
			success: true,
			loading: false,
			config: chartConfig
		};
		res.metadata.size.res = sizeof(res);
		return res;
	}
};
