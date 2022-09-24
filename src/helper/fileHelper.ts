import fs from 'fs';
import { logger } from '../config/logger';

const makeDir = (dirPath) => {
    try {
        if (fs.existsSync(dirPath)) {
            return true;
        }
        fs.mkdirSync(dirPath, { recursive: true });
        return true;
    } catch (e) {
        logger.error(e);
        return false;
    }
};

export { makeDir };
