import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMySQLSchema1701000000001 implements MigrationInterface {
  name = 'InitialMySQLSchema1701000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UK_USERS_EMAIL\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create status table
    await queryRunner.query(`
      CREATE TABLE \`status\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create project_categories table
    await queryRunner.query(`
      CREATE TABLE \`project_categories\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create project_sub_categories table
    await queryRunner.query(`
      CREATE TABLE \`project_sub_categories\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`category_id\` varchar(255) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`FK_PROJECT_SUB_CATEGORIES_CATEGORY_ID\` (\`category_id\`),
        CONSTRAINT \`FK_PROJECT_SUB_CATEGORIES_CATEGORY_ID\` FOREIGN KEY (\`category_id\`) REFERENCES \`project_categories\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` text,
        \`category_id\` varchar(255) NOT NULL,
        \`sub_category_id\` varchar(255) DEFAULT NULL,
        \`status_id\` varchar(255) NOT NULL,
        \`user_id\` varchar(255) NOT NULL,
        \`start_date\` timestamp NULL DEFAULT NULL,
        \`end_date\` timestamp NULL DEFAULT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`FK_PROJECTS_CATEGORY_ID\` (\`category_id\`),
        KEY \`FK_PROJECTS_SUB_CATEGORY_ID\` (\`sub_category_id\`),
        KEY \`FK_PROJECTS_STATUS_ID\` (\`status_id\`),
        KEY \`FK_PROJECTS_USER_ID\` (\`user_id\`),
        CONSTRAINT \`FK_PROJECTS_CATEGORY_ID\` FOREIGN KEY (\`category_id\`) REFERENCES \`project_categories\` (\`id\`) ON DELETE RESTRICT,
        CONSTRAINT \`FK_PROJECTS_SUB_CATEGORY_ID\` FOREIGN KEY (\`sub_category_id\`) REFERENCES \`project_sub_categories\` (\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_PROJECTS_STATUS_ID\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\` (\`id\`) ON DELETE RESTRICT,
        CONSTRAINT \`FK_PROJECTS_USER_ID\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create features table
    await queryRunner.query(`
      CREATE TABLE \`features\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` text,
        \`project_id\` varchar(255) NOT NULL,
        \`status_id\` varchar(255) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`FK_FEATURES_PROJECT_ID\` (\`project_id\`),
        KEY \`FK_FEATURES_STATUS_ID\` (\`status_id\`),
        CONSTRAINT \`FK_FEATURES_PROJECT_ID\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_FEATURES_STATUS_ID\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\` (\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create requeriments table
    await queryRunner.query(`
      CREATE TABLE \`requeriments\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` text,
        \`feature_id\` varchar(255) NOT NULL,
        \`status_id\` varchar(255) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`FK_REQUERIMENTS_FEATURE_ID\` (\`feature_id\`),
        KEY \`FK_REQUERIMENTS_STATUS_ID\` (\`status_id\`),
        CONSTRAINT \`FK_REQUERIMENTS_FEATURE_ID\` FOREIGN KEY (\`feature_id\`) REFERENCES \`features\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_REQUERIMENTS_STATUS_ID\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\` (\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create tasks table
    await queryRunner.query(`
      CREATE TABLE \`tasks\` (
        \`id\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` text,
        \`requeriment_id\` varchar(255) NOT NULL,
        \`status_id\` varchar(255) NOT NULL,
        \`estimated_hours\` int DEFAULT NULL,
        \`actual_hours\` int DEFAULT NULL,
        \`due_date\` timestamp NULL DEFAULT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`FK_TASKS_REQUERIMENT_ID\` (\`requeriment_id\`),
        KEY \`FK_TASKS_STATUS_ID\` (\`status_id\`),
        KEY \`IDX_TASKS_DUE_DATE\` (\`due_date\`),
        CONSTRAINT \`FK_TASKS_REQUERIMENT_ID\` FOREIGN KEY (\`requeriment_id\`) REFERENCES \`requeriments\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_TASKS_STATUS_ID\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\` (\`id\`) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE \`tasks\``);
    await queryRunner.query(`DROP TABLE \`requeriments\``);
    await queryRunner.query(`DROP TABLE \`features\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(`DROP TABLE \`project_sub_categories\``);
    await queryRunner.query(`DROP TABLE \`project_categories\``);
    await queryRunner.query(`DROP TABLE \`status\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
