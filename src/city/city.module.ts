import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { Response } from 'src/helper/response';
import { JwtUtilService } from 'src/jwt/jwt-util.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/jwt/jwt.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { City } from 'src/city/city.entity';
import { Province } from 'src/province/province.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [City, Province] }),
    JwtModule.register(jwtConfig),
  ],
  controllers: [CityController],
  providers: [CityService, Response, JwtUtilService],
})
export class CityModule {}
