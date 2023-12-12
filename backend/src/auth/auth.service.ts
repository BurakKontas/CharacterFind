import { Injectable, Dependencies, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    let returnUser = structuredClone(user);
    returnUser.password = undefined;
    const payload = returnUser;
    return {
      access_token: await this.jwtService.signAsync(payload, { privateKey: jwtConstants.secret, expiresIn: '900s' }),
    };
  }
}
