/**
 * Sokoke Planner API - Main Application Entry Point
 * 
 * This file bootstraps the NestJS application with Fastify adapter,
 * configures CORS, validation pipes, and starts the HTTP server.
 * 
 * Features:
 * - Fastify HTTP adapter for better performance
 * - Global validation pipes with class-validator
 * - CORS configuration for frontend integration
 * - Route logging for debugging
 * - Environment-based configuration
 * 
 * @author Lynx Pardelle
 * @version 1.0.0
 */

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Bootstrap function - Initializes and starts the NestJS application
 * 
 * @returns {Promise<void>} Promise that resolves when the application starts
 */
async function bootstrap(): Promise<void> {
  // Create NestJS application with Fastify adapter for better performance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Configure CORS to allow frontend applications (Angular, React, etc.)
  app.enableCors({
    origin: ['http://localhost:4200'], // Add your frontend URLs here
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  });

  // Configure global validation pipe for automatic request validation
  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require('class-validator'), // Use class-validator for validation
      transformerPackage: require('class-transformer'), // Use class-transformer for data transformation
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw error when non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Development feature: Log all registered routes for debugging
  const server = app.getHttpAdapter().getInstance();
  console.log('=== Registered Routes ===');
  server.addHook('onRoute', (routeOptions) => {
    console.log(`${routeOptions.method}\t${routeOptions.url}`);
  });

  // Get configuration service and start the server
  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  
  // Start listening on all interfaces (0.0.0.0) for Docker compatibility
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Start the application and handle any startup errors
bootstrap().catch(handleError);

/**
 * Global error handler for application startup
 * 
 * @param {unknown} error - The error that occurred during startup
 */
function handleError(error: unknown): void {
  console.error('Application failed to start:', error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
