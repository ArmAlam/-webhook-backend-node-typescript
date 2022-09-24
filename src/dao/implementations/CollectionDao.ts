import models from '../../models';
import SuperDao from './SuperDao';

const Collection = models.collection;

export default class CollectionDao extends SuperDao {
    constructor() {
        super(Collection);
    }
}
