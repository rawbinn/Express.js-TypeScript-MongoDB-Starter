import request from 'supertest';
import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import express from 'express';
import UserController from '../user.controller';
import UserService from '../user.service';
import User from '../user.model';
import errorMiddleware from '../../../middleware/error.middleware';

jest.mock('../user.service');

const app = express();
app.use(express.json());

describe('UserController', () => {
    let userServiceMock: jest.Mocked<UserService>;
    let userController: UserController;

    beforeAll(() => {
        userServiceMock = new UserService() as jest.Mocked<UserService>;
        userController = new UserController(userServiceMock); // Inject mocked service
        app.get('/v1/users', userController.getUsers);
        app.use(errorMiddleware);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should retrieve all users', async () => {
            const users = [
                new User({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
                new User({ firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }),
            ];

            userServiceMock.getUsers.mockResolvedValue(users);

            const response = await request(app).get('/v1/users');

            // Assert response
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Users retrieved successfully');
            expect(response.body.data).toEqual(users.map((user) => JSON.parse(JSON.stringify(user))));
        });

        it('should return 500 if an error occurs', async () => {
            userServiceMock.getUsers.mockRejectedValue(new Error('Internal server error'));

            const response = await request(app).get('/v1/users');

            // Assert response
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Internal server error');
        });
    });
});
