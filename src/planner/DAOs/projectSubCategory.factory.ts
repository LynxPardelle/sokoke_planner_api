import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBProjectSubCategoryDAO } from './mongo/mongoProjectSubCategory.dao';
import { SQLProjectSubCategoryDAO } from './sql/sqlProjectSubCategory.dao';
import { TProjectSubCategoryDAO } from '../types/daoPlanner.type';
export const ProjectSubCategoryDaoFactory: Provider<
  FactoryProvider<TProjectSubCategoryDAO>
> = {
  provide: 'ProjectSubCategoryDAO',
  useFactory: (
    configService: ConfigService,
    mongoDBProjectSubCategoryDAO: MongoDBProjectSubCategoryDAO,
    sqlProjectSubCategoryDAO: SQLProjectSubCategoryDAO,
  ) => {
    const persistence = configService.get('persistence');
    return {
      mongodb: mongoDBProjectSubCategoryDAO,
      mysql: sqlProjectSubCategoryDAO,
      postgres: sqlProjectSubCategoryDAO,
      sqlite: sqlProjectSubCategoryDAO,
    }[persistence];
  },
  inject: [ConfigService, MongoDBProjectSubCategoryDAO, SQLProjectSubCategoryDAO],
};
