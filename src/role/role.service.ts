import { Injectable,HttpException,HttpStatus } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { Role } from 'src/role/role.entity';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class RoleService {
    constructor(
        private readonly em: EntityManager,
        @InjectRepository(Role)
        private readonly roleRepository: EntityRepository<Role>,
      ) {}
    
      async findQuery(body:FilterDto) : Promise<any>{
        try {
            const page: number = body.page || 1; // Default to page 1 if not provided
            const limit: number = body.limit || 10; // Default to 10 items per page if not provided
            const sortOrder = body.sort || 'asc';
            const qb = this.roleRepository.createQueryBuilder('b');
            
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
}
