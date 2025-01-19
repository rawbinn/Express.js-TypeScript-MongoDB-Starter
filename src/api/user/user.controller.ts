import { NextFunction, Response, Request } from 'express';
import response from '../../utils/response.util';
import { IUser } from './interfaces/user.interface';
import UserService from './user.service';

class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    /**
     * Get all users
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next middleware function
     * @returns {Promise<void>}
     */
    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users: IUser[] = await this.userService.getUsers();
            res.status(200).json(response.success('Users retrieved successfully', users));
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;
