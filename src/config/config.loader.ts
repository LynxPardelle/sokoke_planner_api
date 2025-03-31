import {
  TConfig,
  TLoggerLevelGuard,
  TNodeEnvGuard,
  TPersistenceGuard,
} from './config.type';

export const configLoader = (): TConfig => {
  return {
    port: process.env.PORT || 3000,
    loggerLevel: TLoggerLevelGuard(process.env.LOGGER_LEVEL)
      ? process.env.LOGGER_LEVEL
      : 'log',
    nodeEnv: TNodeEnvGuard(process.env.NODE_ENV)
      ? process.env.NODE_ENV
      : 'development',
    persistence: TPersistenceGuard(process.env.PERSISTENCE)
      ? process.env.PERSISTENCE
      : 'mongodb',
    mongodbUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || '',
    apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],
    fastifySecureSessionKey: process.env.fastifySecureSessionKey ? process.env.fastifySecureSessionKey : ''
  };
};
