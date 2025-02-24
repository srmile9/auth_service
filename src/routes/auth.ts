import { Router } from 'express';
import AuthController from '../controllers/authController';
import AuthMiddleware from '../middleware/auth';

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // User registration route
    this.router.post('/register', (req, res) => new AuthController(req, res).register());

    // User login route
    this.router.post('/login', (req, res) => new AuthController(req, res).login());

    // JWT token generation route
    this.router.post('/token', AuthMiddleware.verifyJwt, (req, res) => new AuthController(req, res).generateToken());

    // JWT token refresh route
    this.router.post('/token/refresh', AuthMiddleware.verifyJwt, (req, res) => new AuthController(req, res).refreshToken());

    // Google authentication route
    this.router.get('/google', AuthMiddleware.verifyGoogleToken, (req, res) => new AuthController(req, res).googleAuth());

    // Apple authentication route
    this.router.get('/apple', AuthMiddleware.verifyAppleToken, (req, res) => new AuthController(req, res).appleAuth());

    // Hasura GraphQL authentication route
    this.router.post('/hasura', AuthMiddleware.verifyHasuraToken, (req, res) => new AuthController(req, res).hasuraAuth());
  }
}

export default new AuthRoutes().router;
