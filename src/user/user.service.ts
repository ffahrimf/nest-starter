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
import { GetUserDto } from './dto/get-user.dto';
import { UploadService } from 'src/upload/upload.service';
import { Superadmin } from 'src/superadmin/superadmin.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    @InjectRepository(User)
    private readonly UserRepository: EntityRepository<User>,
    @InjectRepository(Superadmin)
    private readonly superadminRepository: EntityRepository<Superadmin>,
    private readonly uploadService: UploadService,
  ) {}

  async findQuery(body: FilterDto): Promise<any> {
    try {
      const page: number = body.page || 1;
      const limit: number = body.limit || 10;
      const sortOrder = body.sort || 'asc';
      const qb = this.userRepository.createQueryBuilder('b');

      qb.leftJoinAndSelect('b.role', 'role');

      if (body.id) {
        qb.andWhere({ id: body.id });
      }
      if (body.name) {
        qb.andWhere({ name: { $like: `%${body.name}%` } });
      }
      if (body.username) {
        qb.andWhere({ username: { $like: `%${body.username}%` } });
      }
      if (body.email) {
        qb.andWhere({ email: { $like: `%${body.email}%` } });
      }
      if (body.role_id) {
        qb.andWhere({ role: body.role_id });
      }
      qb.andWhere({ deletedAt: null });

      qb.orderBy({ createdAt: sortOrder })
        .limit(limit)
        .offset((page - 1) * limit);

      const [items, total] = await qb.getResultAndCount();

      const usersWithPhotos = await Promise.all(
        items.map(async (user) => {
          let photoUrl: string | null = null;
          const roleName = user.role.name;

          switch (roleName) {
            case 'SUPERADMIN': {
              const profile = await this.superadminRepository.findOne(
                { user: user },
                { fields: ['id', 'photo'] },
              );
              if (profile && profile.photo) {
                photoUrl = this.uploadService.linkGenerator(
                  profile.photo,
                  `superadmin/profile-photo/${profile.id}`,
                );
              }
              break;
            }

            // Add other role
          }
          return { ...user, photo: photoUrl };
        }),
      );

      const users: GetUserDto[] = usersWithPhotos.map((user) => {
        const { id, role, photo, ...rest } = user;
        return { id, role, photo, ...rest } as GetUserDto;
      });

      return { items: users, page: page, total: total };
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(dto: CreateUserDto, userId: number): Promise<any> {
    const role = await this.roleRepository.findOne({ id: dto.role_id });
    if (!role) {
      throw new NotFoundException('Role tidak ditemukan');
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

      await this.em.persistAndFlush(user);

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

  async remove(id: number, userId: number): Promise<any> {
    const userModel = await this.UserRepository.findOne({ id: id });

    if (!userModel) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const superadminCount = await this.superadminRepository.count({
      user: { id },
    });

    if (superadminCount > 0) {
      throw new BadRequestException(
        'User tidak bisa dihapus karena masih memiliki data terkait',
      );
    }

    try {
      await userModel.softDelete(this.em, userId);
      return true;
    } catch (error) {}
  }
}
