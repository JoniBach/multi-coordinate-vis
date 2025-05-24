import { z, ZodError } from 'zod';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import sizeof from 'object-sizeof';
import { SupportedTypeMap, SupportedTypeSchema, DataTypeSchema } from './dataTypes.js';
import * as d3 from 'd3';
import { chartFeature, createSvg } from './features.js';

export const scale_list = [
	'linear',
	'log',
	'pow',
	'sqrt',
	'symlog',
	'time',
	'utc',
	'sequential',
	'diverging',
	'quantize',
	'quantile',
	'threshold',
	'ordinal',
	'band',
	'point',
	'identity',
	'radial'
];

export const system_list = [
	'affine', // not supported
	'barycentric', // not supported
	'cartesian',
	'hexbin',
	'logPolar',
	'oblique',
	'parallel',
	'polar',
	'radar',
	'spherical',
	'ternary'
] as const;

export type SystemType = (typeof system_list)[number];

export const feature_list = [
	'x_axis',
	'y_axis',
	'x_axis_label',
	'y_axis_label',
	'title',
	'grid',
	'x_axis_grid',
	'y_axis_grid',
	'point',
	'line',
	'area',
	'bar'
];

const axis_mapping: Record<SystemType, string[]> = {
	affine: ['x', 'y'],
	cartesian: ['x', 'y'],
	oblique: ['x', 'y'],
	polar: ['r', 'theta'],
	logPolar: ['r', 'theta'],
	radar: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
	spherical: ['r', 'theta', 'phi'],
	parallel: ['r', 'theta'],
	barycentric: ['A', 'B', 'C'],
	ternary: ['A', 'B', 'C'],
	hexbin: ['x', 'y']
};

const axis_inversion_reference = {
	x: false,
	y: true,
	A: false,
	B: false,
	C: false,
	r: false,
	theta: false,
	phi: false,
	entity: false
};

export const featureSchema = z.enum(feature_list);

export const featureSchemaList = z.array(featureSchema);

const CoordinateObject = z.object({
	key: z.string(), // The key of the coordinate
	type: SupportedTypeSchema, // The data type of the coordinate's value
	label: z.string(), // The label of the coordinate
	range: z.array(DataTypeSchema.nullable()).optional().nullable(),
	scale: z
		.enum(scale_list)
		.optional()
		.transform(
			(scale, ctx) => {
				const { type } = ctx?.parent?.data ?? {};

				return type?.toString().startsWith('date') ? 'time' : scale;
			},
			{
				message: 'If type is date, scale must be time'
			}
		)
		.default('linear') // The scale of the coordinate
});

export const axis_config = _.mapValues(axis_mapping, (keys) =>
	_.zipObject(
		keys,
		keys.map((key) => axis_inversion_reference[key])
	)
);

const createConfigSchema = (key: SystemType) =>
	z.object(
		_.zipObject(
			Object.keys(axis_config[key]),
			Object.keys(axis_config[key]).map((_) => CoordinateObject)
		)
	);
const createDataSchema = (key: SystemType) =>
	z.array(
		z.object(
			_.zipObject(
				Object.keys(axis_config[key]),
				Object.keys(axis_config[key]).map((_) => DataTypeSchema)
			)
		)
	);

const SystemConfigSchema = _.zipObject(
	system_list,
	system_list.map((key) => createConfigSchema(key as SystemType))
);
const SystemDataSchema = _.zipObject(
	system_list,
	system_list.map((key) => createDataSchema(key as SystemType))
);

const CoordinateTypeSchema = z.enum(system_list as unknown as [string, ...string[]]);

type InputSchemaConfiguration =
	| z.infer<typeof SystemConfigSchema.affine>
	| z.infer<typeof SystemConfigSchema.barycentric>
	| z.infer<typeof SystemConfigSchema.cartesian>
	| z.infer<typeof SystemConfigSchema.logPolar>
	| z.infer<typeof SystemConfigSchema.oblique>
	| z.infer<typeof SystemConfigSchema.parallel>
	| z.infer<typeof SystemConfigSchema.polar>
	| z.infer<typeof SystemConfigSchema.radar>
	| z.infer<typeof SystemConfigSchema.spherical>
	| z.infer<typeof SystemConfigSchema.ternary>;

