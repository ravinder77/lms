import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';


export function validate<T>(schema: ZodSchema<T>) {
	return (req: Request, res: Response, next: NextFunction) => {
  
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const errors = result.error.errors.map((error) => error.message);
		 	res.status(400).json({
				success: false,
				message: errors
				});
			return;
		}
		req.body = result.data;
		next();
	}
}


