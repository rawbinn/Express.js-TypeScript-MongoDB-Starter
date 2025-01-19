import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/http.exception';
import response from '../utils/response.util';

/**
 * Error handling middleware for Express.
 * @description Logs the error and sends a structured response to the client.
 */
const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).send(response.error(message));
};

export default errorMiddleware;
