import type { NextFunction, Request, Response } from 'express';

import * as requestsService from './requests.service';
import { TRequestFilter } from './types/filter.types';
import { sendResponse } from '@/lib/reponse';
import { HttpStatus } from '@/utils/enums/http-status';
import { CancelAllRequestsDto, CreateRequestDto, CreateResponseDto } from './dto/create.dto';

export async function getRequests(
  req: Request<{ filter: TRequestFilter; start: string; end: string; from: string; to: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await requestsService.getRequests(
      req.params.filter,
      +req.params.start,
      +req.params.end,
      req.params.from,
      req.params.to
    );

    sendResponse(res, HttpStatus.OK, result);
  } catch (error) {
    next(error);
  }
}

export async function getResponseByRequest(
  req: Request<{ requestUid: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await requestsService.getResponseByRequest(req.params.requestUid);

    sendResponse(res, HttpStatus.OK, result);
  } catch (error) {
    next(error);
  }
}

export async function createRequest(
  req: Request<object, object, CreateRequestDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await requestsService.createRequest(req.body);

    sendResponse(res, HttpStatus.CREATED, result);
  } catch (error) {
    next(error);
  }
}

export async function takeRequestOnWork(
  req: Request<{ requestUid: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await requestsService.takeRequestOnWork(req.user.uid, req.params.requestUid);

    sendResponse(res, HttpStatus.OK, result);
  } catch (error) {
    next(error);
  }
}

export async function createResponse(
  req: Request<object, object, CreateResponseDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await requestsService.createResponse(req.user.uid, req.body);

    sendResponse(res, HttpStatus.CREATED, result);
  } catch (error) {
    next(error);
  }
}

export async function cancelAllRequests(
  req: Request<object, object, CancelAllRequestsDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await requestsService.cancelAllRequests(req.user.uid, req.body);

    sendResponse(res, HttpStatus.CREATED, result);
  } catch (error) {
    next(error);
  }
}
