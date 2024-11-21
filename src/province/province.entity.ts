import { Entity, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/base.entity';

@Entity()
export class Province extends BaseEntity {
  @Property()
  @IsNotEmpty()
  name!: string;

  constructor(name: string, createdBy?: number, updatedBy?: number) {
    super();
    this.name = name;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}
