import { Router } from 'express';

import { isAuthenticated } from '@/middleware/auth.middleware';
import { isRoleValid } from '@/middleware/role.middleware';

import * as requestsController from './requests.controller';

const router = Router();

router.get(
  '/list/:filter/:start/:end/:from/:to',
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

router.post('/', requestsController.createRequest);

router.post('/resp', isAuthenticated, isRoleValid('ADMIN'), requestsController.createResponse);

router.post('/cancel-all', requestsController.cancelAllRequests);

router.patch(
  '/take/:requestUid',
  isAuthenticated,
  isRoleValid('ADMIN'),
  requestsController.takeRequestOnWork
);

export default router;
