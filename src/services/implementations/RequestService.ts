/* eslint-disable no-prototype-builtins */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Request } from 'express';
import httpStatus from 'http-status';
import axios from 'axios';
import { logger } from '../../config/logger';
import RequestDao from '../../dao/implementations/RequestDao';
import CollectionDao from '../../dao/implementations/CollectionDao';
import responseHandler from '../../helper/responseHandler';
import IRequestService from '../contracts/IRequestService';
import { httpVerbConstant, authTypeConstant } from '../../constants/HttpConstant';

export default class RequestService implements IRequestService {
    private requestDao: RequestDao;

    private collectionDao: CollectionDao;

    constructor() {
        this.requestDao = new RequestDao();
        this.collectionDao = new CollectionDao();
    }

    createCollection = async (req: Request) => {
        try {
            if (await this.collectionDao.create(req.body)) {
                return responseHandler.returnSuccess(httpStatus.CREATED, 'Collection created');
            }

            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong');
        } catch (error) {
            logger.error(error);

            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong');
        }
    };

    getCollectionList = async (req: Request) => {
        try {
            const collectionList = await this.collectionDao.findAll();

            return responseHandler.returnSuccess(httpStatus.OK, 'Collection list', collectionList);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                'Failed to get collection list'
            );
        }
    };

    getRequestList = async (req: Request) => {
        try {
            const data = await this.requestDao.findAll();
            return responseHandler.returnSuccess(httpStatus.OK, 'data', data);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'error');
        }
    };

    getRequestListByCollectionId = async (req: Request) => {
        try {
            const { collection_id } = req.params;
            const requestList = await this.requestDao.findByWhere({ collection_id }, [
                ['name', 'label'],
            ]);

            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Collection request list',
                requestList
            );
        } catch (error) {
            logger.error(error);

            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                'Failed to get collection data'
            );
        }
    };

    getAuthData = (authData) => {
        if (!authData) return false;

        if (Number(authData.type) === authTypeConstant.BEARER) {
            const tempObj = {
                token: authData.token,
            };

            // @ts-ignore
            return JSON.stringify(tempObj);
        }
        if (Number(authData.type) === authTypeConstant.BASIC) {
            const tempObj = {
                user_name: authData.user_name,
                password: authData.password,
            };

            // @ts-ignore
            return JSON.stringify(tempObj);
        }

        return false;
    };

    formRequestBody = (body) => ({
        name: body.name,
        request_url: body.url,
        request_type: body.request_type,
        params: body.query_params || null,
        authorization_type: body.auth_data?.type || 0,
        authorization_credentials: this.getAuthData(body.auth_data) || null,
        headers: body.headers || null,
        body_data: body.request_payload || null,
    });

    saveRequest = async (req: Request) => {
        try {
            const request = this.formRequestBody(req.body);
            if (await this.requestDao.create(request)) {
                return responseHandler.returnSuccess(httpStatus.CREATED, 'Request added');
            }

            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to add request');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to add request');
        }
    };

    addRequestToCollection = async (req: Request) => {
        try {
            const { request_id, collection_id, request_data } = req.body;

            if (request_id) {
                if (await this.requestDao.updateById({ collection_id }, request_id)) {
                    return responseHandler.returnSuccess(
                        httpStatus.CREATED,
                        'request added to collection'
                    );
                }
            }

            if (!request_id) {
                request_data.collection_id = collection_id;

                if (await this.requestDao.create(request_data)) {
                    return responseHandler.returnSuccess(
                        httpStatus.OK,
                        'request added to collection'
                    );
                }
            }

            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                'Failed to add request to a collection list'
            );
        } catch (e) {
            logger.error(e);

            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                'Failed to add request to a collection'
            );
        }
    };

    getRequestById = async (req: Request) => {
        try {
            const { id } = req.params;

            let requestData = await this.requestDao.findById(Number(id));

            if (requestData) {
                requestData = requestData.toJSON();

                return responseHandler.returnSuccess(httpStatus.OK, 'Request details', requestData);
            }

            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'No request data found');
        } catch (error) {
            logger.error(error);

            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                'Failed to get request data'
            );
        }
    };

    formQueryParam = (params) => {
        if (!params) {
            return '';
        }

        return Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join('&');
    };

    formAuthorization = (authData) => {
        const authType = Number(authData.type);

        if (authType === authTypeConstant.BEARER) {
            return `Bearer ${authData.token}`;
        }

        if (authType === authTypeConstant.BASIC) {
            const token = `${authData.user_name}:${authData.password}`;
            const encodedToken = Buffer.from(token).toString('base64');

            return `Basic ${encodedToken}`;
        }

        return '';
    };

    formHeader = (headerData) => {
        if (!headerData) {
            return '';
        }

        return headerData;
    };

    performRequest = async (req: Request) => {
        try {
            const { request_type, query_params, auth_data, url, request_payload, headers } =
                req.body;
            let auth = {
                Authorization: {},
            };
            let urlToHit = url.trim();

            // query parameter formation
            if (query_params) {
                const queryParams = this.formQueryParam(query_params);

                urlToHit = queryParams ? encodeURI(`${urlToHit}?${queryParams}`) : urlToHit;
            }

            // auth data formation
            if (auth_data) {
                auth.Authorization = this.formAuthorization(auth_data);
            }

            // format header
            if (headers) {
                const tempHeader = this.formHeader(headers);
                // @ts-ignore

                if (auth_data) {
                    delete tempHeader.Authorization;
                    auth = { ...auth, ...tempHeader };
                } else if (!auth_data && tempHeader.Authorization) {
                    const { Authorization, ...rest } = tempHeader;
                    auth.Authorization = Authorization;
                    auth = { ...auth, ...rest };
                }
            }

            //  GET
            if (Number(request_type) === httpVerbConstant.GET) {
                const res = await this.hitEndPointWithAxios('get', urlToHit, auth);

                return responseHandler.returnSuccess(httpStatus.OK, 'Response', res);
            }

            //  POST
            if (Number(request_type) === httpVerbConstant.POST) {
                const res = await this.hitEndPointWithAxios(
                    'POST',
                    urlToHit,
                    auth,
                    request_payload
                );

                return responseHandler.returnSuccess(httpStatus.OK, 'Response', res);
            }

            //  PUT
            if (Number(request_type) === httpVerbConstant.PUT) {
                const res = await this.hitEndPointWithAxios('put', urlToHit, auth, request_payload);

                return responseHandler.returnSuccess(httpStatus.OK, 'Response', res);
            }

            //  PATCH
            if (Number(request_type) === httpVerbConstant.PATCH) {
                const res = await this.hitEndPointWithAxios(
                    'PATCH',
                    urlToHit,
                    auth,
                    request_payload
                );

                return responseHandler.returnSuccess(httpStatus.OK, 'Response', res);
            }

            //  DELETE
            if (Number(request_type) === httpVerbConstant.DELETE) {
                const res = await this.hitEndPointWithAxios(
                    'DELETE',
                    urlToHit,
                    auth,
                    request_payload
                );

                return responseHandler.returnSuccess(httpStatus.OK, 'Response', res);
            }

            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to perform request');
        } catch (error) {
            console.log('-----errorrrrr----');
            console.log(error);
            console.log('---------');

            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to perform request');
        }
    };

    hitEndPointWithAxios = async (method, url, headerData, payload: string | object = '') => {
        try {
            console.log('------------');
            console.log(headerData);
            console.log('------------');
            const config = {
                method,
                url,
                headers: headerData,
                data: {},
            };

            if (method !== httpVerbConstant.GET && payload) {
                config.data = payload;
            }
            const res = await axios.request(config);

            return res.data;
        } catch (error) {
            // @ts-ignore
            const { data, status } = error.response;
            return {
                error: data,
                status,
            };
        }
    };
}
