import { z } from 'zod';

export const RadarDemoSchema = z.array(
	z.object({
		species: z.string(),
		sepal_length: z.number(),
		sepal_width: z.number(),
		petal_length: z.number(),
		petal_width: z.number()
	})
);

export default RadarDemoSchema;
