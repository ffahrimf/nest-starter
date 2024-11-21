import {
  Entity,
  Property,
  ManyToOne,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { Role } from 'src/role/role.entity';

@Entity()
export class User extends BaseEntity {
  @Property()
  @IsNotEmpty()
  username!: string;

  @Property()
  @IsNotEmpty()
  name!: string;

  @Property()
  @IsNotEmpty()
  email!: string;

  @Property()
  email_verified_at?: number;

  @Property({ hidden: true })
  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  @ManyToOne(() => Role)
  role!: Role;

  constructor(
    username: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    createdBy?: number,
    updatedBy?: number,
  ) {
    super();
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}
