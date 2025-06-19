import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBTaskDAO } from './mongo/mongoTask.dao';
import { SQLTaskDAO } from './sql/sqlTask.dao';
import { TTaskDAO } from '../types/daoPlanner.type';
export const TaskDaoFactory: Provider<FactoryProvider<TTaskDAO>> = {
  provide: 'TaskDAO',
  useFactory: (
    configService: ConfigService,
    mongoDBTaskDAO: MongoDBTaskDAO,
    sqlTaskDAO: SQLTaskDAO,
  ) => {
    const persistence = configService.get('persistence');
    return {
      mongodb: mongoDBTaskDAO,
      mysql: sqlTaskDAO,
      postgres: sqlTaskDAO,
      sqlite: sqlTaskDAO,
    }[persistence];
  },
  inject: [ConfigService, MongoDBTaskDAO, SQLTaskDAO],
};
