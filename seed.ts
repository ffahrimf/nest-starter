import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SeederService } from './src/seeder/seeder.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const seeder = appContext.get(SeederService);

  await seeder.seed();
  await appContext.close();
}

bootstrap();
