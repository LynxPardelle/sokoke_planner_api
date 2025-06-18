/**
 * Sokoke Planner API - Root Application Module
 * 
 * This is the root module of the application that orchestrates all other modules
 * and provides global configuration for the entire application.
 * 
 * Features:
 * - Global configuration management with validation
 * - MongoDB connection with Mongoose
 * - Module imports for all feature modules
 * - Environment-based configuration loading
 * 
 * @author Lynx Pardelle
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

/* Configuration imports */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configLoader } from './config/config.loader';
import { configSchema } from './config/config.schema';

/* Feature modules */
import { SharedModule } from './shared/shared.module';
import { NotificationModule } from './shared/notification.module';
import { PlannerModule } from './planner/planner.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

/* Core application components */
import { AppController } from './core/controllers/app.controller';
import { AppService } from './core/services/app.service';

/**
 * Root application module that configures and imports all feature modules
 * 
 * This module:
 * - Configures global settings (configuration, database)
 * - Imports all feature modules (Auth, Planner, User)
 * - Provides core application services
 * - Sets up MongoDB connection with environment-based URI
 */
@Module({  
  imports: [
    // Global configuration module with validation schema
    ConfigModule.forRoot({
      isGlobal: true, // Makes configuration available globally
      cache: true, // Cache configuration for better performance
      load: [configLoader], // Custom configuration loader
      validationSchema: configSchema, // Joi validation schema for environment variables
    }),

    // Enable scheduled tasks and cron jobs
    ScheduleModule.forRoot(),    
    // Feature modules
    AuthModule, // Authentication and authorization
    PlannerModule, // Core planning functionality (projects, tasks, etc.)
    UserModule, // User management
    
    // Database connection with async configuration
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUri'), // Get MongoDB URI from config
      }),
      inject: [ConfigService], // Inject ConfigService for async factory
    }),
    
    // Shared utilities and common functionality
    SharedModule,
    
    // Notification and scheduled tasks
    NotificationModule,
  ],
  controllers: [AppController], // Root controller for health checks and basic endpoints
  providers: [AppService, ConfigService], // Core application services
})
export class AppModule {}
