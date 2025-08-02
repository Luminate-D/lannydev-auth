/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as JWT from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private env: ConfigService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.headers['authorization'];

    if (!token) return false;

    try {
      const jwt = JWT.verify(token, this.env.get('APP_SECRET')!) as { username: string };
      const user = await this.users.findOne({ where: { username: jwt.username } });

      request.user = user;

      return !!user;
    } catch {
      return false;
    }
  }
}
