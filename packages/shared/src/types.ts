


export interface JWTPayload {
  userId: string;
  email: string;
	role: string;
	type: "access" | "refresh";
	iat?: number;
	exp?: number;
}

export interface TokenPair {
	refreshToken: string;
	accessToken: string;
}


export interface User {
	email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin';
  provider: 'local' | 'google';
  providerId?: string;
  isEmailVerified: boolean;
  lastLogin: Date | null;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T ;
}