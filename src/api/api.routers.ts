import { Application, Request, Response, Router } from 'express';
import AuthRoutes from './auth/auth.routes';
import UserRoutes from './user/user.routes';
const useRoutes = (app: Application, apiVersion: number): void => {
    // Define the root endpoint
    app.get('/', (req: Request, res: Response) => {
        res.send('ExpressJs Starter API');
    });

    // Use API versioned routers
    const apiRouters = getApiRoutes();
    app.use(`/v${apiVersion}`, apiRouters);
};

/**
 * Function to get the API routers with their respective routes and middleware
 * @returns {Router} - Express Router instance
 */
const getApiRoutes = (): Router => {
    const apiRouters = Router();
    apiRouters.use('/auth', AuthRoutes);
    apiRouters.use('/users', UserRoutes);
    return apiRouters;
};

// Export the API object
const api = {
    useRoutes,
};

export default api;
