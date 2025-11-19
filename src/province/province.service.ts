import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Province } from 'src/province/province.entity';
import { FilterDto } from './dto/filter.dto';
import { CreateProvinceDto } from './dto/create-province.dto';

@Injectable()
export class ProvinceService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Province)
    private readonly provinceRepository: EntityRepository<Province>,
  ) {}

  async findQuery(body: FilterDto): Promise<any> {
    try {
      const page: number = body.page || 1; // Default to page 1 if not provided
      const limit: number = body.limit || 10; // Default to 10 items per page if not provided
      const sortOrder = body.sort || 'asc';
      const qb = this.provinceRepository.createQueryBuilder('b');

      if (body.id) {
        qb.andWhere({ id: body.id });
      }

      if (body.name) {
        qb.andWhere({ name: { $like: `%${body.name}%` } });
      }

      qb.andWhere({ deletedAt: null });

      qb.orderBy({ createdAt: sortOrder })
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

  async create(dto: CreateProvinceDto, userId: number): Promise<any> {
    const province = new Province(dto.name, userId);
    const em = this.em.fork();
    try {
      em.persist(province);
      await em.flush();
      return province;
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
