import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import pg from 'pg';
import ApiError from './helper/ApiError';
import { errorConverter, errorHandler } from './middlwares/error';
import db from './models';
import routes from './routes';

export const app: Express = express();

// enable cors
// options for cors middleware
app.use(
    cors({
        origin: '*',
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/test', async (req, res) => {
    res.status(200).send('Congratulations! API is working!');
});

app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);
pg.defaults.parseInt8 = true;

db.sequelize.sync();
