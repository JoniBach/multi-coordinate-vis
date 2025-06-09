import { z, ZodError } from 'zod';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import sizeof from 'object-sizeof';
import {
	SupportedTypeMap,
	SupportedTypeSchema,
	DataTypeSchema,
	supported_type_list
} from './dataTypes.js';
import * as d3 from 'd3';
import { radialFeature, createSvg, planarFeature } from './features.js';
import { nanoid } from 'nanoid';

export const system_list = ['planar', 'radial', 'ternary'];

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

export const axis_list = ['x', 'y', 'A', 'B', 'C', 'r', 'theta', 'phi', 'entity'];

export const systemSchema = z.enum(system_list);
export const systemListSchema = z.array(systemSchema);
export type SystemType = z.infer<typeof systemSchema>;

export const scaleSchema = z.enum(scale_list);
export const scaleListSchema = z.array(scaleSchema);
export type ScaleType = z.infer<typeof scaleSchema>;

export const featureSchema = z.enum(feature_list);
export const featureListSchema = z.array(featureSchema);
export type FeatureType = z.infer<typeof featureSchema>;

export const axisSchema = z.enum(axis_list);
export const axisListSchema = z.array(axisSchema);
export type AxisType = z.infer<typeof axisSchema>;

const axis_mapping: Record<SystemType, AxisType[]> = {
	planar: ['x', 'y', 'entity'],
	radial: ['r', 'theta', 'entity'],
	ternary: ['A', 'B', 'C', 'entity']
	// spherical: ['r', 'theta', 'phi'],
	// radar: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
};

