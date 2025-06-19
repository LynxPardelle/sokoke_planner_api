import * as Joi from 'joi';

export const configSchema = Joi.object({
  PORT: Joi.number().default(4003),
  LOGGER_LEVEL: Joi.string()
    .valid('log', 'error', 'warn', 'debug', 'verbose', 'fatal')
    .default('log'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PERSISTENCE: Joi.string().valid('mongodb', 'mysql', 'postgres', 'sqlite').default('mongodb'),
  MONGODB_URI: Joi.string().when('PERSISTENCE', {
    is: 'mongodb',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  SQL_HOST: Joi.string().when('PERSISTENCE', {
    is: Joi.string().valid('mysql', 'postgres'),
    then: Joi.string().default('localhost'),
    otherwise: Joi.optional()
  }),
  SQL_PORT: Joi.number().when('PERSISTENCE', {
    is: 'mysql',
    then: Joi.number().default(3306),
    otherwise: Joi.when('PERSISTENCE', {
      is: 'postgres',
      then: Joi.number().default(5432),
      otherwise: Joi.optional()
    })
  }),
  SQL_USERNAME: Joi.string().when('PERSISTENCE', {
    is: Joi.string().valid('mysql', 'postgres'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  SQL_PASSWORD: Joi.string().when('PERSISTENCE', {
    is: Joi.string().valid('mysql', 'postgres'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  SQL_DATABASE: Joi.string().when('PERSISTENCE', {
    is: Joi.string().valid('mysql', 'postgres', 'sqlite'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  SQLITE_PATH: Joi.string().when('PERSISTENCE', {
    is: 'sqlite',
    then: Joi.string().default('./database.sqlite'),
    otherwise: Joi.optional()
  }),
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
  APP_URL: Joi.string().default('http://localhost:4003'),
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),
});
