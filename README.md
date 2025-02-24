# auth_service

## Custom Authentication Service

This custom authentication service supports JWT tokens and providers like Google, Apple, and Hasura GraphQL. It is built using Node.js, Express, and TypeScript.

## Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/srmile9/auth_service.git
   cd auth_service
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   APPLE_CLIENT_ID=your_apple_client_id
   APPLE_CLIENT_SECRET=your_apple_client_secret
   HASURA_GRAPHQL_ENDPOINT=your_hasura_graphql_endpoint
   ```

4. Start the server:
   ```sh
   npm run dev
   ```

## JWT Tokens

### Generating JWT Tokens

To generate a JWT token, send a POST request to the `/auth/login` endpoint with the user's credentials. The server will respond with a JWT token.

### Verifying JWT Tokens

To verify a JWT token, include it in the `Authorization` header of your requests. The server will verify the token and grant access to protected routes.

## Google Authentication

### Setup

1. Go to the Google Developer Console and create a new project.
2. Enable the Google+ API for your project.
3. Create OAuth 2.0 credentials and get the client ID and client secret.
4. Add the client ID and client secret to the `.env` file.

### Usage

To authenticate with Google, send a GET request to the `/auth/google` endpoint. The server will redirect the user to the Google login page. After the user logs in, the server will handle the callback and generate a JWT token.

## Apple Authentication

### Setup

1. Go to the Apple Developer Console and create a new project.
2. Create a new service ID and enable Sign in with Apple.
3. Create a new key and get the client ID and client secret.
4. Add the client ID and client secret to the `.env` file.

### Usage

To authenticate with Apple, send a GET request to the `/auth/apple` endpoint. The server will redirect the user to the Apple login page. After the user logs in, the server will handle the callback and generate a JWT token.

## Hasura GraphQL Authentication

### Setup

1. Go to the Hasura Console and create a new project.
2. Get the GraphQL endpoint URL.
3. Add the GraphQL endpoint URL to the `.env` file.

### Usage

To authenticate with Hasura GraphQL, send a POST request to the `/auth/hasura` endpoint with the user's credentials. The server will respond with a JWT token.
