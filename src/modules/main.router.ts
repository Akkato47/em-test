import { Router } from 'express';

import authRouter from './auth/auth.routes';
import userRouter from './user/user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
