import type { InsertUser } from '@/db/drizzle/schema/user/schema';
import type { RoleType } from '@/db/drizzle/schema/user/types/role.type';

export class CreateUserDto implements InsertUser {
  mail!: string;
  role!: RoleType;
  password?: string;
}
