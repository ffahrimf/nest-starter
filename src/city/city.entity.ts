import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/base.entity';
import { Province } from 'src/province/province.entity';

@Entity()
export class City extends BaseEntity {
  @IsNotEmpty()
  @ManyToOne(() => Province)
  province!: Province;

  @Property()
  @IsNotEmpty()
  name!: string;

  constructor(
    province: Province,
    name: string,
    createdBy?: number,
    updatedBy?: number,
  ) {
    super();
    this.province = province;
    this.name = name;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}
