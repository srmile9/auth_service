import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig, googleConfig, appleConfig, hasuraConfig } from '../config';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

class AuthMiddleware {
  // Middleware for verifying JWT tokens
  verifyJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error verifying token', error });
    }
  };

  // Middleware for handling Google authentication
  verifyGoogleToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const client = new OAuth2Client(googleConfig.clientId);

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleConfig.clientId,
      });

      const payload = ticket.getPayload();
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Failed to authenticate Google token' });
    }
  };

  // Middleware for handling Apple authentication
  verifyAppleToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const response = await axios.post('https://appleid.apple.com/auth/token', {
        client_id: appleConfig.clientId,
        client_secret: appleConfig.clientSecret,
        code: token,
        grant_type: 'authorization_code',
      });

      req.user = response.data;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Failed to authenticate Apple token' });
    }
  };

  // Middleware for handling Hasura GraphQL authentication
  verifyHasuraToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const response = await axios.post(hasuraConfig.endpoint, {
        query: `
          query {
            user {
              id
              email
            }
          }
        `,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      req.user = response.data.data.user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Failed to authenticate Hasura token' });
    }
  };
}

export default new AuthMiddleware();
