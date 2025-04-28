import type { NextFunction, Request, Response } from 'express';

import type { RoleType } from '@/db/drizzle/schema/user/types/role.type';

import { CustomError } from '@/utils/custom_error';
import { HttpStatus } from '@/utils/enums/http-status';

export function isRoleValid(requiredRole: RoleType) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userRole = req.user.role;

      if (userRole !== requiredRole) {
        throw new CustomError(HttpStatus.FORBIDDEN);
      }

      return next();
    } catch {
      next(new CustomError(HttpStatus.FORBIDDEN));
    }
  };
}
