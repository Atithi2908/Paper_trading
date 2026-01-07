import {Router} from 'express';

import {signup,signin} from '../controller/authController';
import authMiddleware from '../middleware/auth';

const router:Router = Router();

router.post('/signup',signup);

router.post('/login',signin);

export default router;