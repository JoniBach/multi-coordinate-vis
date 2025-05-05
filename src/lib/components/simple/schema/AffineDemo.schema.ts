import { z } from 'zod';

export const AffineDemoSchema = z.array(
	z.object({
		x: z.number(),
		y: z.number(),
		label: z.string()
	})
);

export default AffineDemoSchema;
