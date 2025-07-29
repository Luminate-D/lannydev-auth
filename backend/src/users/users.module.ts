import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ UsersService ],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ User ]),
  ],
  controllers: [ UsersController ]
})
export class UsersModule {}
