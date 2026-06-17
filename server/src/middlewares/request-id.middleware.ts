import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage } from '../utils/logger';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const headerName = 'x-request-id';
  const requestId = (req.headers[headerName] as string) || uuidv4();
  
  // Return the request ID in the response headers
  res.setHeader(headerName, requestId);
  
  // Set the context store and call the next handler
  asyncLocalStorage.run(requestId, () => {
    next();
  });
};

export default requestIdMiddleware;
