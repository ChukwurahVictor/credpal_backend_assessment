import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ServiceError {
  status: number;
  message: string;
}

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

const formatUserResponse = (user: IUser): AuthResult => ({
  token: generateToken(user._id.toString()),
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  },
});

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    const error: ServiceError = { status: 400, message: 'User already exists' };
    throw error;
  }

  // Create user
  const user = await User.create({ name, email, password });
  
  if (!user) {
    const error: ServiceError = { status: 400, message: 'Invalid user data' };
    throw error;
  }

  return formatUserResponse(user);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error: ServiceError = { status: 401, message: 'Invalid credentials' };
    throw error;
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error: ServiceError = { status: 401, message: 'Invalid credentials' };
    throw error;
  }

  return formatUserResponse(user);
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: ServiceError = { status: 404, message: 'User not found' };
    throw error;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
};
