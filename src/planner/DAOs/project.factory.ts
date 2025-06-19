import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBProjectDAO } from './mongo/mongoProject.dao';
import { SQLProjectDAO } from './sql/sqlProject.dao';
import { TProjectDAO } from '../types/daoPlanner.type';
export const ProjectDaoFactory: Provider<FactoryProvider<TProjectDAO>> = {
  provide: 'ProjectDAO',
  useFactory: (
    configService: ConfigService,
    mongoDBProjectDAO: MongoDBProjectDAO,
    sqlProjectDAO: SQLProjectDAO,
  ) => {
    const persistence = configService.get('persistence');
    return {
      mongodb: mongoDBProjectDAO,
      mysql: sqlProjectDAO,
      postgres: sqlProjectDAO,
      sqlite: sqlProjectDAO,
    }[persistence];
  },
  inject: [ConfigService, MongoDBProjectDAO, SQLProjectDAO],
};
