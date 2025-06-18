import * as Joi from 'joi';

export const configSchema = Joi.object({
  PORT: Joi.number().default(3000),
  LOGGER_LEVEL: Joi.string()
    .valid('log', 'error', 'warn', 'debug', 'verbose', 'fatal')
    .default('log'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PERSISTENCE: Joi.string().valid('mongodb').default('mongodb'),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  API_KEYS: Joi.string().optional(),
  FASTIFY_SECURE_SESSION_KEY: Joi.string().optional(),
  // Email configuration
  SMTP_HOST: Joi.string().default('localhost'),
  SMTP_PORT: Joi.number().default(587),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().default('noreply@sokoke-planner.com'),
  // Application URLs for email links
  APP_URL: Joi.string().default('http://localhost:3000'),
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),
});