type InputDataConfiguration =
	| z.infer<typeof SystemDataSchema.affine>
	| z.infer<typeof SystemDataSchema.barycentric>
	| z.infer<typeof SystemDataSchema.cartesian>
	| z.infer<typeof SystemDataSchema.logPolar>
	| z.infer<typeof SystemDataSchema.oblique>
	| z.infer<typeof SystemDataSchema.parallel>
	| z.infer<typeof SystemDataSchema.polar>
	| z.infer<typeof SystemDataSchema.radar>
	| z.infer<typeof SystemDataSchema.spherical>
	| z.infer<typeof SystemDataSchema.ternary>;

const filterEntityFromSchema = ({ entity, ...rest }) => rest;

const ensureObjectParamsAreArray = (input: InputSchemaConfiguration) =>
	Object.fromEntries(_.map(input, (value, key) => [key, _.isArray(value) ? value : [value]]));

const remapDataToSchema = (data, schema) => {
	return data.map((item) => {
		const mapped: any = {};
		for (const [outKey, { key, type }] of Object.entries(schema)) {
			const validator = SupportedTypeMap[type];
			const valid = validator.safeParse(_.get(item, key));
			if (!valid.success) {
				console.error(
					`Invalid data: ${outKey} = ${_.get(item, key)} does not conform to type ${type}`
				);
			}
			mapped[outKey] = valid.data;
		}
		return mapped;
	});
};

const createSchemaReverse = (schema: InputSchemaConfiguration) => {
	const schemaReverse = {} as InputSchemaConfiguration;
	for (const [outKey, { key }] of Object.entries(schema)) {
		schemaReverse[key] = { key: outKey, type: schema[outKey].type, label: schema[outKey].label };
	}
	return schemaReverse;
};

const extentCalculator = {
	string: (data: string[]) => [
		Math.min(...data.map((x) => x.charCodeAt(0))),
		Math.max(...data.map((x) => x.charCodeAt(0)))
	],
	boolean: (data: boolean[]) => [
		Math.min(...data.map((x) => Number(x))),
		Math.max(...data.map((x) => Number(x)))
	],
	number: (data: number[]) => [Math.min(...data), Math.max(...data)],
	date: (data: Date[]) => [
		Math.min(...data.map((x) => x.getTime())),
		Math.max(...data.map((x) => x.getTime()))
	]
};

const calculateExtent = (schemaList: string[], schema: InputSchemaConfiguration, data: unknown[]) =>
	_.transform(
		schemaList,
		(result, key) => {
			// console.log(schema[key].range);
			result[key] = extentCalculator[schema[key].type as keyof typeof extentCalculator](
				_.map(data, key)
			);
			if (schema[key].range) {
				const [min, max] = schema[key].range;

				if (schema[key].type === 'date') {
					if (min !== null) result[key][0] = new Date(min);
					if (max !== null) result[key][1] = new Date(max);
				} else {
					if (min !== null) result[key][0] = min;
					if (max !== null) result[key][1] = max;
				}
			}
		},
		{} as Record<string, [number, number]>
	);

