import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Superadmin extends BaseEntity {
  @IsNotEmpty()
  @ManyToOne(() => User)
  user!: User;

  @Property()
  photo?: string;

  @Property()
  @IsNotEmpty()
  name!: string;

  @Property()
  @IsNotEmpty()
  email!: string;

  @Property()
  @IsNotEmpty()
  phone_number!: string;

  @Property()
  @IsNotEmpty()
  birth_date!: Date;

  @Property()
  @IsNotEmpty()
  gender!: string;

  @Property()
  @IsNotEmpty()
  status!: boolean;
}
