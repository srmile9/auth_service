import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { googleConfig, appleConfig, hasuraConfig } from '../config';

// Utility function for handling Google OAuth authentication
export const handleGoogleOAuth = async (token: string) => {
  const client = new OAuth2Client(googleConfig.clientId);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleConfig.clientId,
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new Error('Failed to authenticate Google token');
  }
};

// Utility function for handling Apple OAuth authentication
export const handleAppleOAuth = async (token: string) => {
  try {
    const response = await axios.post('https://appleid.apple.com/auth/token', {
      client_id: appleConfig.clientId,
      client_secret: appleConfig.clientSecret,
      code: token,
      grant_type: 'authorization_code',
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to authenticate Apple token');
  }
};

// Utility function for handling Hasura GraphQL authentication
export const handleHasuraAuth = async (token: string) => {
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

    return response.data.data.user;
  } catch (error) {
    throw new Error('Failed to authenticate Hasura token');
  }
};
