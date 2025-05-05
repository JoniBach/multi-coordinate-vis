import { z } from 'zod';

export const PolarDemoSchema = z.array(
	z.object({
		r: z.number(),
		theta: z.number()
	})
);

export default PolarDemoSchema;
