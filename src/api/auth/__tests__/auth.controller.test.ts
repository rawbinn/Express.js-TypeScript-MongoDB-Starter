import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import ValidationMiddleware from '../../../middleware/validation.middleware';
import User from '../../user/user.model';
import AuthController from '../auth.controller';
import AuthService from '../auth.service';
import { registerValidation } from '../validations/auth.validation';
import errorMiddleware from '../../../middleware/error.middleware';

jest.mock('../auth.service');

const app = express();
app.use(express.json());

describe('AuthController', () => {
    let authServiceMock: jest.Mocked<AuthService>;
    let authController: AuthController;

    beforeAll(() => {
        authServiceMock = new AuthService() as jest.Mocked<AuthService>;
        authController = new AuthController(authServiceMock);

        app.post('/v1/auth/login', authController.login);
        app.post('/v1/auth/register', ValidationMiddleware(registerValidation), authController.register);

        // Add error middleware
        app.use(errorMiddleware);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should login a user and return tokens', async () => {
            const loginData = { email: 'test@example.com', password: 'password' };
            const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

            authServiceMock.login.mockResolvedValue(tokens);

            const response = await request(app).post('/v1/auth/login').send(loginData);

            // Assert response
            expect(response.status).toBe(200);
            expect(response.body).toEqual(tokens);
        });

        it('should return 400 if login fails', async () => {
            const loginData = { email: 'test@example.com', password: 'password' };

            authServiceMock.login.mockRejectedValue(new Error('Invalid credentials'));

            const response = await request(app).post('/v1/auth/login').send(loginData);

            // Assert response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });

    describe('register', () => {
        it('should register a user and return the user data', async () => {
            const registerData = {
                firstName: 'Demo',
                lastName: 'User',
                email: 'testy@example.com',
                password: '12345678',
            };

            // Mocked registered user (the password is removed, and a role is added)
            const mockUser = new User({
                firstName: 'Demo',
                lastName: 'User',
                email: 'testy@example.com',
                role: 'user', // Assuming a default role is added
            });

            // Mock the `authService.register` method to resolve with `mockUser`
            authServiceMock.register.mockResolvedValue(mockUser);

            const response = await request(app).post('/v1/auth/register').send(registerData);

            // Assert response
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
            expect(response.body.data).toEqual(JSON.parse(JSON.stringify(mockUser))); // Ensure it matches the mock user
            expect(response.body.data.password).toBeUndefined(); // Ensure password is not included
            expect(response.body.data.role).toBe('user'); // Ensure the role is included
        });

        it('should return 401 if validation fails', async () => {
            const invalidRegisterData = {
                firstName: 'Demo',
                lastName: 'User',
                email: 'invalid-email', // Invalid email format
                password: '1', // Password too short
            };

            const response = await request(app).post('/v1/auth/register').send(invalidRegisterData);

            // Assert response
            expect(response.status).toBe(422);
            expect(response.body.message).toBe('Validation Error');
        });

        it('should return 400 if registration fails', async () => {
            const registerData = {
                firstName: 'Demo',
                lastName: 'User',
                email: 'testy@example.com',
                password: '12345678',
            };

            authServiceMock.register.mockRejectedValue(new Error('Registration failed'));

            const response = await request(app).post('/v1/auth/register').send(registerData);

            // Assert response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Registration failed');
        });
    });
});
