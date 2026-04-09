import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// Route for user registration: POST /register
router.post('/register', register);

// Route for user login: POST /login
router.post('/login', login);

export default router;
