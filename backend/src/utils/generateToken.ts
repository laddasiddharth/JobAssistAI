import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * 
 * @param userId - The ID of the authenticated user.
 * @param expiresIn - Expiration time for the token (default: '1d').
 * @returns The signed JWT string.
 */
export const generateToken = (userId: string | object, expiresIn: string | number = '1d'): string => {
  const payload = { id: userId };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
};

export default generateToken;
