import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LuxonDatetimeTransformer } from './transformers/luxon-datetime.transformer';
import { DateTime } from 'luxon';
import { UserFlags } from '../bitfields/userflags.bitfield';

const UserFlagsTransformer = {
  to: (value: UserFlags | number) => typeof value === 'number' ? value : value._bitfield,
  from: (value: number) => new UserFlags(value),
};

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() username: string;
  @Column() password: string;

  @Column({ nullable: true }) email: string;
  @Column({ default: false }) emailVerified: boolean = false;

  @Column({
    transformer: UserFlagsTransformer,
    default: 0,
    type: 'integer'
  })
  flags: UserFlags = new UserFlags(0);

  @Column({ default: 'https://cdn.lanny.dev/stickers/sara_ttr.png' }) avatarUrl: string;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: LuxonDatetimeTransformer
  }) createdAt: DateTime = DateTime.now();

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: LuxonDatetimeTransformer
  }) updatedAt: DateTime = DateTime.now();
}