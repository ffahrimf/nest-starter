import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SeederService } from './seeder/seeder.service';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UserModule, RoleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
