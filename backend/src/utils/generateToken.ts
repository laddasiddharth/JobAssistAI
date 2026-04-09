import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * 
 * @param userId - The ID of the authenticated user.
 * @param expiresIn - Expiration time for the token (default: '1d').
 * @returns The signed JWT string.
 */
export const generateToken = (userId: string | object, expiresIn: string | number = '1d'): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  const payload = { id: userId };
  
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export default generateToken;
