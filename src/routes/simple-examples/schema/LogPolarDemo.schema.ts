import { z } from 'zod';

export const LogPolarDemoSchema = z.array(
	z.object({
		r: z.number(),
		theta: z.number()
	})
);

export default LogPolarDemoSchema;
