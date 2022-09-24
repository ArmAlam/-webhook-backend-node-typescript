import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IRequestService {
    getRequestList: (req: Request) => Promise<ApiServiceResponse>;
    getRequestListByCollectionId: (req: Request) => Promise<ApiServiceResponse>;
    saveRequest: (req: Request) => Promise<ApiServiceResponse>;
    getCollectionList: (req: Request) => Promise<ApiServiceResponse>;
    createCollection: (req: Request) => Promise<ApiServiceResponse>;
    addRequestToCollection: (req: Request) => Promise<ApiServiceResponse>;
    getRequestById: (req: Request) => Promise<ApiServiceResponse>;
    performRequest: (req: Request) => Promise<ApiServiceResponse>;
}
