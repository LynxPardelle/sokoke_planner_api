import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Configuración de CORS para permitir localhost:4200
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  });  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require('class-validator'),
      transformerPackage: require('class-transformer'),
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Log all registered routes
  const server = app.getHttpAdapter().getInstance();
  console.log('=== Registered Routes ===');
  server.addHook('onRoute', (routeOptions) => {
    console.log(`${routeOptions.method}\t${routeOptions.url}`);
  });

  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

function handleError(error: unknown): void {
  // eslint-disable-next-line no-console
  console.error(error);
  // //  eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on('uncaughtException', handleError);
