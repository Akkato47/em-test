import { and, between, eq, sql } from 'drizzle-orm';

import { db } from '@/db/drizzle/connect';
import { requests, responses } from '@/db/drizzle/schema/requests/schema';
import { users } from '@/db/drizzle/schema/user/schema';
import { CustomError } from '@/utils/custom_error';
import { ErrorMessage } from '@/utils/enums/errors';
import { HttpStatus } from '@/utils/enums/http-status';

import type { CancelAllRequestsDto, CreateRequestDto, CreateResponseDto } from './dto/create.dto';
import type { TRequestFilter } from './types/filter.types';

export const getRequests = async (
  filter: TRequestFilter,
  start: number,
  end: number,
  fromDate: string,
  toDate: string
) => {
  try {
    if (filter === 'All') {
      const allRequests = await db
        .select({
          uid: requests.uid,
          title: requests.title,
          body: requests.body,
          status: requests.status,
          contactMail: requests.contactMail,
          responsible: {
            uid: users.uid,
            mail: users.mail
          }
        })
        .from(requests)
        .where(between(sql`${requests.createdAt}::date`, fromDate, toDate))
        .limit(end)
        .offset(start)
        .leftJoin(users, eq(users.uid, requests.responsibleUid));
      return allRequests;
    } else {
      const allRequests = await db
        .select({
          uid: requests.uid,
          title: requests.title,
          body: requests.body,
          status: requests.status,
          responsible: {
            uid: users.uid,
            mail: users.mail
          }
        })
        .from(requests)
        .where(
          and(
            eq(requests.status, filter),
            between(sql`${requests.createdAt}::date`, fromDate, toDate)
          )
        )
        .limit(end)
        .offset(start)
        .leftJoin(users, eq(users.uid, requests.responsibleUid));
      return allRequests;
    }
  } catch (error) {
    throw error;
  }
};

export const createRequest = async (dto: CreateRequestDto) => {
  try {
    await db.insert(requests).values({ ...dto, status: 'New' });
    return true;
  } catch (error) {
    throw error;
  }
};

export const takeRequestOnWork = async (responsibleUid: string, requestUid: string) => {
  try {
    const [tryRequest] = await db.select().from(requests).where(eq(requests.uid, requestUid));

    if (!tryRequest) throw new CustomError(HttpStatus.BAD_REQUEST);
    if (tryRequest.responsibleUid !== null)
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorMessage.ERROR_REQUEST_IS_BUSY);

    await db
      .update(requests)
      .set({ responsibleUid, status: 'In progress' })
      .where(eq(requests.uid, requestUid));
  } catch (error) {
    throw error;
  }
};

export const getResponseByRequest = async (requestUid: string) => {
  try {
    const responseData = await db
      .select({
        uid: responses.uid,
        title: responses.title,
        body: responses.body,
        updatedAt: responses.updatedAt,
        author: {
          uid: users.uid,
          mail: users.mail
        }
      })
      .from(responses)
      .where(eq(responses.requestUid, requestUid))
      .leftJoin(users, eq(users.uid, responses.authorUid));

    return responseData;
  } catch (error) {
    throw error;
  }
};

export const cancelAllRequests = async (responsibleUid: string, dto: CancelAllRequestsDto) => {
  try {
    await db.transaction(async (tx) => {
      const allRequests = await tx
        .select()
        .from(requests)
        .where(eq(requests.status, 'In progress'));
      await tx
        .update(requests)
        .set({ status: 'Canceled' })
        .where(eq(requests.status, 'In progress'));
      const responsesToCreate = [];
      for (const request of allRequests) {
        responsesToCreate.push(
          db
            .insert(responses)
            .values({ ...dto, authorUid: responsibleUid, requestUid: request.uid })
        );
      }
      await Promise.all(responsesToCreate);
    });
  } catch (error) {
    throw error;
  }
};

export const createResponse = async (responsibleUid: string, dto: CreateResponseDto) => {
  try {
    const [tryRequest] = await db.select().from(requests).where(eq(requests.uid, dto.requestUid));

    if (!tryRequest) throw new CustomError(HttpStatus.BAD_REQUEST);
    if (tryRequest.responsibleUid !== responsibleUid) throw new CustomError(HttpStatus.FORBIDDEN);

    const { cancel, ...createDto } = dto;

    await db.transaction(async (tx) => {
      await tx.insert(responses).values({ ...createDto, authorUid: responsibleUid });
      await tx
        .update(requests)
        .set({ status: cancel ? 'Canceled' : 'Completed' })
        .where(eq(requests.uid, createDto.requestUid));
    });
  } catch (error) {
    throw error;
  }
};
