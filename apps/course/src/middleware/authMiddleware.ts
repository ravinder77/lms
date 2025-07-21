import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "@lms/shared/types";
import { jwtService } from "../index.js";

declare global {
	namespace Express {
		interface Request {
			user?: JWTPayload;
		}
	}
}

async function authenticateUser(req: Request, res: Response, next: NextFunction):Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer')) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
  }
	const token = authHeader.split(' ')[1];
	
	if (!token) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

  try {
    // const payload: JWTPayload = jwtService.verifyAccessToken(token);
    req.user = jwtService.verifyAccessToken(token);
    next();
  } catch (error) {
    console.error(error);
		res.status(401).json({ message: 'Unauthorized' });
		return;
  }
}


async function requireRole (role: string){
	return  (req: Request, res: Response, next: NextFunction) => {
		if (req.user?.role !== role) {
			res.status(403).json({ message: 'Forbidden' });
			return;
		}
		next();
	}
}


export { authenticateUser, requireRole };