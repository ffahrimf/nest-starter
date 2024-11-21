import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SeederService } from './seeder/seeder.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { ProvinceModule } from './province/province.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    UserModule,
    RoleModule,
    AuthModule,
    ProvinceModule,
    CityModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
