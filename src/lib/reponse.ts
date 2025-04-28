import type { Response } from 'express';

import type { HttpStatus } from '@/utils/enums/http-status';
import { httpMessages } from '@/utils/http_messages';

export const sendResponse = (res: Response, statusCode: HttpStatus, message?: any) => {
  res.status(statusCode).json({ statusCode, message: message || httpMessages[statusCode] });
};
