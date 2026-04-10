import { Router } from 'express';
import { parseJobDescription, generateResumeSuggestions } from '../controllers/ai.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Protect all AI routes with JWT authentication
router.use(authenticateJWT);

// Route for parsing a job description: POST /parse
router.post('/parse', parseJobDescription);

// Route for generating resume suggestions: POST /resume
router.post('/resume', generateResumeSuggestions);

export default router;
