import { z } from 'zod';

export const SphericalDemoSchema = z.array(
	z.object({
		r: z.number(),
		theta: z.number(),
		phi: z.number(),
		label: z.string()
	})
);

export default SphericalDemoSchema;
