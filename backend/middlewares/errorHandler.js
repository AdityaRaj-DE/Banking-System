import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Something went wrong on the server';
  
  return errorResponse(res, message, status);
};
