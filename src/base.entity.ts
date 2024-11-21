import {
  BeforeCreate,
  BeforeUpdate,
  EntityManager,
  Filter,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Filter({
  name: 'softDelete',
  cond: { deletedAt: null },
  default: true,
})
export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  uuid!: string;

  @Property()
  createdAt = new Date();

  @Property({ nullable: true, hidden: true })
  createdBy?: number;

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true, hidden: true })
  updatedBy?: number;

  @Property({ type: 'date', nullable: true, hidden: true })
  deletedAt?: Date;

  @Property({ nullable: true, hidden: true })
  deletedBy?: number;

  @BeforeCreate()
  async beforeCreate() {
    this.uuid = uuidv4();
  }
  @BeforeUpdate()
  async beforeUpdate() {
    if (this.deletedAt) {
      this.deletedAt = new Date();
    }
  }

  async softDelete(em: EntityManager, deletedBy: number) {
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    await em.persistAndFlush(this);
  }
}
