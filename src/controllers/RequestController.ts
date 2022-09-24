import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import RequestService from '../services/implementations/RequestService';

export default class RequestController {
    private requestService: RequestService;

    constructor() {
        this.requestService = new RequestService();
    }

    public getRequestList = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.getRequestList(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };

    public getRequestListByCollectionId = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.getRequestListByCollectionId(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };

    public saveRequest = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.saveRequest(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };

    public getCollectionList = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.getCollectionList(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };

    public createCollection = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.createCollection(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };

    public addRequestToCollection = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.addRequestToCollection(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };

    public getRequestById = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.getRequestById(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };

    public performRequest = async (req: Request, res: Response) => {
        try {
            const results = await this.requestService.performRequest(req);
            res.status(results.statusCode).send(results.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    };
}
