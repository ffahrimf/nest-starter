import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Province } from 'src/province/province.entity';
import { City } from 'src/city/city.entity';
import { FilterDto } from './dto/filter.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Province)
    private readonly provinceRepository: EntityRepository<Province>,
    @InjectRepository(City)
    private readonly cityRepository: EntityRepository<City>,
  ) {}

  async findQuery(body: FilterDto): Promise<any> {
    try {
      const page: number = body.page || 1;
      const limit: number = body.limit || 10;
      const sortOrder = body.sort || 'asc';
      const qb = this.cityRepository.createQueryBuilder('b');

      if (body.id) {
        qb.andWhere({ id: body.id });
      }
      if (body.province_id) {
        qb.andWhere({ province: body.province_id });
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

  async create(dto: CreateCityDto, userId: number): Promise<any> {
    const province = await this.provinceRepository.findOne({
      id: dto.province_id,
    });
    if (!province) {
      throw new NotFoundException('Provinsi tidak ditemukan');
    }
    const city = new City(province, dto.name, userId);
    const em = this.em.fork();
    try {
      em.persist(city);
      await em.flush();
      return city;
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(dto: UpdateCityDto, userId: number): Promise<any> {
    const cityModel = await this.cityRepository.findOne({
      id: dto.id,
    });
    if (!cityModel) {
      throw new NotFoundException('Kota tidak ditemukan');
    }
    const em = this.em.fork();
    try {
      cityModel.name = dto.name;
      cityModel.updatedBy = userId;
      await this.em.flush();
      return cityModel;
    } catch (error) {
      await em.rollback();
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number, userId: number): Promise<any> {
    const cityModel = await this.cityRepository.findOne({
      id: id,
    });
    if (!cityModel) {
      throw new NotFoundException('Kota tidak ditemukan');
    }
    try {
      await cityModel.softDelete(this.em, userId);
      return true;
    } catch (error) {}
  }
}
