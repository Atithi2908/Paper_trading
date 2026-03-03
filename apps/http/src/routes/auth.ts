import {Router} from 'express';

import {signup,signin} from '../controller/authController';
import authMiddleware from '../middleware/auth';
import testMonitorMiddleware from '../middleware/testing';

const router:Router = Router();
router.use(testMonitorMiddleware)
router.post('/signup',signup);

router.post('/login',signin);

export default router;