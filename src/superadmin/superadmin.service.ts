import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Superadmin } from './superadmin.entity';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';
import { GetSuperadminDto } from './dto/get-superadmin.dto';
import { FilterDto } from './dto/filter.dto';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/user/user.entity';
import { UploadService } from 'src/upload/upload.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperadminService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Superadmin)
    private readonly superadminRepository: EntityRepository<Superadmin>,
    private readonly uploadService: UploadService,
  ) {}

  async create(dto: CreateSuperadminDto, userId: number): Promise<any> {
    const birthDate = new Date(dto.birth_date);
    const password = await bcrypt.hash(dto.password, 10);

    const userData = {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      role: 1,
      password: password,
    };

    const em = this.em.fork();
    await em.begin();

    try {
      const createdUser = this.userRepository.create(userData);
      await em.persistAndFlush(createdUser);

      const superadmin = this.superadminRepository.create({
        user: createdUser,
        name: dto.name,
        email: dto.email,
        phone_number: dto.phone_number,
        birth_date: birthDate,
        gender: dto.gender,
        status: dto.status,
        createdBy: userId,
        updatedBy: userId,
      });

      em.persist(superadmin);

      if (dto.photo != null) {
        await em.flush();

        const fileDecode = await this.uploadService.saveFiles(
          dto.photo,
          'superadmin/profile-photo/' + superadmin.id,
        );
        superadmin.photo = fileDecode.file;
      }

      await em.flush();
      await em.commit();

      return superadmin;
    } catch (error) {
      await em.rollback();
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findQuery(body: FilterDto): Promise<any> {
    try {
      const page: number = body.page || 1;
      const limit: number = body.limit || 10;
      const sortOrder = body.sort || 'asc';
      const qb = this.superadminRepository.createQueryBuilder('b');

      qb.leftJoinAndSelect('b.user', 'user');

      if (body.uuid) {
        qb.andWhere({ uuid: body.uuid });
      }
      if (body.user_id) {
        qb.andWhere({ user_id: body.user_id });
      }
      if (body.name) {
        qb.andWhere({ name: { $like: `%${body.name}%` } });
      }
      if (body.status === 'active') {
        qb.andWhere({ status: 1 });
      } else if (body.status === 'inactive') {
        qb.andWhere({ status: 0 });
      }

      qb.andWhere({ deletedAt: null });

      qb.orderBy({ createdAt: sortOrder })
        .limit(limit)
        .offset((page - 1) * limit);

      const [items, total] = await qb.getResultAndCount();

      const superadmin: GetSuperadminDto[] = items.map((superadmin) => {
        const { id, photo, user, ...rest } = superadmin;

        return {
          id,
          user,
          ...rest,
          thumbnailDecode: this.uploadService.linkGenerator(
            photo,
            `superadmin/profile-photo/${id}`,
          ),
        } as GetSuperadminDto;
      });

      return { items: superadmin, page: page, total: total };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(dto: UpdateSuperadminDto, userId: number): Promise<any> {
    const superadminModel = await this.superadminRepository.findOne({
      id: dto.id,
    });
    if (!superadminModel) {
      throw new NotFoundException('Karyawan Superadmin tidak ditemukan');
    }

    const birthDate = new Date(dto.birth_date);

    const em = this.em.fork();
    await em.begin();

    try {
      superadminModel.name = dto.name;
      superadminModel.phone_number = dto.phone_number;
      superadminModel.birth_date = birthDate;
      superadminModel.gender = dto.gender;
      superadminModel.status = dto.status;
      superadminModel.updatedBy = userId;

      if (dto.photo != null) {
        if (superadminModel.photo) {
          await this.uploadService.deleteFile(
            superadminModel.photo,
            superadminModel.id,
            'superadmin/profile-photo',
          );
        }

        const fileDecode = await this.uploadService.saveFiles(
          dto.photo,
          'superadmin/profile-photo/' + superadminModel.id,
        );
        superadminModel.photo = fileDecode.file;
      }

      await em.flush();
      await em.commit();

      return superadminModel;
    } catch (error) {
      await em.rollback();
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number, userId: number): Promise<any> {
    const superadminModel = await this.superadminRepository.findOne({ id });
    if (!superadminModel) {
      throw new NotFoundException('Karyawan Superadmin tidak ditemukan');
    }

    const em = this.em.fork();
    await em.begin();

    try {
      if (superadminModel.photo) {
        await this.uploadService.deleteFile(
          superadminModel.photo,
          superadminModel.id,
          'superadmin/profile-photo',
        );
      }

      await superadminModel.softDelete(em, userId);

      const userModel = await em.findOneOrFail(User, superadminModel.user.id);
      await userModel.softDelete(em, userId);

      await em.commit();
      return true;
    } catch (error) {
      await em.rollback();
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
