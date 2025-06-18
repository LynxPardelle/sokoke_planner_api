/**
 * Configuration Loader - Environment Variable Processing
 * 
 * This module loads and transforms environment variables into a typed
 * configuration object. It provides default values for optional settings
 * and validates critical configuration through type guards.
 * 
 * Features:
 * - Environment variable loading with defaults
 * - Type-safe configuration object creation
 * - Validation through type guards
 * - Support for comma-separated arrays
 * - Secure handling of sensitive data
 * 
 * @author Lynx Pardelle
 * @version 1.0.0
 * @since 2024-01-10
 */

import {
  TConfig,
  TLoggerLevelGuard,
  TNodeEnvGuard,
  TPersistenceGuard,
} from './config.type';

/**
 * Configuration loader function
 * 
 * Processes environment variables and creates a typed configuration object.
 * Provides sensible defaults for development and validates critical settings.
 * 
 * Environment Variables:
 * - PORT: Server port number (default: 3000)
 * - LOGGER_LEVEL: Logging level (default: 'log')
 * - NODE_ENV: Environment name (default: 'development')
 * - PERSISTENCE: Database type (default: 'mongodb')
 * - MONGODB_URI: MongoDB connection string (required in production)
 * - JWT_SECRET: JWT signing secret (required)
 * - API_KEYS: Comma-separated list of valid API keys
 * - fastifySecureSessionKey: Fastify session encryption key
 * 
 * @returns {TConfig} Typed configuration object with validated values
 * 
 * @example
 * ```typescript
 * // Usage in ConfigModule
 * ConfigModule.forRoot({
 *   load: [configLoader],
 *   validationSchema: configSchema,
 * })
 * 
 * // Accessing in services
 * const port = this.configService.get<number>('port');
 * const dbUri = this.configService.get<string>('mongodbUri');
 * ```
 */
export const configLoader = (): TConfig => {
  return {
    // Server configuration
    port: process.env.PORT || 3000,
    
    // Logging configuration with validation
    loggerLevel: TLoggerLevelGuard(process.env.LOGGER_LEVEL)
      ? process.env.LOGGER_LEVEL
      : 'log',
    
    // Environment configuration with validation
    nodeEnv: TNodeEnvGuard(process.env.NODE_ENV)
      ? process.env.NODE_ENV
      : 'development',
    
    // Database persistence type with validation
    persistence: TPersistenceGuard(process.env.PERSISTENCE)
      ? process.env.PERSISTENCE
      : 'mongodb',
    
    // Database connection string (empty string triggers validation error in production)
    mongodbUri: process.env.MONGODB_URI || '',
    
    // JWT secret for token signing (empty string triggers validation error)
    jwtSecret: process.env.JWT_SECRET || '',
    
    // API keys for external access (comma-separated list)
    apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],
    
    // Fastify secure session key for session encryption
    fastifySecureSessionKey: process.env.fastifySecureSessionKey ? process.env.fastifySecureSessionKey : '',
    
    // Email configuration
    smtpHost: process.env.SMTP_HOST || 'localhost',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    emailFrom: process.env.EMAIL_FROM || 'noreply@sokoke-planner.com',
    
    // Application URLs for email links
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  };
};
