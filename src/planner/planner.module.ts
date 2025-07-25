/**
 * Planner Module - Core Planning and Project Management
 * 
 * This module contains all the core functionality for project planning,
 * task management, and organizational features of the Sokoke Planner API.
 * 
 * Features:
 * - Project management with categories and subcategories
 * - Task creation, assignment, and tracking
 * - Feature and requirement management
 * - Status tracking and workflow management
 * - Repository pattern with DAO factories for data access
 * 
 * Architecture:
 * - Controllers: Handle HTTP requests and responses
 * - Services: Business logic and orchestration
 * - Repositories: Data access abstraction layer
 * - DAOs: Database-specific data access objects
 * - Factories: Create appropriate DAO instances
 * - Schemas: MongoDB/Mongoose schema definitions
 * 
 * @author Lynx Pardelle
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/* Module imports */
import { SharedModule } from '@src/shared/shared.module';
import { UserModule } from '@src/user/user.module';
import { DatabaseModule } from '@src/config/database.module';

/* HTTP Controllers - Handle REST API endpoints */
import { FeatureController } from './controllers/feature.controller';
import { ProjectController } from './controllers/project.controller';
import { ProjectCategoryController } from './controllers/projectCategory.controller';
import { ProjectSubCategoryController } from './controllers/projectSubCategory.controller';
import { RequerimentController } from './controllers/requeriment.controller';
import { StatusController } from './controllers/status.controller';
import { TaskController } from './controllers/task.controller';

/* Business Logic Services */
import { FeatureService } from './services/feature.service';
import { ProjectService } from './services/project.service';
import { ProjectCategoryService } from './services/projectCategory.service';
import { ProjectSubCategoryService } from './services/projectSubCategory.service';
import { RequerimentService } from './services/requeriment.service';
import { StatusService } from './services/status.service';
import { TaskService } from './services/task.service';

/* Data Access Repositories - Abstract data layer */
import FeatureRepository from './repositories/feature.repository';
import ProjectRepository from './repositories/project.repository';
import ProjectCategoryRepository from './repositories/projectCategory.repository';
import ProjectSubCategoryRepository from './repositories/projectSubCategory.repository';
import RequerimentRepository from './repositories/requeriment.repository';
import StatusRepository from './repositories/status.repository';
import TaskRepository from './repositories/task.repository';

/* DAO Factories - Create database-specific DAOs */
import { FeatureDaoFactory } from './DAOs/feature.factory';
import { ProjectDaoFactory } from './DAOs/project.factory';
import { ProjectCategoryDaoFactory } from './DAOs/projectCategory.factory';
import { ProjectSubCategoryDaoFactory } from './DAOs/projectSubCategory.factory';
import { StatusDaoFactory } from './DAOs/status.factory';
import { RequerimentDaoFactory } from './DAOs/requeriment.factory';
import { TaskDaoFactory } from './DAOs/task.factory';

/* Database Schemas */
import { plannerModuleSchemaFactory } from './schemas/planner.module.schema.factory';

/* MongoDB-specific Data Access Objects */
import { MongoDBFeatureDAO } from './DAOs/mongo/mongoFeature.dao';
import { MongoDBProjectDAO } from './DAOs/mongo/mongoProject.dao';
import { MongoDBProjectCategoryDAO } from './DAOs/mongo/mongoProjectCategory.dao';
import { MongoDBProjectSubCategoryDAO } from './DAOs/mongo/mongoProjectSubCategory.dao';
import { MongoDBRequerimentDAO } from './DAOs/mongo/mongoRequeriment.dao';
import { MongoDBStatusDAO } from './DAOs/mongo/mongoStatus.dao';
import { MongoDBTaskDAO } from './DAOs/mongo/mongoTask.dao';

/* SQL-specific Data Access Objects */
import { SQLFeatureDAO } from './DAOs/sql/sqlFeature.dao';
import { SQLProjectDAO } from './DAOs/sql/sqlProject.dao';
import { SQLProjectCategoryDAO } from './DAOs/sql/sqlProjectCategory.dao';
import { SQLProjectSubCategoryDAO } from './DAOs/sql/sqlProjectSubCategory.dao';
import { SQLRequerimentDAO } from './DAOs/sql/sqlRequeriment.dao';
import { SQLStatusDAO } from './DAOs/sql/sqlStatus.dao';
import { SQLTaskDAO } from './DAOs/sql/sqlTask.dao';

