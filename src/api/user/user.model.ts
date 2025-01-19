import mongoose, { Schema, Model, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from './interfaces/user.interface';

// Email validation regex pattern
const emailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Custom email validator
const isEmail = {
    validator: (email: string): boolean => emailRegExp.test(email),
    message: 'INVALID_EMAIL',
};

// Custom unique email validator
const emailIsUnique = {
    validator: async function (this: IUser, email: string): Promise<boolean> {
        const existingUser = await mongoose.models.User.findOne({ email });
        return !existingUser || existingUser._id.equals(this._id);
    },
    message: 'ALREADY_USED_EMAIL',
};

// Define the User schema
const userSchema: Schema<IUser> = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required'],
            lowercase: true,
            validate: [isEmail, emailIsUnique],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        versionKey: false, // Removes the __v field
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password; // Removes the password field from the JSON response
                return ret;
            },
        },
    },
);

// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Export the User model
const User: Model<IUser> = model<IUser>('User', userSchema);
export default User;
