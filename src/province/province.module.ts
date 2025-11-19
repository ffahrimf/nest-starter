import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { Response } from 'src/helper/response';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/jwt/jwt.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Province } from 'src/province/province.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Province] }),
    JwtModule.register(jwtConfig),
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService, Response, JwtUtilService],
})
export class ProvinceModule {}
