import { Router } from 'express';
import { create, getAll, update, remove } from '../controllers/application.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Protect all application routes with JWT authentication
router.use(authenticateJWT);

// Route for creating a new job application: POST /
router.post('/', create);

// Route for retrieving all job applications: GET /
router.get('/', getAll);

// Route for updating a specific job application: PUT /:id
router.put('/:id', update);

// Route for deleting a specific job application: DELETE /:id
router.delete('/:id', remove);

export default router;
