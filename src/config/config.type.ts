export type TLoggerLevel =
  | 'log'
  | 'error'
  | 'warn'
  | 'debug'
  | 'verbose'
  | 'fatal';
export const TLoggerLevelGuard = (value: unknown): value is TLoggerLevel =>
  typeof value === 'string' &&
  ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'].includes(value);
export type TNodeEnv = 'development' | 'production' | 'test';
export const TNodeEnvGuard = (value: unknown): value is TNodeEnv =>
  typeof value === 'string' &&
  ['development', 'production', 'test'].includes(value);
export type TPersistence = 'mongodb' | 'mysql' | 'postgres' | 'sqlite';
export const TPersistenceGuard = (value: unknown): value is TPersistence =>
  typeof value === 'string' && ['mongodb', 'mysql', 'postgres', 'sqlite'].includes(value);
export type TConfig = {
  port: string | number;
  loggerLevel: TLoggerLevel;
  nodeEnv: TNodeEnv;
  persistence: TPersistence;
  mongodbUri?: string;
  sqlHost?: string;
  sqlPort?: number;
  sqlUsername?: string;
  sqlPassword?: string;
  sqlDatabase?: string;
  sqlitePath?: string;
  jwtSecret: string;
  apiKeys: string[];
  fastifySecureSessionKey: string;
  // Email configuration
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser?: string;
  smtpPass?: string;
  emailFrom: string;
  // Application URLs
  appUrl: string;
  frontendUrl: string;
};
export const TConfigGuard = (value: unknown): value is TConfig =>
  typeof value === 'object' &&
  value !== null &&
  [
    'port',
    'loggerLevel',
    'nodeEnv',
    'persistence',
    'mongodbUri',
    'sqlHost',
    'sqlPort',
    'sqlUsername',
    'sqlPassword',
    'sqlDatabase',
    'sqlitePath',
    'jwtSecret',
    'apiKeys',
    'fastifySecureSessionKey',
    'smtpHost',
    'smtpPort',
    'smtpSecure',
    'emailFrom',
    'appUrl',
    'frontendUrl',
  ]
    .map((key) => value.hasOwnProperty(key))
    .every((hasKey) => hasKey);
