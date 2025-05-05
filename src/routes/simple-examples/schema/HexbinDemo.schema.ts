import { z } from 'zod';

export const HexbinDemoSchema = z.array(
	z.object({
		x: z.number(),
		y: z.number()
	})
);

export default HexbinDemoSchema;
