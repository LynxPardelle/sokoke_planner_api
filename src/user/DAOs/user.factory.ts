import { FactoryProvider, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBUserDAO } from './mongo/mongoUser.dao';
import { TUserDAO } from '../types/daoUser.type';
export const UserDaoFactory: Provider<FactoryProvider<TUserDAO>> = {
  provide: 'UserDAO',
  useFactory: (
    configService: ConfigService,
    MongoDBUserDAO: MongoDBUserDAO,
  ) => {
    return {
      mongodb: MongoDBUserDAO,
    }[configService.get('persistence')];
  },
  inject: [ConfigService, MongoDBUserDAO],
};
