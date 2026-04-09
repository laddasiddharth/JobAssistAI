import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const { user, token } = await registerUser(email, password);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error registering user';
    res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    // Specifically catching the invalid credentials scenario or other service errors
    const message = error instanceof Error ? error.message : 'Invalid credentials';
    res.status(401).json({ message });
  }
};
