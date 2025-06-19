import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

export default new DataSource({
  type: configService.get('DATABASE_TYPE') as any,
  host: configService.get('DATABASE_HOST') as string,
  port: parseInt(configService.get('DATABASE_PORT') || '3306'),
  username: configService.get('DATABASE_USERNAME') as string,
  password: configService.get('DATABASE_PASSWORD') as string,
  database: configService.get('DATABASE_NAME') as string,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
});
