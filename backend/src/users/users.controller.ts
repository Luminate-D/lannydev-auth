import {
  BadRequestException,
  Body,
  ConflictException,
  Controller, Get, Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import * as JWT from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class UsersController {
  constructor(
    private readonly env: ConfigService,
    private readonly users: UsersService
  ) {}

  @Get('/@me')
  async me(@Headers('Authorization') token: string): Promise<User | null> {
    if (!token || typeof token !== 'string') throw new BadRequestException('No token provided');

    try {
      const jwt = JWT.verify(token, this.env.get('APP_SECRET')!) as { username: string };
      const user = await this.users.find(jwt.username);

      if (!user) throw new UnauthorizedException('Token is valid, but user not found');

      return Object.assign({}, user, { password: undefined });
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      throw new UnauthorizedException(e.message);
    }
  }

  // TODO: use DTO
  @Post('/login')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async login(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    if (!username || !password) throw new BadRequestException('Username and password are required');

    const valid = await this.users.validate(username, password);
    if (!valid) throw new UnauthorizedException('Invalid username or password');

    const token = JWT.sign({ username }, this.env.get('APP_SECRET')!, {
      expiresIn: '30d'
    });

    return { token };
  }

  @Post('/register')
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  async register(@Body('username') username: string, @Body('password') password: string) {
    if (!username || !password) throw new BadRequestException('Username and password are required');

    if (username.length > 64) throw new BadRequestException('Username is too long, maximum 64 characters allowed');
    if (password.length < 8) throw new BadRequestException('Password is too short, minimum 8 characters required');
    if (password.length > 2048) throw new BadRequestException('Password is too long, maximum 2048 characters allowed');

    const user = await this.users.create(username, password);
    if(!user) throw new ConflictException('Username is already taken');

    return Object.assign({}, user, { password: undefined });
  }
}
