import { z, ZodError } from 'zod';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import sizeof from 'object-sizeof';
import { SupportedTypeMap, SupportedTypeSchema, DataTypeSchema } from './dataTypes.js';

const CoordinateObject = z.object({
	key: z.string(), // The key of the coordinate
	type: DataTypeSchema, // The data type of the coordinate's value
	label: z.string() // The label of the coordinate
});
// const CoordinateObjectSchema = z.union([CoordinateObject, z.array(CoordinateObject)]);

const keyLookup = {
	affine: ['x', 'y', 'entity'],
	barycentric: ['A', 'B', 'C', 'entity'],
	cartesian: ['x', 'y', 'entity'],
	hexbin: ['x', 'y', 'entity'],
	logPolar: ['r', 'theta', 'entity'],
	oblique: ['x', 'y', 'entity'],
	parallel: ['r', 'theta', 'entity'],
	polar: ['r', 'theta', 'entity'],
	radar: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'entity'],
	spherical: ['r', 'theta', 'phi', 'entity'],
	ternary: ['A', 'B', 'C', 'entity']
};

const createConfigSchema = (key: string) =>
	z.object(
		_.zipObject(
			keyLookup[key],
			keyLookup[key].map((key) => CoordinateObject)
		)
	);

const createDataSchema = (key: string) =>
	z.array(
		z.object(
			_.zipObject(
				keyLookup[key],
				keyLookup[key].map((key) => DataTypeSchema)
			)
		)
	);

const SystemConfigSchema = {
	affine: createConfigSchema('affine'),
	barycentric: createConfigSchema('barycentric'),
	cartesian: createConfigSchema('cartesian'),
	hexbin: createConfigSchema('hexbin'),
	logPolar: createConfigSchema('logPolar'),
	oblique: createConfigSchema('oblique'),
	parallel: createConfigSchema('parallel'),
	polar: createConfigSchema('polar'),
	radar: createConfigSchema('radar'),
	spherical: createConfigSchema('spherical'),
	ternary: createConfigSchema('ternary')
};

const SystemDataSchema = {
	affine: createDataSchema('affine'),
	barycentric: createDataSchema('barycentric'),
	cartesian: createDataSchema('cartesian'),
	hexbin: createDataSchema('hexbin'),
	logPolar: createDataSchema('logPolar'),
	oblique: createDataSchema('oblique'),
	parallel: createDataSchema('parallel'),
	polar: createDataSchema('polar'),
	radar: createDataSchema('radar'),
	spherical: createDataSchema('spherical'),
	ternary: createDataSchema('ternary')
};

const CoordinateTypeSchema = z.enum([
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

type InputSchemaConfiguration =
	| z.infer<typeof SystemConfigSchema.affine>
	| z.infer<typeof SystemConfigSchema.barycentric>
	| z.infer<typeof SystemConfigSchema.cartesian>
	| z.infer<typeof SystemConfigSchema.hexbin>
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
	| z.infer<typeof SystemDataSchema.hexbin>
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

export const createSystem = (params) => {
	const res = {
		system: '',
		entity: {},
		loading: true,
		success: false,
		error: {
			name: '',
			message: null as ZodError<unknown> | null
		},
		data: []
	};

	const reportError = (message: string, zodError: ZodError) => {
		res.error = {
			name: message,
			message: zodError
		};
		res.loading = false;
	};

	const validSystem = CoordinateTypeSchema.safeParse(params.system);
	if (!validSystem.success) reportError('Invalid system:', validSystem.error);
	res.system = params.system;
	res.entity = params.schema.entity;

	const validSchema = SystemConfigSchema[
		params.system as keyof typeof SystemConfigSchema
	].safeParse(params.schema);
	if (!validSchema.success) reportError('Invalid schema:', validSchema.error);
	const validData = SystemDataSchema[params.system as keyof typeof SystemDataSchema].safeParse(
		remapDataToSchema(params.data, params.schema)
	);
	if (!validData.success) reportError('Invalid data:', validData.error);
	res.data = validData.data;
	res.loading = false;
	res.success = validData.success;
	return res;
};