const scaleCalculator = {
	linear: (domain, range) => d3.scaleLinear().domain(domain).range(range),
	log: (domain, range) => d3.scaleLog().domain(domain).range(range),
	pow: (domain, range) => d3.scalePow().domain(domain).range(range),
	sqrt: (domain, range) => d3.scaleSqrt().domain(domain).range(range),
	symlog: (domain, range) => d3.scaleSymlog().domain(domain).range(range),
	time: (domain, range) => d3.scaleTime().domain(domain).range(range),
	utc: (domain, range) => d3.scaleUtc().domain(domain).range(range),
	sequential: (domain, range) => d3.scaleSequential(domain).range(range),
	sequentialLog: (domain, range) => d3.scaleSequentialLog(domain).range(range),
	sequentialPow: (domain, range) => d3.scaleSequentialPow(domain).range(range),
	sequentialSymlog: (domain, range) => d3.scaleSequentialSymlog(domain).range(range),
	diverging: (domain, range) => d3.scaleDiverging(domain).range(range),
	divergingLog: (domain, range) => d3.scaleDivergingLog(domain).range(range),
	divergingPow: (domain, range) => d3.scaleDivergingPow(domain).range(range),
	divergingSymlog: (domain, range) => d3.scaleDivergingSymlog(domain).range(range),
	quantize: (domain, range) => d3.scaleQuantize(domain).range(range),
	quantile: (domain, range) => d3.scaleQuantile(domain).range(range),
	threshold: (domain, range) => d3.scaleThreshold(domain).range(range),
	ordinal: (domain, range) => d3.scaleOrdinal(domain).range(range),
	band: (domain, range) => d3.scaleBand(domain).range(range),
	point: (domain, range) => d3.scalePoint(domain).range(range),
	identity: (domain, range) => d3.scaleIdentity(domain).range(range),
	radial: (domain, range) => d3.scaleRadial(domain).range(range)
};

const calculateScale = (
	schema: InputSchemaConfiguration,
	extent: Record<string, [number, number]>,
	config: any,
	systemType: string
) =>
	_.transform(
		schema,
		(result, { scale, key }, outKey) => {
			const domain = extent[outKey] || [0, 1];
			// console.log(schema);

			// Get the axis configuration for this coordinate system and axis
			const axisConfig = axis_config[systemType]?.[outKey];

			// Determine the range based on axis configuration
			let range;
			if (axisConfig) {
				// For inverted axes (like y in Cartesian)
				range = [config.size - config.margin, config.margin];
			} else {
				// For standard axes
				range = [config.margin, config.size - config.margin];
			}
			result[outKey] = scaleCalculator[scale](domain, range);
		},
		{} as Record<string, d3.ScaleLinear<number, number>>
	);

export const createSystem = (userData, options) => {
	const res = {
		id: uuidv4(),
		system: '',
		entity: {},
		loading: true,
		success: false,
		schema: {},
		schemaReverse: {},
		schemaList: [],
		schemaReverseList: [],
		extent: {},
		scale: {},
		error: {
			name: '',
			message: null as ZodError<unknown> | null
		},
		config: options.config,
		data: [],
		features: options.features,
		vis: {
			svg: () => null,
			feature: () => null
		}
	};

	const reportError = (message: string, zodError: ZodError) => {
		res.error = {
			name: message,
			message: zodError
		};
		res.loading = false;
		return res;
	};

	const validSystem = CoordinateTypeSchema.safeParse(options.system);

	if (!validSystem.success) return reportError('Invalid system:', validSystem.error);

	res.system = options.system;
	res.entity = options.schema.entity;

	const validSchema = SystemConfigSchema[
		options.system as keyof typeof SystemConfigSchema
	].safeParse(options.schema);

	if (!validSchema.success) return reportError('Invalid schema:', validSchema.error);

	const validData = SystemDataSchema[options.system as keyof typeof SystemDataSchema].safeParse(
		remapDataToSchema(userData, options.schema)
	);

	res.schema = filterEntityFromSchema(validSchema.data);
	res.schemaReverse = createSchemaReverse(res.schema);
	res.schemaList = Object.keys(res.schema);
	res.schemaReverseList = Object.keys(res.schemaReverse);

	if (!validData.success) return reportError('Invalid data:', validData.error);

	res.data = validData.data;

	res.extent = calculateExtent(res.schemaList, res.schema, validData.data);
	res.scale = calculateScale(res.schema, res.extent, res.config, options.system);

	res.vis = {
		svg: createSvg,
		feature: chartFeature
	};
	res.loading = false;
	res.success = validData.success;
	return res;
};
