class Config {
  jwtConfig: { secret: string; expiresIn: string };
  googleConfig: { clientId: string; clientSecret: string; redirectUri: string };
  appleConfig: { clientId: string; clientSecret: string; redirectUri: string };
  hasuraConfig: { endpoint: string };

  constructor() {
    this.jwtConfig = {
      secret: process.env.JWT_SECRET || 'default_jwt_secret',
      expiresIn: '1h',
    };

    this.googleConfig = {
      clientId: process.env.GOOGLE_CLIENT_ID || 'default_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'default_google_client_secret',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback',
    };

    this.appleConfig = {
      clientId: process.env.APPLE_CLIENT_ID || 'default_apple_client_id',
      clientSecret: process.env.APPLE_CLIENT_SECRET || 'default_apple_client_secret',
      redirectUri: process.env.APPLE_REDIRECT_URI || 'http://localhost:5000/auth/apple/callback',
    };

    this.hasuraConfig = {
      endpoint: process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql',
    };
  }
}

const config = new Config();
export const { jwtConfig, googleConfig, appleConfig, hasuraConfig } = config;
