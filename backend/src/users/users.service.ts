import { Injectable } from '@nestjs/common';
import AuthRoles from 'src/Enums/authRoles';

// This should be a real class/interface representing a user entity
export type User = {
  guid: string;
  username: string;
  password: string;
  role: AuthRoles;
};

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [
    {
      guid: '123-213-23-1-321-5532',
      username: 'john',
      password: 'changeme',
      role: AuthRoles.admin,
    },
    {
      guid: '123-213-23-1-321-5534',
      username: 'maria',
      password: 'guess',
      role: AuthRoles.user,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