const axis_inversion_reference: Record<AxisType, boolean> = {
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

const CoordinateObjectSchema = z.object({
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
			Object.keys(axis_config[key]).map((_) => CoordinateObjectSchema)
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

type InputSchemaConfiguration = {
	[key in SystemType]: z.infer<(typeof SystemConfigSchema)[key]>;
}[SystemType];

type InputDataConfiguration = {
	[key in SystemType]: z.infer<(typeof SystemDataSchema)[key]>;
}[SystemType];

const filterEntityFromSchema = ({ entity, ...rest }) => rest;

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

const filterFeaturesByVisibility = (features: Record<string, any>) =>
	_.pickBy(features, (feature) => feature.show !== false);

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
	if (!validData.success) return reportError('Invalid data:', validData.error);

	res.data = validData.data;
	res.schema = filterEntityFromSchema(validSchema.data);
	res.schemaReverse = createSchemaReverse(res.schema);
	res.schemaList = Object.keys(res.schema);
	res.schemaReverseList = Object.keys(res.schemaReverse);

	// if planar
	res.extent = calculateExtent(res.schemaList, res.schema, validData.data);
	res.scale = calculateScale(res.schema, res.extent, res.config, options.system);

	if (options.system === 'planar') {
		res.features = filterFeaturesByVisibility(options.features);
		res.vis = {
			svg: createSvg,
			feature: planarFeature
		};
	}

	if (options.system === 'radial') {
		res.features = filterFeaturesByVisibility(options.features);
		res.vis = {
			svg: createSvg,
			feature: radialFeature
		};
	}

	res.loading = false;
	res.success = validData.success;
	return res;
};

const datasetObjectSchema = z.object({
	key: z.string(),
	type: SupportedTypeSchema,
	prvType: z.enum(supported_type_list),
	label: z.string(),
	range: z.array(DataTypeSchema.nullable()).optional().nullable(),
	scale: z.enum(scale_list),
	systemNanoId: z.string()
});

const systemNanoIdSchema = z.string();
const datasetItemSchema = z
	.object({
		systemNanoId: systemNanoIdSchema
	})
	.merge(datasetObjectSchema);
const preparedDatasetSchema = z.array(datasetItemSchema);

const prepareData = (multiSystemPayload) => {
	// Introduce a unique id for each dataset item
	// the schema will reformat dates to Date objects
	// we will preserve the original type in prvType
	const preparedDataset = preparedDatasetSchema.parse(
		multiSystemPayload.dataset.map((item) => ({
			...item,
			prvType: item.type,
			systemNanoId: nanoid(6)
		}))
	);

	// Validate the dataset
	const validDataset = z.array(datasetObjectSchema).safeParse(preparedDataset);
	if (!validDataset.success) {
		console.error('Invalid dataset:', validDataset.error);
		return;
	}

	// Create a lookup of series by systemNanoId and form a list of ids
	const seriesLookup = _.keyBy(validDataset.data, 'key');
	const seriesNanoIdList = Object.keys(seriesLookup);
	const seriesKeyList = _.map(seriesLookup, 'key');
	// Map the previous type to the validator
	const dataTypesPrev = _.mapValues(
		seriesLookup,
		(datasetItem) => SupportedTypeMap[datasetItem.prvType]
	);

	// Remap the data to the new format
	const remappedData = multiSystemPayload.data.map((dataObject) => {
		const newItem = {};
		preparedDataset.forEach((datasetItem) => {
			newItem[datasetItem.key] = _.get(dataObject, datasetItem.key);
		});
		return newItem;
	});

	// Validate the data and parse to ensure that its suitable for the system
	const validData = z
		.array(z.object(_.mapValues(dataTypesPrev, (type) => type)))
		.safeParse(remappedData);

	if (!validData.success) console.error('Invalid data:', validData.error);
	return {
		validData,
		seriesNanoIdList,
		seriesLookup,
		dataTypesPrev,
		remappedData,
		seriesKeyList
	};
};

const multi_axis_mapping: Record<SystemType, AxisType[]> = {
	planar: ['x', 'y'],
	radial: ['r', 'theta'],
	ternary: ['A', 'B', 'C']
	// spherical: ['r', 'theta', 'phi'],
	// radar: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
};

const multi_axis_inversion_reference: Record<AxisType, boolean> = {
	x: false,
	y: true,
	A: false,
	B: false,
	C: false,
	r: false,
	theta: false,
	phi: false
};

const multi_system_axis_config = _.mapValues(multi_axis_mapping, (keys) =>
	_.zipObject(
		keys,
		keys.map((key) => multi_axis_inversion_reference[key])
	)
);

export const createMultiSystem = (multiSystemPayload) => {
	const { validData, seriesNanoIdList, seriesLookup, seriesKeyList } =
		prepareData(multiSystemPayload);

	const seriesConfigSchema = z.array(
		z
			.object(
				_.fromPairs(
					multi_axis_mapping[multiSystemPayload.system].map((key) => [key, z.enum(seriesKeyList)])
				)
			)
			.transform((v) => ({
				...v,
				seriesNanoId: nanoid(6)
			}))
	);
	const validSeriesConfig = seriesConfigSchema.safeParse(multiSystemPayload.series);
	const systemIdList = _.map(validSeriesConfig.data, 'seriesNanoId');
	if (!validSeriesConfig.success) {
		console.error('Invalid series configuration:', validSeriesConfig.error);
		return;
	}
	console.log('validSeriesConfig', validSeriesConfig.data);

	const systemData = _.mapValues(
		_.keyBy(validSeriesConfig.data, 'seriesNanoId'),
		(seriesConfig) => {
			const seriesConfigWithoutNanoId = _.omit(seriesConfig, ['seriesNanoId']);
			const invertedSeriesConfig = _.invert(seriesConfigWithoutNanoId);
			const arrayOfKeys = Object.keys(invertedSeriesConfig);
			const data = _.map(validData.data, (item) => _.pick(item, arrayOfKeys));
			// const data = _.map(validData.data, (item) =>
			// 	_.mapKeys(_.pick(item, arrayOfKeys), (_, key) => invertedSeriesConfig[key])
			// );
			return data;
		}
	);

	console.log('systemData', systemData);

	// Calculate the extent ready for setting the scale
	const extent = calculateExtent(seriesNanoIdList, seriesLookup, validData.data);

	// Calculate the scale
	const scale = calculateScale(
		seriesLookup,
		extent,
		multiSystemPayload.config,
		multiSystemPayload.system
	);

	const systemScale = _.mapValues(
		_.keyBy(validSeriesConfig.data, 'seriesNanoId'),
		(seriesConfig) => {
			const seriesConfigWithoutNanoId = _.omit(seriesConfig, ['seriesNanoId']);
			const invertedSeriesConfig = _.invert(seriesConfigWithoutNanoId);
			const arrayOfKeys = Object.keys(invertedSeriesConfig);
			const systemScale = _.pick(scale, arrayOfKeys);
			return systemScale;
		}
	);

	const systemExtent = _.mapValues(
		_.keyBy(validSeriesConfig.data, 'seriesNanoId'),
		(seriesConfig) => {
			const seriesConfigWithoutNanoId = _.omit(seriesConfig, ['seriesNanoId']);
			const invertedSeriesConfig = _.invert(seriesConfigWithoutNanoId);
			const arrayOfKeys = Object.keys(invertedSeriesConfig);
			const systemExtent = _.pick(extent, arrayOfKeys);
			return systemExtent;
		}
	);

	const series = {
		data: systemData,
		scale: systemScale,
		extent: systemExtent,
		list: systemIdList
	};

	return {
		validData,
		seriesNanoIdList,
		seriesLookup,
		seriesKeyList,
		extent,
		scale,
		series
	};
};
