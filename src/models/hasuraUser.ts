import axios from 'axios';
import { hasuraConfig } from '../config';

class HasuraUser {
  private endpoint: string;

  constructor() {
    this.endpoint = hasuraConfig.endpoint;
  }

  async authenticate(email: string, password: string) {
    const query = `
      query ($email: String!, $password: String!) {
        user(where: {email: {_eq: $email}, password: {_eq: $password}}) {
          id
          email
        }
      }
    `;

    const variables = { email, password };

    try {
      const response = await axios.post(this.endpoint, {
        query,
        variables,
      });

      const user = response.data.data.user[0];
      if (!user) {
        throw new Error('Invalid email or password');
      }

      return user;
    } catch (error) {
      throw new Error('Error authenticating with Hasura');
    }
  }

  async register(email: string, password: string) {
    const mutation = `
      mutation ($email: String!, $password: String!) {
        insert_user(objects: {email: $email, password: $password}) {
          returning {
            id
            email
          }
        }
      }
    `;

    const variables = { email, password };

    try {
      const response = await axios.post(this.endpoint, {
        query: mutation,
        variables,
      });

      const user = response.data.data.insert_user.returning[0];
      if (!user) {
        throw new Error('Error registering user');
      }

      return user;
    } catch (error) {
      throw new Error('Error registering with Hasura');
    }
  }
}

export default HasuraUser;