/* TypeORM Entities */
import { FeatureEntity } from './entities/feature.entity';
import { ProjectEntity } from './entities/project.entity';
import { ProjectCategoryEntity } from './entities/projectCategory.entity';
import { ProjectSubCategoryEntity } from './entities/projectSubCategory.entity';
import { RequerimentEntity } from './entities/requeriment.entity';
import { StatusEntity } from './entities/status.entity';
import { TaskEntity } from './entities/task.entity';

/**
 * Planner Module Configuration
 * 
 * This module encapsulates all planning-related functionality including:
 * - Project lifecycle management
 * - Task creation and tracking
 * - Feature and requirement specification
 * - Status workflow management
 * - Categorization and organization
 * 
 * The module uses a layered architecture:
 * 1. Controllers (HTTP layer)
 * 2. Services (Business logic)
 * 3. Repositories (Data abstraction)
 * 4. DAOs (Database implementation)
 */
@Module({
  imports: [
    // MongoDB schemas for all planner entities
    MongooseModule.forFeatureAsync(plannerModuleSchemaFactory),
    // TypeORM entities for SQL databases
    DatabaseModule.forFeature([
      FeatureEntity,
      ProjectEntity,
      ProjectCategoryEntity,
      ProjectSubCategoryEntity,
      RequerimentEntity,
      StatusEntity,
      TaskEntity,
    ]),
    // Shared utilities and common functionality
    SharedModule,
    // User management functionality
    UserModule,
  ],
  controllers: [
    // REST API controllers for each entity
    FeatureController,        // /feature/* endpoints
    ProjectController,        // /project/* endpoints
    ProjectCategoryController,// /project-category/* endpoints
    ProjectSubCategoryController, // /project-subcategory/* endpoints
    RequerimentController,    // /requirement/* endpoints
    StatusController,         // /status/* endpoints
    TaskController,           // /task/* endpoints
  ],
  providers: [
    /* Business Logic Services */
    FeatureService,
    ProjectService,
    ProjectCategoryService,
    ProjectSubCategoryService,
    RequerimentService,
    StatusService,
    TaskService,

    /* Data Access Repositories */
    FeatureRepository,
    ProjectRepository,
    ProjectCategoryRepository,
    ProjectSubCategoryRepository,
    RequerimentRepository,
    StatusRepository,
    TaskRepository,

    /* DAO Factory Providers */
    FeatureDaoFactory,
    ProjectDaoFactory,
    ProjectCategoryDaoFactory,
    ProjectSubCategoryDaoFactory,
    StatusDaoFactory,
    RequerimentDaoFactory,
    TaskDaoFactory,
    /* MongoDB Data Access Objects */
    MongoDBFeatureDAO,
    MongoDBProjectDAO,
    MongoDBProjectCategoryDAO,
    MongoDBProjectSubCategoryDAO,
    MongoDBRequerimentDAO,
    MongoDBStatusDAO,
    MongoDBTaskDAO,

    /* SQL Data Access Objects */
    SQLFeatureDAO,
    SQLProjectDAO,
    SQLProjectCategoryDAO,
    SQLProjectSubCategoryDAO,
    SQLRequerimentDAO,
    SQLStatusDAO,
    SQLTaskDAO,
  ],
  exports: [
    /* Export services for use in other modules */
    FeatureService,
    ProjectService,
    ProjectCategoryService,
    ProjectSubCategoryService,
    RequerimentService,
    StatusService,
    TaskService,

    /* Export repositories for direct data access if needed */
    FeatureRepository,
    ProjectRepository,
    ProjectCategoryRepository,
    ProjectSubCategoryRepository,
    RequerimentRepository,
    StatusRepository,
    TaskRepository,

    /* Export factories for creating DAOs in other modules */
    FeatureDaoFactory,
    ProjectDaoFactory,
    ProjectCategoryDaoFactory,
    ProjectSubCategoryDaoFactory,
    StatusDaoFactory,
    RequerimentDaoFactory,
    TaskDaoFactory,

    /* Export MongoDB module for schema access */
    MongooseModule,
  ],
})
export class PlannerModule { }
