import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import all entities
import { UserEntity } from '@src/user/entities/user.entity';
import { StatusEntity } from '@src/planner/entities/status.entity';
import { FeatureEntity } from '@src/planner/entities/feature.entity';
import { TaskEntity } from '@src/planner/entities/task.entity';
import { ProjectEntity } from '@src/planner/entities/project.entity';
import { ProjectCategoryEntity } from '@src/planner/entities/projectCategory.entity';
import { ProjectSubCategoryEntity } from '@src/planner/entities/projectSubCategory.entity';
import { RequerimentEntity } from '@src/planner/entities/requeriment.entity';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const persistence = configService.get<string>('persistence');
            
            if (persistence === 'mongodb') {
              // Skip TypeORM setup for MongoDB
              return {
                type: 'sqlite',
                database: ':memory:',
                entities: [],
                synchronize: false,
                autoLoadEntities: false,
              };
            }

            const baseConfig = {
              entities: [
                UserEntity,
                StatusEntity,
                FeatureEntity,
                TaskEntity,
                ProjectEntity,
                ProjectCategoryEntity,
                ProjectSubCategoryEntity,
                RequerimentEntity,
              ],
              synchronize: configService.get('nodeEnv') === 'development',
              logging: configService.get('nodeEnv') === 'development',
              autoLoadEntities: true,
            };

            switch (persistence) {
              case 'mysql':
                return {
                  type: 'mysql',
                  host: configService.get<string>('sqlHost'),
                  port: configService.get<number>('sqlPort'),
                  username: configService.get<string>('sqlUsername'),
                  password: configService.get<string>('sqlPassword'),
                  database: configService.get<string>('sqlDatabase'),
                  ...baseConfig,
                };

              case 'postgres':
                return {
                  type: 'postgres',
                  host: configService.get<string>('sqlHost'),
                  port: configService.get<number>('sqlPort'),
                  username: configService.get<string>('sqlUsername'),
                  password: configService.get<string>('sqlPassword'),
                  database: configService.get<string>('sqlDatabase'),
                  ...baseConfig,
                };

              case 'sqlite':
                return {
                  type: 'sqlite',
                  database: configService.get<string>('sqlitePath') || './database.sqlite',
                  ...baseConfig,
                };

              default:
                throw new Error(`Unsupported persistence type: ${persistence}`);
            }
          },
          inject: [ConfigService],
        }),
      ],
      exports: [TypeOrmModule],
    };
  }

  static forFeature(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [TypeOrmModule],
    };
  }
}
