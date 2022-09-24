import models from '../../models';
import SuperDao from './SuperDao';

const Request = models.request_api;

export default class RequestDao extends SuperDao {
    constructor() {
        super(Request);
    }
}
