import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBFeatureDAO } from './mongo/mongoFeature.dao';
import { SQLFeatureDAO } from './sql/sqlFeature.dao';
import { TFeatureDAO } from '../types/daoPlanner.type';
export const FeatureDaoFactory: Provider<FactoryProvider<TFeatureDAO>> = {
  provide: 'FeatureDAO',
  useFactory: (
    configService: ConfigService,
    mongoDBFeatureDAO: MongoDBFeatureDAO,
    sqlFeatureDAO: SQLFeatureDAO,
  ) => {
    const persistence = configService.get('persistence');
    return {
      mongodb: mongoDBFeatureDAO,
      mysql: sqlFeatureDAO,
      postgres: sqlFeatureDAO,
      sqlite: sqlFeatureDAO,
    }[persistence];
  },
  inject: [ConfigService, MongoDBFeatureDAO, SQLFeatureDAO],
};
