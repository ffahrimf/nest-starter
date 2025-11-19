import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Role } from 'src/role/role.entity';
import { FilterDto } from './dto/filter.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
  ) {}

  async findQuery(body: FilterDto): Promise<any> {
    try {
      const page: number = body.page || 1;
      const limit: number = body.limit || 10;
      const sortOrder = body.sort || 'asc';
      const qb = this.roleRepository.createQueryBuilder('b');

      if (body.id) {
        qb.andWhere({ id: body.id });
      }

      if (body.name) {
        qb.andWhere({ name: { $like: `%${body.name}%` } });
      }

      qb.andWhere({ deletedAt: null });

      qb.orderBy({ id: sortOrder })
        .limit(limit)
        .offset((page - 1) * limit);

      const [items, total] = await qb.getResultAndCount();

      return {
        items: items,
        page: page,
        total: total,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(dto: CreateRoleDto, userId: number): Promise<any> {
    const role = new Role(dto.name, userId);
    const em = this.em.fork();
    try {
      em.persist(role);
      await em.flush();
      return role;
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number, userId: number): Promise<any> {
    const roleModel = await this.roleRepository.findOne({
      id: id,
    });
    if (!roleModel) {
      throw new NotFoundException('Role tidak ditemukan');
    }

    try {
      await roleModel.softDelete(this.em, userId);
      return true;
    } catch (error) {}
  }
}
