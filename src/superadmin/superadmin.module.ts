import { Module } from '@nestjs/common';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/jwt/jwt.config';
import { Superadmin } from './superadmin.entity';
import { Response } from 'src/helper/response';
import { User } from 'src/user/user.entity';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Superadmin, User] }),
    JwtModule.register(jwtConfig),
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService, Response, JwtUtilService, UploadService],
})
export class SuperadminModule {}
