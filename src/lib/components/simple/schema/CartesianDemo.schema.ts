import { z } from 'zod';

export const CartesianDemoSchema = z.array(
	z.object({
		x: z.number(),
		y: z.number()
	})
);

export default CartesianDemoSchema;
