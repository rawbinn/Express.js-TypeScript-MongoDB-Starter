import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import response from '../utils/response.util';

declare module 'express-serve-static-core' {
    interface Request {
        user?: unknown;
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization || (req.headers.Authorization as string);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json(response.error('ddd'));
            return;
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.ACCESS_TOKEN_SECRET;

        if (!secret) {
            throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
        }

        // Verify token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) res.status(403).json(response.error('Forbidden'));

            // Attach user to request object
            req.user = decoded;
            next();
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json(response.error('Unauthorized'));
        } else {
            res.status(401).json(response.error('An error occurred'));
        }
    }
};

export default authMiddleware;
