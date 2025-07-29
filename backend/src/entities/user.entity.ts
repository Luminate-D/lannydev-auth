import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LuxonDatetimeTransformer } from './transformers/luxon-datetime.transformer';
import { DateTime } from 'luxon';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() username: string;
  @Column() password: string;

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