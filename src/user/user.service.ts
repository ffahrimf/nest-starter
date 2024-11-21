import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FilterDto } from './dto/filter.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly UserRepository: EntityRepository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
  ) {}

  async findQuery(body: FilterDto): Promise<any> {
    try {
      const page: number = body.page || 1;
      const limit: number = body.limit || 10;
      const sortOrder = body.sort || 'asc';
      const qb = this.UserRepository.createQueryBuilder('b');

      qb.leftJoinAndSelect('b.company', 'company').leftJoinAndSelect(
        'b.role',
        'role',
      );

      if (body.id) {
        qb.andWhere({ id: body.id });
      }
      if (body.username) {
        qb.andWhere({ username: { $like: `%${body.username}%` } });
      }
      if (body.email) {
        qb.andWhere({ email: { $like: `%${body.email}%` } });
      }
      qb.andWhere({ deletedAt: null });

      qb.orderBy({ createdAt: sortOrder })
        .limit(limit)
        .offset((page - 1) * limit);

      const [items, total] = await qb.getResultAndCount();

      const users: GetUserDto[] = items.map((user) => {
        const { id, role, ...rest } = user;

        return {
          id,
          role,
          ...rest,
        } as GetUserDto;
      });

      return {
        items: users,
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

  async create(dto: CreateUserDto, userId: number): Promise<any> {
    const role = await this.roleRepository.findOne({ id: dto.role_id });
    if (!role) {
      throw new NotFoundException('Data role tidak ditemukan');
    }

    try {
      const hashedPwd = await bcrypt.hash(dto.password, 10);
      const user = new User(
        dto.username,
        dto.name,
        dto.email,
        hashedPwd,
        role,
        userId,
        userId,
      );
      const result = await this.em.persistAndFlush(user);

      return user;
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(dto: UpdatePasswordDto, userId: number): Promise<any> {
    const user = await this.UserRepository.findOne({ id: dto.id });
    if (!user) {
      throw new NotFoundException('Data user tidak ditemukan');
    }

    try {
      const hashedPwd = await bcrypt.hash(dto.password, 10);
      user.password = hashedPwd;
      this.em.persist(user);
      this.em.flush();

      return user;
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
