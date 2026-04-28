import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return errorResponse(res, 'Access denied. No token provided.', 401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return errorResponse(res, 'Invalid or expired token.', 403);
    req.user = user;
    next();
  });
};
