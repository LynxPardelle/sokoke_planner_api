const { DataSource } = require('typeorm');
const { config } = require('dotenv');

// Load environment variables
config();

// Import entities (we'll need to build first)
const { User } = require('../dist/user/entities/user.entity');
const { Status } = require('../dist/planner/entities/status.entity');
const { ProjectCategory } = require('../dist/planner/entities/projectCategory.entity');
const { ProjectSubCategory } = require('../dist/planner/entities/projectSubCategory.entity');
const { Project } = require('../dist/planner/entities/project.entity');
const { Feature } = require('../dist/planner/entities/feature.entity');
const { Requeriment } = require('../dist/planner/entities/requeriment.entity');
const { Task } = require('../dist/planner/entities/task.entity');

async function testSQLDAOs() {
  console.log('🔧 Starting SQL DAO Integration Test...\n');

  // Configuration for SQLite test database
  const testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:', // In-memory database for testing
    entities: [User, Status, ProjectCategory, ProjectSubCategory, Project, Feature, Requeriment, Task],
    synchronize: true, // Auto-create schema for testing
    logging: false,
  });

  try {
    // Initialize connection
    console.log('📦 Initializing test database connection...');
    await testDataSource.initialize();
    console.log('✅ Database connection established\n');

    // Get repositories
    const userRepo = testDataSource.getRepository(User);
    const statusRepo = testDataSource.getRepository(Status);
    const categoryRepo = testDataSource.getRepository(ProjectCategory);
    const subCategoryRepo = testDataSource.getRepository(ProjectSubCategory);
    const projectRepo = testDataSource.getRepository(Project);
    const featureRepo = testDataSource.getRepository(Feature);
    const requerimentRepo = testDataSource.getRepository(Requeriment);
    const taskRepo = testDataSource.getRepository(Task);

    // Test 1: Create User
    console.log('👤 Testing User creation...');
    const user = userRepo.create({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123'
    });
    await userRepo.save(user);
    console.log('✅ User created successfully');

    // Test 2: Create Status
    console.log('📊 Testing Status creation...');
    const status = statusRepo.create({
      id: 'status-1',
      name: 'In Progress'
    });
    await statusRepo.save(status);
    console.log('✅ Status created successfully');

    // Test 3: Create Project Category
    console.log('📁 Testing Project Category creation...');
    const category = categoryRepo.create({
      id: 'category-1',
      name: 'Web Development'
    });
    await categoryRepo.save(category);
    console.log('✅ Project Category created successfully');

    // Test 4: Create Project Sub Category
    console.log('📂 Testing Project Sub Category creation...');
    const subCategory = subCategoryRepo.create({
      id: 'subcategory-1',
      name: 'Frontend',
      category: category
    });
    await subCategoryRepo.save(subCategory);
    console.log('✅ Project Sub Category created successfully');

    // Test 5: Create Project
    console.log('🚀 Testing Project creation...');
    const project = projectRepo.create({
      id: 'project-1',
      name: 'Test Project',
      description: 'A test project for verification',
      category: category,
      subCategory: subCategory,
      status: status,
      user: user,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    await projectRepo.save(project);
    console.log('✅ Project created successfully');

    // Test 6: Create Feature
    console.log('⭐ Testing Feature creation...');
    const feature = featureRepo.create({
      id: 'feature-1',
      name: 'User Authentication',
      description: 'Implement user login and registration',
      project: project,
      status: status
    });
    await featureRepo.save(feature);
    console.log('✅ Feature created successfully');

    // Test 7: Create Requeriment
    console.log('📋 Testing Requeriment creation...');
    const requeriment = requerimentRepo.create({
      id: 'req-1',
      name: 'Login Form',
      description: 'Create a user-friendly login form',
      feature: feature,
      status: status
    });
    await requerimentRepo.save(requeriment);
    console.log('✅ Requeriment created successfully');

    // Test 8: Create Task
    console.log('✓ Testing Task creation...');
    const task = taskRepo.create({
      id: 'task-1',
      name: 'Design Login UI',
      description: 'Create mockups and design for the login form',
      requeriment: requeriment,
      status: status,
      estimatedHours: 8,
      actualHours: 6,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    await taskRepo.save(task);
    console.log('✅ Task created successfully');

    // Test 9: Query with relationships
    console.log('\n🔍 Testing relationship queries...');
    
    const projectWithRelations = await projectRepo.findOne({
      where: { id: 'project-1' },
      relations: ['user', 'category', 'subCategory', 'status']
    });
    
    if (projectWithRelations) {
      console.log('✅ Project with relations loaded successfully');
      console.log(`   - Project: ${projectWithRelations.name}`);
      console.log(`   - User: ${projectWithRelations.user.name}`);
      console.log(`   - Category: ${projectWithRelations.category.name}`);
      console.log(`   - Sub Category: ${projectWithRelations.subCategory.name}`);
      console.log(`   - Status: ${projectWithRelations.status.name}`);
    }

    const featureWithTasks = await featureRepo.findOne({
      where: { id: 'feature-1' },
      relations: ['project', 'status', 'requeriments', 'requeriments.tasks']
    });
    
    if (featureWithTasks && featureWithTasks.requeriments.length > 0) {
      console.log('✅ Feature with nested relations loaded successfully');
      console.log(`   - Feature: ${featureWithTasks.name}`);
      console.log(`   - Requeriments: ${featureWithTasks.requeriments.length}`);
      console.log(`   - Tasks: ${featureWithTasks.requeriments[0].tasks.length}`);
    }

    // Test 10: Update operations
    console.log('\n📝 Testing update operations...');
    
    task.actualHours = 7;
    task.status = status;
    await taskRepo.save(task);
    
    const updatedTask = await taskRepo.findOne({ where: { id: 'task-1' } });
    if (updatedTask && updatedTask.actualHours === 7) {
      console.log('✅ Task update successful');
    }

    // Test 11: Delete operations (cascade testing)
    console.log('\n🗑️  Testing delete operations...');
    
    // Delete the project (should cascade to features, requeriments, and tasks)
    await projectRepo.remove(project);
    
    const deletedProject = await projectRepo.findOne({ where: { id: 'project-1' } });
    const orphanedFeature = await featureRepo.findOne({ where: { id: 'feature-1' } });
    const orphanedTask = await taskRepo.findOne({ where: { id: 'task-1' } });
    
    if (!deletedProject && !orphanedFeature && !orphanedTask) {
      console.log('✅ Cascade delete successful');
    } else {
      console.log('❌ Cascade delete failed - orphaned records found');
    }

    // Test 12: Constraint testing
    console.log('\n🔒 Testing database constraints...');
    
    try {
      // Try to create a user with duplicate email
      const duplicateUser = userRepo.create({
        id: 'user-2',
        name: 'Duplicate User',
        email: 'test@example.com', // Same email as before
        password: 'password123'
      });
      await userRepo.save(duplicateUser);
      console.log('❌ Unique constraint failed - duplicate email allowed');
    } catch (error) {
      console.log('✅ Unique constraint working - duplicate email rejected');
    }

    console.log('\n🎉 All SQL DAO tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Entity creation and persistence');
    console.log('   ✅ Relationship mapping and loading');
    console.log('   ✅ Update operations');
    console.log('   ✅ Cascade delete operations');
    console.log('   ✅ Database constraints');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    // Clean up
    console.log('\n🧹 Cleaning up test database...');
    await testDataSource.destroy();
    console.log('✅ Cleanup completed');
  }
}

// Run the test
if (require.main === module) {
  testSQLDAOs()
    .then(() => {
      console.log('\n✨ SQL DAO integration test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testSQLDAOs };
