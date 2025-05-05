import { z } from 'zod';

const FeatureSchema = z.object({
	type: z.literal('Feature'),
	geometry: z.object({
		type: z.literal('Point'),
		coordinates: z.tuple([z.number(), z.number()])
	}),
	properties: z.object({
		name: z.string()
	})
});

export const GeographicDemoSchema = z.object({
	type: z.literal('FeatureCollection'),
	features: z.array(FeatureSchema)
});

export default GeographicDemoSchema;
