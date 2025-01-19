import { NextFunction, Request, Response } from 'express';
import response from '../../utils/response.util';
import AuthService from './auth.service';

class AuthController {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * Login a user
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next middleware function
     * @returns {Promise<void>}
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.authService.login(email, password);
            // Create secure cookie with refresh token
            res.cookie('jwt', refreshToken, {
                httpOnly: true, //accessible only by web server
                secure: true, //https
                sameSite: 'none', //cross-site cookie
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Register a user
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next middleware function
     * @returns {Promise<void>}
     */
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json(response.success('User created successfully', user));
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
