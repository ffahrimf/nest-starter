import { defineConfig } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),

  driverOptions: {
    connection: { ssl: { rejectUnauthorized: false } },
  },

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.NODE_ENV !== 'production',
  metadataProvider: TsMorphMetadataProvider,
  // @ts-expect-error
  registerRequestContext: false,
  extensions: [Migrator, EntityGenerator, SeedManager],
  migrations: {
    transactional: true,
  },
});
