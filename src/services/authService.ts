import jwt from 'jsonwebtoken';
import { jwtConfig, googleConfig, appleConfig, hasuraConfig } from '../config';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { User } from '../models/user';
import HasuraUser from '../models/hasuraUser';

class AuthService {
  async register(email: string, password: string) {
    const user = new User({ email, password });
    await user.save();
    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user || !user.comparePassword(password)) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: '1h' });
    return { token };
  }

  generateToken(id: string) {
    const token = jwt.sign({ id }, jwtConfig.secret, { expiresIn: '1h' });
    return { token };
  }

  refreshToken(id: string) {
    const token = jwt.sign({ id }, jwtConfig.secret, { expiresIn: '1h' });
    return { token };
  }

  async googleAuth(token: string) {
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
      return { token: jwtToken };
    } catch (error) {
      throw new Error('Failed to authenticate Google token');
    }
  }

  async appleAuth(token: string) {
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
      return { token: jwtToken };
    } catch (error) {
      throw new Error('Failed to authenticate Apple token');
    }
  }

  async hasuraAuth(email: string, password: string) {
    const hasuraUser = new HasuraUser();
    const user = await hasuraUser.authenticate(email, password);

    const token = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: '1h' });
    return { token };
  }
}

export default new AuthService();
