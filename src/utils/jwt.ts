import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';

// Utility function for generating JWT tokens
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

// Utility function for verifying JWT tokens
export const verifyToken = (token: string): object | null => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    return null;
  }
};
