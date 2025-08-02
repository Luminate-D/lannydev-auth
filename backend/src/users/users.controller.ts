import {
  BadRequestException,
  Body,
  ConflictException,
  Controller, Get, Headers, Patch,
  Post, Req,
  UnauthorizedException, UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import * as JWT from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { Throttle } from '@nestjs/throttler';
import { PatchUserDTO } from './dto/patchuser.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('api')
export class UsersController {
  constructor(
    private readonly env: ConfigService,
    private readonly users: UsersService
  ) {}

  @Get('/@me')
  @UseGuards(AuthGuard)
  me(@Req() req: Request): Promise<Omit<User, 'password'>> {
    return Object.assign({}, req.user, { password: undefined });
  }

  @Patch('/@me')
  @UseGuards(AuthGuard)
  async updateMe(@Req() req: Request, @Body() data: PatchUserDTO): Promise<User> {
    req.user!.avatarUrl = data.avatarUrl;
    return await this.users.save(req.user!);
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
