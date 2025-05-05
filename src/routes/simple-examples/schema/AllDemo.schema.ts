import { z } from 'zod';
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
export const ParallelSchema = z.array(PolarObjectSchema);

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
	radar: RadarSchema,
	spherical: SphericalSchema,
	ternary: TernarySchema
};

export const UserDataTableSchema = z.array(z.unknown());

// Remap utility
function remapData<T>(userData: Array<unknown>, remap: Record<string, string>): T[] {
	return userData.map((item) => {
		const mapped: any = {};
		for (const [outKey, inPath] of Object.entries(remap)) {
			mapped[outKey] = _.get(item, inPath);
		}
		return mapped;
	});
}

const toAffine = (userData: Array<unknown>, inputSchemaConfiguration: AffineRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		AffineRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<AffineObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = AffineSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toBarycentric = (userData: Array<unknown>, inputSchemaConfiguration: BarycentricRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		BarycentricRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<BarycentricObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = BarycentricSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toCartesian = (userData: Array<unknown>, inputSchemaConfiguration: CartesianRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		CartesianRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<CartesianObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = CartesianSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toGeographic = (userData: Array<unknown>, inputSchemaConfiguration: GeographicRemap) => {
	// For geographic, map features array using FeatureRemap
	const features = userData.map((item) => {
		const mapped = remapData<any>([item], inputSchemaConfiguration.features[0])[0];
		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [mapped.latitude, mapped.longitude]
			},
			properties: {
				name: mapped.name
			}
		};
	});
	const geoObj = [{ type: 'FeatureCollection', features }];
	const validatedRemapData = GeographicSchema.safeParse(geoObj);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toHexbin = (userData: Array<unknown>, inputSchemaConfiguration: HexbinRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		HexbinRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<HexbinObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = HexbinSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toLogPolar = (userData: Array<unknown>, inputSchemaConfiguration: LogPolarRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		LogPolarRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<LogPolarObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = LogPolarSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toOblique = (userData: Array<unknown>, inputSchemaConfiguration: ObliqueRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		ObliqueRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<ObliqueObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = ObliqueSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toParallel = (userData: Array<unknown>, inputSchemaConfiguration: PolarRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		PolarRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<PolarObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = ParallelSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toRadar = (userData: Array<unknown>, inputSchemaConfiguration: RadarRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		RadarRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<RadarObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = RadarSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toSpherical = (userData: Array<unknown>, inputSchemaConfiguration: SphericalRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		SphericalRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<SphericalObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = SphericalSchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

const toTernary = (userData: Array<unknown>, inputSchemaConfiguration: TernaryRemap) => {
	const validateOriginalUserData = UserDataTableSchema.safeParse(userData);
	if (!validateOriginalUserData.success) {
		console.error('Invalid user data', validateOriginalUserData.error);
	}
	const validatedUserInputSchemaConfiguration =
		TernaryRemapSchema.safeParse(inputSchemaConfiguration);
	if (!validatedUserInputSchemaConfiguration.success) {
		console.error('Invalid schema configuration', validatedUserInputSchemaConfiguration.error);
		return [];
	}
	const remappedUserData = remapData<TernaryObject>(userData, inputSchemaConfiguration);
	const validatedRemapData = TernarySchema.safeParse(remappedUserData);
	if (validatedRemapData.success) {
		return validatedRemapData.data;
	} else {
		console.error('Invalid coordinate data (after remap):', validatedRemapData.error);
		return [];
	}
};

export const toCoordinates = {
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
