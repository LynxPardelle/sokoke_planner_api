import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSQLSchema1701000000000 implements MigrationInterface {
  name = 'InitialSQLSchema1701000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "password" varchar NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        UNIQUE("email")
      )
    `);

    // Create status table
    await queryRunner.query(`
      CREATE TABLE "status" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create project_categories table
    await queryRunner.query(`
      CREATE TABLE "project_categories" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create project_sub_categories table
    await queryRunner.query(`
      CREATE TABLE "project_sub_categories" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "category_id" varchar NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("category_id") REFERENCES "project_categories" ("id") ON DELETE CASCADE
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "category_id" varchar NOT NULL,
        "sub_category_id" varchar,
        "status_id" varchar NOT NULL,
        "user_id" varchar NOT NULL,
        "start_date" datetime,
        "end_date" datetime,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("category_id") REFERENCES "project_categories" ("id") ON DELETE RESTRICT,
        FOREIGN KEY ("sub_category_id") REFERENCES "project_sub_categories" ("id") ON DELETE SET NULL,
        FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON DELETE RESTRICT,
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    // Create features table
    await queryRunner.query(`
      CREATE TABLE "features" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "project_id" varchar NOT NULL,
        "status_id" varchar NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON DELETE RESTRICT
      )
    `);

    // Create requeriments table
    await queryRunner.query(`
      CREATE TABLE "requeriments" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "feature_id" varchar NOT NULL,
        "status_id" varchar NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("feature_id") REFERENCES "features" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON DELETE RESTRICT
      )
    `);

    // Create tasks table
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "requeriment_id" varchar NOT NULL,
        "status_id" varchar NOT NULL,
        "estimated_hours" integer,
        "actual_hours" integer,
        "due_date" datetime,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY ("requeriment_id") REFERENCES "requeriments" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON DELETE RESTRICT
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_PROJECTS_USER_ID" ON "projects" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_PROJECTS_STATUS_ID" ON "projects" ("status_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_FEATURES_PROJECT_ID" ON "features" ("project_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_FEATURES_STATUS_ID" ON "features" ("status_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_REQUERIMENTS_FEATURE_ID" ON "requeriments" ("feature_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_REQUERIMENTS_STATUS_ID" ON "requeriments" ("status_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_TASKS_REQUERIMENT_ID" ON "tasks" ("requeriment_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_TASKS_STATUS_ID" ON "tasks" ("status_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_TASKS_DUE_DATE" ON "tasks" ("due_date")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_TASKS_DUE_DATE"`);
    await queryRunner.query(`DROP INDEX "IDX_TASKS_STATUS_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_TASKS_REQUERIMENT_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_REQUERIMENTS_STATUS_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_REQUERIMENTS_FEATURE_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_FEATURES_STATUS_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_FEATURES_PROJECT_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_PROJECTS_STATUS_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_PROJECTS_USER_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_USERS_EMAIL"`);

    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "requeriments"`);
    await queryRunner.query(`DROP TABLE "features"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "project_sub_categories"`);
    await queryRunner.query(`DROP TABLE "project_categories"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
