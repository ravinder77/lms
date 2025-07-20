import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = ( err: any, req: Request,  res: Response) => {
	
	console.error("Error Middleware", err);
	const statusCode = err.status || 500;
  if (err) {
    res.status(statusCode).json({
      success: false,
			message: err.message,
			stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
			error: err,
    });
  }
};
