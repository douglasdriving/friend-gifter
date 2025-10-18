import jwt, { type SignOptions } from 'jsonwebtoken';
import config from '../config';

export interface JwtPayload {
  userId: string;
  username?: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret as string, {
    expiresIn: config.jwtExpiresIn,
  } as SignOptions);
};

// Alias for tests
export const generateToken = signToken;

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
