import Application, { IApplication } from '../models/application.model';

export const createApplication = async (data: Partial<IApplication>, userId: string): Promise<IApplication> => {
  const application = await Application.create({
    ...data,
    user: userId,
  });

  return application;
};

export const getUserApplications = async (userId: string): Promise<IApplication[]> => {
  const applications = await Application.find({ user: userId }).sort({ createdAt: -1 });
  return applications;
};

export const updateApplication = async (id: string, data: Partial<IApplication>, userId: string): Promise<IApplication | null> => {
  // Add user: userId to the query to ensure the user can only update their own application
  const application = await Application.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true, runValidators: true }
  );

  if (!application) {
    throw new Error('Application not found or unauthorized');
  }

  return application;
};

export const deleteApplication = async (id: string, userId: string): Promise<IApplication | null> => {
  // Add user: userId to the query to ensure the user can only delete their own application
  const application = await Application.findOneAndDelete({ _id: id, user: userId });

  if (!application) {
    throw new Error('Application not found or unauthorized');
  }

  return application;
};
