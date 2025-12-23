import {Router} from 'express';

import {signup,signin,getDetails} from '../controller/authController';
import authMiddleware from '../middleware/auth';

const router:Router = Router();

router.post('/signup',signup);

router.post('/login',signin);

router.get('/getDetails',authMiddleware, getDetails);

export default router;