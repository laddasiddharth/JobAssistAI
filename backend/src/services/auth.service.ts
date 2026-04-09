import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const registerUser = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the new user
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  // Generate a JWT token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '1d',
  });

  return { user, token };
};

export const loginUser = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare provided password with hashed password in database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '1d',
  });

  return { user, token };
};
