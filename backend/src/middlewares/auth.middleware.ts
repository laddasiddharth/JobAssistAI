import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');

  // Check if no token or doesn't start with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied: No token provided' });
    return;
  }

  // Extract the token
  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Attach decoded user to the request object
    req.user = decoded;
    
    // Call next() to allow the request to proceed
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
