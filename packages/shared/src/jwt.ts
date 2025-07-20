import { TokenPair, JWTPayload } from './types.js';
import jwt from 'jsonwebtoken';



export class JWTService {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  generateTokenPair(
    payload: Omit<JWTPayload, 'type' | 'iat' | 'exp'>
  ): TokenPair {
    const accessToken = jwt.sign({ ...payload, type: 'access' }, this.secret, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ ...payload, type: 'refresh' },this.secret, {
        expiresIn: '7d',
      });

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.secret) as JWTPayload;
  }

  verifyAccessToken(token: string): JWTPayload {
    const payload = this.verifyToken(token);
    if(payload.type !== "access"){
      throw new Error("Invalid token type");
    }
    return payload;
  }

  verifyRefreshToken(token: string): JWTPayload {
    const payload = this.verifyToken(token);
    if(payload.type !== "refresh"){
      throw new Error("Invalid token type");
    }
    return payload;
  }

  refreshAccessToken(refreshToken: string): string {
    const payload = this.verifyRefreshToken(refreshToken);
    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        type: 'access',
      },
      this.secret,
      {
        expiresIn: '15m',
      }
    );
  }


}

export const createJWTService = (secret: string) => {
  return new JWTService(secret);
}
