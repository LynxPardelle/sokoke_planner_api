import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBRequerimentDAO } from './mongo/mongoRequeriment.dao';
import { SQLRequerimentDAO } from './sql/sqlRequeriment.dao';
import { TRequerimentDAO } from '../types/daoPlanner.type';
export const RequerimentDaoFactory: Provider<FactoryProvider<TRequerimentDAO>> =
  {
    provide: 'RequerimentDAO',
    useFactory: (
      configService: ConfigService,
      mongoDBRequerimentDAO: MongoDBRequerimentDAO,
      sqlRequerimentDAO: SQLRequerimentDAO,
    ) => {
      const persistence = configService.get('persistence');
      return {
        mongodb: mongoDBRequerimentDAO,
        mysql: sqlRequerimentDAO,
        postgres: sqlRequerimentDAO,
        sqlite: sqlRequerimentDAO,
      }[persistence];
    },
    inject: [ConfigService, MongoDBRequerimentDAO, SQLRequerimentDAO],
  };
