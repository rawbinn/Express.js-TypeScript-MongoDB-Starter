import { Error } from 'mongoose';
import UserModel from '../user/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/interfaces/user.interface';

class AuthService {
    private user = UserModel;

    async login(email: string, password: string) {
        try {
            const user: IUser | null = await this.user.findOne({ email });

            if (!user) throw new Error('Invalid Credentials');

            const match = await bcrypt.compare(password, user.password);
            if (!match) throw new Error('Invalid Credentials');

            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

            if (!accessTokenSecret || !refreshTokenSecret) {
                throw new Error('Token secrets are not defined');
            }

            const accessToken = this.generateToken(user._id, accessTokenSecret, '7d');
            const refreshToken = this.generateToken(user._id, refreshTokenSecret, '30d');

            return {
                accessToken,
                refreshToken,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An error occurred');
            }
        }
    }

    async register(user: IUser) {
        try {
            const existingUser = await this.user.findOne({ email: user.email });

            if (existingUser) throw new Error('User Already Exists');

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            return await this.user.create(user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An error occurred');
            }
        }
    }

    private generateToken(userId: string, secret: string, expiresIn: string) {
        return jwt.sign({ userId }, secret, { expiresIn });
    }
}

export default AuthService;
