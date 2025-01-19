import UserModel from './user.model'; // MongoDB model

class UserService {
    // Fetch user by ID
    async getUserById(userId: string) {
        try {
            // Abstract database logic here
            return await UserModel.findById(userId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Error fetching user');
            }
        }
    }

    // Fetch all users
    async getUsers() {
        try {
            // Abstract database logic here
            return await UserModel.find();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An error occurred while fetching users');
            }
        }
    }
}

export default UserService;
