import {Router} from 'express';

import authMiddleware from '../middleware/auth';
import { getUserOrderHistory, getUserPortfolio, getUserTradeHistory } from '../controller/userController';

const router:Router = Router();

router.get('/orders',authMiddleware,getUserOrderHistory);

router.get('/portfolio',authMiddleware,getUserPortfolio);

router.get('/trades',authMiddleware, getUserTradeHistory);

export default router;