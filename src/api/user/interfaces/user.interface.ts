import { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    phoneNumber?: string;
    address?: string;
}
