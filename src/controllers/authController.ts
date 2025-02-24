import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig, googleConfig, appleConfig } from '../config';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { User } from '../models/user';
import HasuraUser from '../models/hasuraUser';

class AuthController {
  private req: Request;
  private res: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  // Controller function for user registration
  async register() {
    const { email, password } = this.req.body;

    try {
      const user = new User({ email, password });
      await user.save();
      this.res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      this.res.status(500).json({ message: 'Error registering user', error });
    }
  }

  // Controller function for user login
  async login() {
    const { email, password } = this.req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !user.comparePassword(password)) {
        return this.res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: '1h' });
      this.res.status(200).json({ token });
    } catch (error) {
      this.res.status(500).json({ message: 'Error logging in', error });
    }
  }

  // Controller function for generating JWT tokens
  generateToken() {
    const { id } = this.req.user;
    const token = jwt.sign({ id }, jwtConfig.secret, { expiresIn: '1h' });
    this.res.status(200).json({ token });
  }

  // Controller function for refreshing JWT tokens
  refreshToken() {
    const { id } = this.req.user;
    const token = jwt.sign({ id }, jwtConfig.secret, { expiresIn: '1h' });
    this.res.status(200).json({ token });
  }

  // Controller function for handling Google authentication
  async googleAuth() {
    const token = this.req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return this.res.status(401).json({ message: 'No token provided' });
    }

    const client = new OAuth2Client(googleConfig.clientId);

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleConfig.clientId,
      });

      const payload = ticket.getPayload();
      const user = await User.findOneAndUpdate(
        { email: payload.email },
        { email: payload.email, name: payload.name },
        { upsert: true, new: true }
      );

      const jwtToken = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: '1h' });
      this.res.status(200).json({ token: jwtToken });
    } catch (error) {
      this.res.status(401).json({ message: 'Failed to authenticate Google token' });
    }
  }

  // Controller function for handling Apple authentication
  async appleAuth() {
    const token = this.req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return this.res.status(401).json({ message: 'No token provided' });
    }

    try {
      const response = await axios.post('https://appleid.apple.com/auth/token', {
        client_id: appleConfig.clientId,
        client_secret: appleConfig.clientSecret,
        code: token,
        grant_type: 'authorization_code',
      });

      const user = await User.findOneAndUpdate(
        { email: response.data.email },
        { email: response.data.email, name: response.data.name },
        { upsert: true, new: true }
      );

      const jwtToken = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: '1h' });
      this.res.status(200).json({ token: jwtToken });
    } catch (error) {
      this.res.status(401).json({ message: 'Failed to authenticate Apple token' });
    }
  }

  // Controller function for handling Hasura GraphQL authentication
  async hasuraAuth() {
    const { email, password } = this.req.body;

    try {
      const hasuraUser = new HasuraUser();
      const user = await hasuraUser.authenticate(email, password);

      const token = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: '1h' });
      this.res.status(200).json({ token });
    } catch (error) {
      this.res.status(500).json({ message: 'Error authenticating with Hasura', error });
    }
  }
}

export default AuthController;
