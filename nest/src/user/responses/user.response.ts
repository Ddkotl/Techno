import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  @Exclude()
  password: string;
  roles: $Enums.Role[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
