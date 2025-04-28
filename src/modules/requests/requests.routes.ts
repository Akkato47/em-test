import { isAuthenticated } from '@/middleware/auth.middleware';
import { isRoleValid } from '@/middleware/role.middleware';
import { Router } from 'express';
import * as requestsController from './requests.controller';

const router = Router();

router.get(
  '/list/:filter/:start/:end',
  isAuthenticated,
  isRoleValid('ADMIN'),
  requestsController.getRequests
);

router.get(
  '/resp/:requestUid',
  isAuthenticated,
  isRoleValid('ADMIN'),
  requestsController.getResponseByRequest
);

router.post('/', isAuthenticated, isRoleValid('ADMIN'), requestsController.createRequest);

router.post('/resp', requestsController.createResponse);

router.post(
  '/cancel-all',
  isAuthenticated,
  isRoleValid('ADMIN'),
  requestsController.cancelAllRequests
);

router.patch(
  '/take/:requestUid',
  isAuthenticated,
  isRoleValid('ADMIN'),
  requestsController.takeRequestOnWork
);

export default router;
