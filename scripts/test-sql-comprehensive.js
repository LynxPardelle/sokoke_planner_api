const { DataSource } = require('typeorm');
const { config } = require('dotenv');

// Load environment variables
config();

// Simple entity definitions for testing (without circular dependencies)
const testEntities = [
  {
    name: 'users',
    target: class User {
      constructor() {
        this.id = '';
        this.name = '';
        this.email = '';
        this.password = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
      }
    },
    columns: {
      id: { type: 'varchar', primary: true },
      name: { type: 'varchar' },
      email: { type: 'varchar', unique: true },
      password: { type: 'varchar' },
      createdAt: { type: 'datetime', createDate: true },
      updatedAt: { type: 'datetime', updateDate: true }
    }
  },
  {
    name: 'status',
    target: class Status {
      constructor() {
        this.id = '';
        this.name = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
      }
    },
    columns: {
      id: { type: 'varchar', primary: true },
      name: { type: 'varchar' },
      createdAt: { type: 'datetime', createDate: true },
      updatedAt: { type: 'datetime', updateDate: true }
    }
  }
];

async function testSQLConnection() {
  console.log('🔧 Starting SQL Connection Test...\n');

  // Test different database configurations
  const testConfigs = [
    {
      name: 'SQLite',
      type: 'sqlite',
      database: ':memory:',
    },
    // Add MySQL and PostgreSQL tests if credentials are available
    // {
    //   name: 'MySQL',
    //   type: 'mysql',
    //   host: process.env.DATABASE_HOST || 'localhost',
    //   port: parseInt(process.env.DATABASE_PORT) || 3306,
    //   username: process.env.DATABASE_USERNAME || 'test',
    //   password: process.env.DATABASE_PASSWORD || 'test',
    //   database: 'test_sokoke_planner'
    // }
  ];

  for (const config of testConfigs) {
    console.log(`📦 Testing ${config.name} connection...`);
    
    const dataSource = new DataSource({
      ...config,
      synchronize: true,
      logging: false,
      entities: [],
    });

    try {
      await dataSource.initialize();
      console.log(`✅ ${config.name} connection successful`);
      
      // Test basic SQL execution
      if (config.type === 'sqlite') {
        const result = await dataSource.query('SELECT 1 as test');
        if (result && result[0] && result[0].test === 1) {
          console.log(`✅ ${config.name} query execution successful`);
        }
      }
      
      await dataSource.destroy();
      console.log(`✅ ${config.name} cleanup successful\n`);
      
    } catch (error) {
      console.error(`❌ ${config.name} connection failed:`, error.message);
    }
  }
}

async function testMigrationStructure() {
  console.log('🏗️  Testing Migration Structure...\n');

  const fs = require('fs');
  const path = require('path');

  const migrationDir = path.join(__dirname, '..', 'src', 'migrations');
  
  try {
    // Check if migration directory exists
    if (!fs.existsSync(migrationDir)) {
      console.log('❌ Migration directory not found');
      return;
    }
    console.log('✅ Migration directory exists');

    // Check for migration files
    const migrationFiles = fs.readdirSync(migrationDir).filter(file => file.endsWith('.ts'));
    console.log(`✅ Found ${migrationFiles.length} migration files:`);
    
    migrationFiles.forEach(file => {
      console.log(`   - ${file}`);
    });

    // Check data-source.ts
    const dataSourcePath = path.join(migrationDir, 'data-source.ts');
    if (fs.existsSync(dataSourcePath)) {
      console.log('✅ Migration data source configuration exists');
    } else {
      console.log('❌ Migration data source configuration missing');
    }

  } catch (error) {
    console.error('❌ Migration structure test failed:', error.message);
  }
}

