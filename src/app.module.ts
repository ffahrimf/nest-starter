import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CityModule } from './city/city.module';
import { MailModule } from './mail/mail.module';
import { ProvinceModule } from './province/province.module';
import { RoleModule } from './role/role.module';
import { SeederService } from './seeder/seeder.service';
import { UserModule } from './user/user.module';
import { SuperadminModule } from './superadmin/superadmin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    MailModule,
    RoleModule,
    ProvinceModule,
    CityModule,
    UserModule,
    AuthModule,
    SuperadminModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
