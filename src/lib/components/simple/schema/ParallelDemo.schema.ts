import { z } from 'zod';

export const ParallelDemoSchema = z.array(
	z.object({
		sepal_length: z.number(),
		sepal_width: z.number(),
		petal_length: z.number(),
		petal_width: z.number()
	})
);

export default ParallelDemoSchema;
