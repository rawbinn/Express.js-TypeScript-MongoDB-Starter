import Joi from 'joi';

export const registerValidation = Joi.object({
    firstName: Joi.string().required().max(50).messages({
        'string.empty': 'First name is required',
        'string.max': 'First name cannot exceed 50 characters',
    }),
    lastName: Joi.string().required().max(50).messages({
        'string.empty': 'Last name is required',
        'string.max': 'Last name cannot exceed 50 characters',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().min(8).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
    }),
    phoneNumber: Joi.string().optional(),
    address: Joi.string().optional(),
});
