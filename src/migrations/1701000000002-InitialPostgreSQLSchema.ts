import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialPostgreSQLSchema1701000000002 implements MigrationInterface {
  name = 'InitialPostgreSQLSchema1701000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "password" varchar NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_USERS" PRIMARY KEY ("id"),
        CONSTRAINT "UK_USERS_EMAIL" UNIQUE ("email")
      )
    `);

    // Create status table
    await queryRunner.query(`
      CREATE TABLE "status" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_STATUS" PRIMARY KEY ("id")
      )
    `);

    // Create project_categories table
    await queryRunner.query(`
      CREATE TABLE "project_categories" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_PROJECT_CATEGORIES" PRIMARY KEY ("id")
      )
    `);

    // Create project_sub_categories table
    await queryRunner.query(`
      CREATE TABLE "project_sub_categories" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "category_id" varchar NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_PROJECT_SUB_CATEGORIES" PRIMARY KEY ("id"),
        CONSTRAINT "FK_PROJECT_SUB_CATEGORIES_CATEGORY_ID" FOREIGN KEY ("category_id") REFERENCES "project_categories"("id") ON DELETE CASCADE
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "category_id" varchar NOT NULL,
        "sub_category_id" varchar,
        "status_id" varchar NOT NULL,
        "user_id" varchar NOT NULL,
        "start_date" timestamp,
        "end_date" timestamp,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_PROJECTS" PRIMARY KEY ("id"),
        CONSTRAINT "FK_PROJECTS_CATEGORY_ID" FOREIGN KEY ("category_id") REFERENCES "project_categories"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_PROJECTS_SUB_CATEGORY_ID" FOREIGN KEY ("sub_category_id") REFERENCES "project_sub_categories"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_PROJECTS_STATUS_ID" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_PROJECTS_USER_ID" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create features table
    await queryRunner.query(`
      CREATE TABLE "features" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "project_id" varchar NOT NULL,
        "status_id" varchar NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_FEATURES" PRIMARY KEY ("id"),
        CONSTRAINT "FK_FEATURES_PROJECT_ID" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_FEATURES_STATUS_ID" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE RESTRICT
      )
    `);

    // Create requeriments table
    await queryRunner.query(`
      CREATE TABLE "requeriments" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "feature_id" varchar NOT NULL,
        "status_id" varchar NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_REQUERIMENTS" PRIMARY KEY ("id"),
        CONSTRAINT "FK_REQUERIMENTS_FEATURE_ID" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_REQUERIMENTS_STATUS_ID" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE RESTRICT
      )
    `);

    // Create tasks table
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "requeriment_id" varchar NOT NULL,
        "status_id" varchar NOT NULL,
        "estimated_hours" integer,
        "actual_hours" integer,
        "due_date" timestamp,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_TASKS" PRIMARY KEY ("id"),
        CONSTRAINT "FK_TASKS_REQUERIMENT_ID" FOREIGN KEY ("requeriment_id") REFERENCES "requeriments"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_TASKS_STATUS_ID" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE RESTRICT
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

    // Create function to update updated_at timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = now();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers to automatically update updated_at
    await queryRunner.query(`CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
    await queryRunner.query(`CREATE TRIGGER update_status_updated_at BEFORE UPDATE ON "status" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
    await queryRunner.query(`CREATE TRIGGER update_project_categories_updated_at BEFORE UPDATE ON "project_categories" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
    await queryRunner.query(`CREATE TRIGGER update_project_sub_categories_updated_at BEFORE UPDATE ON "project_sub_categories" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
    await queryRunner.query(`CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON "projects" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
    await queryRunner.query(`CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON "features" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
    await queryRunner.query(`CREATE TRIGGER update_requeriments_updated_at BEFORE UPDATE ON "requeriments" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
    await queryRunner.query(`CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON "tasks" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_tasks_updated_at ON "tasks"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_requeriments_updated_at ON "requeriments"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_features_updated_at ON "features"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_projects_updated_at ON "projects"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_project_sub_categories_updated_at ON "project_sub_categories"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_project_categories_updated_at ON "project_categories"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_status_updated_at ON "status"`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON "users"`);

    // Drop function
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);

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
