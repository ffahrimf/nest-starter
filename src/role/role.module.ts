import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Response } from 'src/helper/response';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/jwt/jwt.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Role } from 'src/role/role.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Role] }),
    JwtModule.register(jwtConfig),
  ],
  controllers: [RoleController],
  providers: [RoleService, Response, JwtUtilService],
})
export class RoleModule {}
