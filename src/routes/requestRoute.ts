import { Router } from 'express';
import RequestController from '../controllers/RequestController';

const router = Router();
const requestController = new RequestController();

router.get('/list', requestController.getRequestList);
router.get('/list/collection/:collection_id', requestController.getRequestListByCollectionId);
router.get('/collection/list', requestController.getCollectionList);
router.post('/collection', requestController.createCollection);
router.post('/', requestController.saveRequest);
router.post('/add-collection', requestController.addRequestToCollection);
router.get('/:id', requestController.getRequestById);
router.post('/perform', requestController.performRequest);

export default router;
