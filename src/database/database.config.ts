import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as entities from './entities';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'), 
  port: parseInt(configService.get<string>('POSTGRES_PORT') || '5432', 10),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: Object.values(entities),
  synchronize: true,
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});