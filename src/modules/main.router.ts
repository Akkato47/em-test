import { Router } from 'express';

import authRouter from './auth/auth.routes';
import requestsRouter from './requests/requests.routes';
import userRouter from './user/user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/requests', requestsRouter);

export default router;