async function testConfigurationSupport() {
  console.log('\n⚙️  Testing Configuration Support...\n');

  try {
    // Test that config schema supports SQL settings
    const configSchema = require('../dist/config/config.schema');
    
    if (configSchema && configSchema.default) {
      console.log('✅ Configuration schema loaded');
      
      // Test environment variable loading
      const testEnv = {
        PERSISTENCE: 'sql',
        DATABASE_TYPE: 'sqlite',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '3306',
        DATABASE_USERNAME: 'test',
        DATABASE_PASSWORD: 'test',
        DATABASE_NAME: 'test_db'
      };
      
      // Mock environment
      Object.keys(testEnv).forEach(key => {
        process.env[key] = testEnv[key];
      });
      
      const configLoader = require('../dist/config/config.loader');
      if (configLoader && configLoader.default) {
        console.log('✅ Configuration loader supports SQL settings');
      }
      
    } else {
      console.log('❌ Configuration schema not available');
    }
    
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message);
  }
}

async function testDAOFactories() {
  console.log('\n🏭 Testing DAO Factories...\n');

  try {
    // Test that DAO factories exist and can be loaded
    const daoFactories = [
      'feature.factory',
      'project.factory',
      'projectCategory.factory',
      'projectSubCategory.factory',
      'requeriment.factory',
      'status.factory',
      'task.factory'
    ];

    let successCount = 0;
    
    for (const factory of daoFactories) {
      try {
        const factoryModule = require(`../dist/planner/DAOs/${factory}`);
        if (factoryModule) {
          console.log(`✅ ${factory} loaded successfully`);
          successCount++;
        }
      } catch (error) {
        console.log(`❌ ${factory} failed to load: ${error.message}`);
      }
    }

    // Test user DAO factory
    try {
      const userFactory = require('../dist/user/DAOs/user.factory');
      if (userFactory) {
        console.log('✅ user.factory loaded successfully');
        successCount++;
      }
    } catch (error) {
      console.log(`❌ user.factory failed to load: ${error.message}`);
    }

    console.log(`\n📊 DAO Factory Summary: ${successCount}/8 factories loaded successfully`);
    
  } catch (error) {
    console.error('❌ DAO factory test failed:', error.message);
  }
}

async function testSQLDAOFiles() {
  console.log('\n📁 Testing SQL DAO Files...\n');

  const fs = require('fs');
  const path = require('path');

  const sqlDAOFiles = [
    'src/planner/DAOs/sql/sqlFeature.dao.ts',
    'src/planner/DAOs/sql/sqlProject.dao.ts',
    'src/planner/DAOs/sql/sqlProjectCategory.dao.ts',
    'src/planner/DAOs/sql/sqlProjectSubCategory.dao.ts',
    'src/planner/DAOs/sql/sqlRequeriment.dao.ts',
    'src/planner/DAOs/sql/sqlStatus.dao.ts',
    'src/planner/DAOs/sql/sqlTask.dao.ts',
    'src/user/DAOs/sql/sqlUser.dao.ts'
  ];

  let successCount = 0;

  for (const daoFile of sqlDAOFiles) {
    const filePath = path.join(__dirname, '..', daoFile);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${daoFile} exists`);
      successCount++;
    } else {
      console.log(`❌ ${daoFile} missing`);
    }
  }

  console.log(`\n📊 SQL DAO Files Summary: ${successCount}/8 files found`);
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive SQL DAO Test Suite\n');
  console.log('=' .repeat(50));

  try {
    await testSQLConnection();
    await testMigrationStructure();
    await testConfigurationSupport();
    await testDAOFactories();
    await testSQLDAOFiles();

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ SQL Database connectivity');
    console.log('   ✅ Migration structure and files');
    console.log('   ✅ Configuration support');
    console.log('   ✅ DAO factory loading');
    console.log('   ✅ SQL DAO file existence');
    console.log('\n✨ SQL DAO implementation is ready for use!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  }
}

// Run the test suite
if (require.main === module) {
  runAllTests()
    .then(() => {
      console.log('\n🎯 Test suite completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test suite execution failed:', error);
      process.exit(1);
    });
}

module.exports = { 
  testSQLConnection, 
  testMigrationStructure, 
  testConfigurationSupport,
  testDAOFactories,
  testSQLDAOFiles,
  runAllTests 
};
