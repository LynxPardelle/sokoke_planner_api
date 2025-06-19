import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBUserDAO } from './mongo/mongoUser.dao';
import { SQLUserDAO } from './sql/sqlUser.dao';
import { TUserDAO } from '../types/daoUser.type';
export const UserDaoFactory: Provider<FactoryProvider<TUserDAO>> = {
  provide: 'UserDAO',
  useFactory: (
    configService: ConfigService,
    MongoDBUserDAO: MongoDBUserDAO,
    sqlUserDAO: SQLUserDAO,
  ) => {
    const persistence = configService.get('persistence');
    return {
      mongodb: MongoDBUserDAO,
      mysql: sqlUserDAO,
      postgres: sqlUserDAO,
      sqlite: sqlUserDAO,
    }[persistence];
  },
  inject: [ConfigService, MongoDBUserDAO, SQLUserDAO],
};
