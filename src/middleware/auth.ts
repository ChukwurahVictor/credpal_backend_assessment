import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { sendError } from '../utils/response';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Get user from token (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        sendError(res, 'Not authorized, user not found', 401);
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      sendError(res, 'Not authorized, token failed', 401);
      return;
    }
  }

  if (!token) {
    sendError(res, 'Not authorized, no token', 401);
    return;
  }
};

export default auth;
