import { z } from 'zod';

export const BarycentricDemoSchema = z.array(
	z.object({
		A: z.number(),
		B: z.number(),
		C: z.number(),
		label: z.string()
	})
);

export default BarycentricDemoSchema;
