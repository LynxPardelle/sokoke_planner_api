import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBStatusDAO } from './mongo/mongoStatus.dao';
import { SQLStatusDAO } from './sql/sqlStatus.dao';
import { TStatusDAO } from '../types/daoPlanner.type';
export const StatusDaoFactory: Provider<FactoryProvider<TStatusDAO>> = {
  provide: 'StatusDAO',
  useFactory: (
    configService: ConfigService,
    mongoDBStatusDAO: MongoDBStatusDAO,
    sqlStatusDAO: SQLStatusDAO,
  ) => {
    const persistence = configService.get('persistence');
    return {
      mongodb: mongoDBStatusDAO,
      mysql: sqlStatusDAO,
      postgres: sqlStatusDAO,
      sqlite: sqlStatusDAO,
    }[persistence];
  },
  inject: [ConfigService, MongoDBStatusDAO, SQLStatusDAO],
};
