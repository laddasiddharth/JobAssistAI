import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user.model';
import generateToken from '../utils/generateToken';

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
  const token = generateToken(user.id);

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
  const token = generateToken(user.id);

  return { user, token };
};
