import { Router } from 'express';

import requestRoute from './requestRoute';

const router = Router();

const defaultRoutes = [
    {
        path: '/request',
        route: requestRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
