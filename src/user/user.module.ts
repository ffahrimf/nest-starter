import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Response } from 'src/helper/response';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/jwt/jwt.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/user/user.entity';
import { Role } from 'src/role/role.entity';

import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User, Role] }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
  ],
  controllers: [UserController],
  providers: [UserService, Response, JwtUtilService],
})
export class UserModule {}
