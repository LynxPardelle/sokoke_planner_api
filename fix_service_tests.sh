#!/bin/bash

# Script to fix all planner service tests

services=(
  "projectSubCategory"
  "feature"  
  "requeriment"
  "status"
  "task"
)

for service in "${services[@]}"; do
  echo "Fixing ${service}.service.spec.ts"
  
  cat > "src/planner/services/${service}.service.spec.ts" << EOF
import { Test, TestingModule } from '@nestjs/testing';
import { ${service^}Service } from './${service}.service';
import ${service^}Repository from '../repositories/${service}.repository';
import { LoggerService } from '@src/shared/services/logger.service';

describe('${service^}Service', () => {
  let service: ${service^}Service;

  const mock${service^}Repository = {
    create: jest.fn(),
    readAll: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLoggerService = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    http: jest.fn(),
    fatal: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${service^}Service,
        {
          provide: ${service^}Repository,
          useValue: mock${service^}Repository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<${service^}Service>(${service^}Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('author', () => {
    it('should return author information', () => {
      const result = service.author();
      expect(result).toEqual({
        author: 'Lynx Pardelle',
        site: 'https://lynxpardelle.com',
        github: 'https://github.com/LynxPardelle',
      });
    });
  });
});
EOF

done

echo "All service tests fixed!"
