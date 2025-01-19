import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi, { Schema } from 'joi';
import response from '../utils/response.util';

function ValidationMiddleware(schema: Schema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const validatedBody = await schema.validateAsync(req.body, {
                abortEarly: false, // Return all validation errors, not just the first
                allowUnknown: false, // Disallow unknown fields for better security
                stripUnknown: true, // Remove unknown fields from the request body
            });

            req.body = validatedBody;
            next();
        } catch (error) {
            if (error instanceof Joi.ValidationError) {
                const errors = error.details.map((err: Joi.ValidationErrorItem) => ({
                    message: err.message,
                    path: err.path.join('.'),
                }));
                res.status(422).json(response.error('Validation Error', errors));
            } else {
                next(error); // Forward unexpected errors to the error handler
            }
        }
    };
}

export default ValidationMiddleware;
