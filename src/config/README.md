# Configuration Guide

## 📋 Overview

This guide covers the configuration system used in the Sokoke Planner API. The application uses a robust configuration management system with environment variables, validation schemas, and type-safe configuration loading.

## 🏗️ Configuration Architecture

### Components

| Component | File | Description |
|-----------|------|-------------|
| **Config Loader** | `config.loader.ts` | Loads and transforms environment variables |
| **Config Schema** | `config.schema.ts` | Joi validation schema for configuration |
| **Config Types** | `config.type.ts` | TypeScript interfaces for type safety |
| **Winston Config** | `winston.config.ts` | Logging configuration |

### Configuration Flow

```text
Environment Variables (.env)
    ↓
Config Loader (transformation)
    ↓
Joi Schema (validation)
    ↓
Type-safe Configuration Object
    ↓
Application Services
```

## 🔧 Environment Variables

### Required Variables

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sokoke_planner

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API Security
API_KEY=your-secure-api-key-for-external-access

# Server Configuration
PORT=4003
NODE_ENV=development

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/app.log

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# CORS Configuration
CORS_ORIGINS=http://localhost:4200,http://localhost:4003

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# File Upload (if applicable)
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-new-relic-key
```

### Environment-Specific Files

```text
.env                 # Default environment file
.env.development     # Development overrides
.env.test           # Test environment
.env.production     # Production configuration
.env.local          # Local developer overrides (git-ignored)
```

## 📝 Configuration Details

### Database Configuration

```typescript
interface DatabaseConfig {
  mongodbUri: string;           // MongoDB connection string
  mongoOptions?: {              // Additional Mongoose options
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    serverSelectionTimeoutMS: number;
  };
}
```

**Examples:**

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/sokoke_planner

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sokoke_planner

# MongoDB with authentication
MONGODB_URI=mongodb://username:password@host:port/sokoke_planner

# MongoDB replica set
MONGODB_URI=mongodb://host1:port1,host2:port2/sokoke_planner?replicaSet=rs0
```

### JWT Configuration

```typescript
interface JWTConfig {
  secret: string;               // Secret key for signing tokens
  expiresIn: string;           // Access token expiration
  refreshExpiresIn: string;    // Refresh token expiration
}
```

**Security Requirements:**
- JWT secret must be at least 32 characters
- Use different secrets for different environments
- Rotate secrets regularly in production

**Examples:**

```env
# Development
JWT_SECRET=your-development-secret-key-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Production
JWT_SECRET=complex-production-secret-with-special-chars-and-numbers-123!
JWT_EXPIRES_IN=5m
JWT_REFRESH_EXPIRES_IN=1d
```

### Server Configuration

```typescript
interface ServerConfig {
  port: number;                 // Server port
  nodeEnv: string;             // Environment (development/production/test)
  corsOrigins: string[];       // Allowed CORS origins
}
```

**Examples:**

```env
# Development
PORT=4003
NODE_ENV=development
CORS_ORIGINS=http://localhost:4200,http://localhost:4003

# Production
PORT=8080
NODE_ENV=production
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Logging Configuration

```typescript
interface LoggingConfig {
  level: string;               // Log level (error, warn, info, debug)
  filePath?: string;          // Log file path
  enableConsole: boolean;     // Enable console logging
  enableFile: boolean;        // Enable file logging
}
```

**Log Levels:**
- `error`: Error conditions only
- `warn`: Warning conditions and errors
- `info`: Informational messages, warnings, and errors
- `debug`: Debug information and all above

**Examples:**

```env
# Development
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/app.log

# Production
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/sokoke-planner/app.log
```

### Email Configuration

```typescript
interface EmailConfig {
  smtp: {
    host: string;               // SMTP server host
    port: number;              // SMTP server port
    secure: boolean;           // Use TLS/SSL
    auth: {
      user: string;            // SMTP username
      pass: string;            // SMTP password
    };
  };
  from: string;                // Default sender address
}
```

**Provider Examples:**

```env
# Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## 🔐 Security Configuration

### API Key Management

```typescript
interface SecurityConfig {
  apiKey: string;              // Master API key
  apiKeys?: string[];         // Multiple API keys for different clients
  rateLimitTtl: number;       // Rate limit time window (seconds)
  rateLimitLimit: number;     // Maximum requests per window
}
```

**Best Practices:**
- Use different API keys for different environments
- Implement API key rotation
- Monitor API key usage
- Use strong, randomly generated keys

