import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import {
  createApplication,
  getUserApplications,
  updateApplication as updateAppService,
  deleteApplication as deleteAppService,
} from '../services/application.service';

// Helper to safely extract user ID from the request added by the auth middleware
const getUserId = (req: Request): string => {
  const user = req.user as JwtPayload;
  if (!user || !user.id) {
    throw new Error('User not authenticated properly');
  }
  return user.id;
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const application = await createApplication(req.body, userId);
    
    res.status(201).json({
      message: 'Application created successfully',
      application,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating application';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const applications = await getUserApplications(userId);
    
    res.status(200).json({
      message: 'Applications retrieved successfully',
      applications,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error retrieving applications';
    res.status(400).json({ message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const updatedApplication = await updateAppService(id, req.body, userId);
    
    res.status(200).json({
      message: 'Application updated successfully',
      application: updatedApplication,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating application';
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    await deleteAppService(id, userId);
    
    res.status(200).json({
      message: 'Application deleted successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting application';
    res.status(400).json({ message });
  }
};
