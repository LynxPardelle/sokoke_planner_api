import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBProjectCategoryDAO } from './mongo/mongoProjectCategory.dao';
import { SQLProjectCategoryDAO } from './sql/sqlProjectCategory.dao';
import { TProjectCategoryDAO } from '../types/daoPlanner.type';
export const ProjectCategoryDaoFactory: Provider<
  FactoryProvider<TProjectCategoryDAO>
> = {
  provide: 'ProjectCategoryDAO',
  useFactory: (
    configService: ConfigService,
    mongoDBProjectCategoryDAO: MongoDBProjectCategoryDAO,
    sqlProjectCategoryDAO: SQLProjectCategoryDAO,
  ) => {
    const persistence = configService.get('persistence');
    return {
      mongodb: mongoDBProjectCategoryDAO,
      mysql: sqlProjectCategoryDAO,
      postgres: sqlProjectCategoryDAO,
      sqlite: sqlProjectCategoryDAO,
    }[persistence];
  },
  inject: [ConfigService, MongoDBProjectCategoryDAO, SQLProjectCategoryDAO],
};
