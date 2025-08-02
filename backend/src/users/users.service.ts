import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  public constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async validate(username: string, password: string): Promise<boolean> {
    if(!username || !password) return false;

    const user = await this.users.findOneBy({ username });
    if(!user) return false;

    return await bcrypt.compare(password, user.password);
  }

  async find(username: string): Promise<User | null> {
    if(!username) return null;

    const user = await this.users.findOneBy({ username });
    if(!user) return null;

    return user;
  }

  async create(username: string, password: string): Promise<User | null> {
    const existing = await this.users.findOneBy({ username });
    if(existing) return null;

    const user = new User();
    user.username = username;
    user.password = await bcrypt.hash(password, 10);

    return await this.users.save(user);
  }

  async save(user: User): Promise<User> {
    return await this.users.save(user);
  }
}