### CORS Configuration

```typescript
interface CorsConfig {
  origins: string[];           // Allowed origins
  methods: string[];          // Allowed HTTP methods
  credentials: boolean;       // Allow credentials
}
```

**Examples:**

```env
# Development (permissive)
CORS_ORIGINS=http://localhost:4003,http://localhost:4200,http://localhost:8080

# Production (restrictive)
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com
```

## 🐳 Docker Configuration

### Environment Files for Docker

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    env_file:
      - .env
      - .env.production
    environment:
      - NODE_ENV=production
    ports:
      - "4003:4003"
```

### Docker-specific Variables

```env
# Docker network configuration
DOCKER_NETWORK=sokoke_network
DOCKER_VOLUME_DATA=/var/lib/mongodb
DOCKER_VOLUME_LOGS=/var/log/sokoke

# Container health check
HEALTH_CHECK_INTERVAL=30s
HEALTH_CHECK_TIMEOUT=10s
HEALTH_CHECK_RETRIES=3
```

## 🧪 Test Configuration

### Test Environment Setup

```env
# .env.test
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/sokoke_planner_test
JWT_SECRET=test-secret-key-for-testing-only
LOG_LEVEL=error
DISABLE_AUTH=true  # For testing without authentication
```

### Test-specific Configuration

```typescript
interface TestConfig {
  disableAuth: boolean;        // Disable authentication for tests
  testDatabaseUrl: string;     // Separate test database
  mockExternalServices: boolean; // Mock external APIs
}
```

## 🚀 Production Configuration

### Production Checklist

- [ ] Use strong, unique secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure proper CORS origins
- [ ] Set appropriate log levels
- [ ] Configure monitoring and alerting
- [ ] Set up health checks
- [ ] Configure database replica sets
- [ ] Enable rate limiting
- [ ] Set up automated backups

### Production Example

```env
# .env.production
NODE_ENV=production
PORT=8080

# Database (replica set)
MONGODB_URI=mongodb://user:pass@mongo1:27017,mongo2:27017,mongo3:27017/sokoke_planner?replicaSet=rs0&authSource=admin

# Security
JWT_SECRET=complex-production-secret-with-special-chars-2024!
JWT_EXPIRES_IN=5m
JWT_REFRESH_EXPIRES_IN=24h
API_KEY=prod-api-key-2024-secure-random-string

# CORS (only production domains)
CORS_ORIGINS=https://app.sokoke.com,https://admin.sokoke.com

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/sokoke-planner/app.log

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEW_RELIC_LICENSE_KEY=your-new-relic-license-key

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=1000
```

## 🔍 Configuration Validation

### Joi Schema Example

```typescript
// config.schema.ts
export const configSchema = Joi.object({
  // Database
  MONGODB_URI: Joi.string().uri().required(),
  
  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  
  // Server
  PORT: Joi.number().port().default(4003),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  // Security
  API_KEY: Joi.string().min(16).required(),
  CORS_ORIGINS: Joi.string().required(),
  
  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
});
```

### Validation Errors

Common validation errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `JWT_SECRET too short` | Secret less than 32 characters | Use a longer, more secure secret |
| `Invalid MONGODB_URI` | Malformed connection string | Check MongoDB URI format |
| `Invalid PORT` | Port out of range | Use port between 1-65535 |
| `Invalid LOG_LEVEL` | Unsupported log level | Use: error, warn, info, or debug |

## 🔧 Configuration Loading

### Custom Config Loader

```typescript
// config.loader.ts
export const configLoader = () => ({
  // Database
  mongodbUri: process.env.MONGODB_URI,
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Server
  port: parseInt(process.env.PORT, 10) || 4003,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || [],
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH,
  },
});
```

### Type-safe Configuration

```typescript
// config.type.ts
export interface AppConfig {
  mongodbUri: string;
  jwt: JWTConfig;
  port: number;
  nodeEnv: string;
  corsOrigins: string[];
  logging: LoggingConfig;
}

// Usage in services
constructor(private configService: ConfigService<AppConfig>) {}

// Type-safe access
const jwtSecret = this.configService.get('jwt.secret', { infer: true });
```

## 📚 Related Documentation

- [Environment Setup Guide](../README.md#environment-setup)
- [Docker Configuration](../docker-compose.yml)
- [Security Best Practices](../docs/SECURITY.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)

---

For additional configuration support, please refer to the main [API Documentation](../README.md) or create an issue in the repository.
