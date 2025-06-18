# 📋 Sokoke Planner API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  A comprehensive project planning and task management API built with NestJS, TypeScript, and MongoDB.
</p>

<p align="center">
  <a href="https://github.com/LynxPardelle/sokoke_planner_api/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  </a>
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node.js Version" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/typescript-%5E5.8.3-blue.svg" alt="TypeScript Version" />
  </a>
  <a href="https://nestjs.com">
    <img src="https://img.shields.io/badge/nestjs-%5E11.1.3-red.svg" alt="NestJS Version" />
  </a>
</p>

## 📖 Description

Sokoke Planner API is a robust, scalable REST API designed for project planning and task management. Built with modern technologies and best practices, it provides comprehensive features for managing projects, tasks, categories, requirements, and user authentication.

### 🎯 Key Features

- **Project Management**: Complete CRUD operations for projects with categories and subcategories
- **Task Management**: Detailed task tracking with status, requirements, and features
- **User Authentication**: JWT-based authentication with refresh tokens and email verification
- **Role-based Authorization**: Secure access control with API key and JWT strategies
- **Data Validation**: Comprehensive input validation using class-validator and DTOs
- **Error Handling**: Centralized error handling with detailed logging
- **API Documentation**: Well-documented endpoints with examples
- **Docker Support**: Containerized deployment for development and production
- **Testing**: Unit and integration tests with Jest

### 🏗️ Architecture

The API follows Domain-Driven Design (DDD) principles with a modular architecture:

```
├── auth/           # Authentication & authorization
├── user/           # User management
├── planner/        # Core planning functionality
├── shared/         # Shared utilities and services
├── config/         # Configuration management
└── core/           # Core application services
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (>= 18.0.0)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Docker** (optional, recommended)

### Environment Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/LynxPardelle/sokoke_planner_api.git
   cd sokoke_planner_api
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required Environment Variables:**

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/sokoke_planner
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # API Configuration
   API_KEY=your-api-key
   PORT=3000
   
   # Email (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### With Docker Compose (Recommended)

The easiest way to run the application is using Docker Compose:

- **For development:**

  ```bash
  docker-compose up sokoke_planner_api-dev --watch
  ```

- **For production:**

  ```bash
  docker-compose up sokoke_planner_api-production
  ```

### With Makefile

Convenient commands for development:

- **For development:**

  ```bash
  make dev
  ```

- **For production:**

  ```bash
  make prod
  ```

### Without Docker (Manual Installation)

If you prefer not to use Docker:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the application:**

   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   
   # Watch mode
   npm run start --watch
   ```

## 📚 API Documentation

### Base URL

```text
http://localhost:3000
```

### Authentication

The API uses JWT-based authentication with two strategies:

- **API Key**: For external integrations
- **JWT Bearer Token**: For user sessions

#### Headers

```http
# API Key Authentication
X-API-KEY: your-api-key

# JWT Authentication
Authorization: Bearer <jwt-token>
```

### Core Modules

| Module | Endpoint | Description |
|--------|----------|-------------|
| **Auth** | `/auth/*` | User authentication and authorization |
| **User** | `/user/*` | User management and profiles |
| **Projects** | `/project/*` | Project management |
| **Tasks** | `/task/*` | Task management |
| **Categories** | `/project-category/*` | Project categorization |
| **Status** | `/status/*` | Status management |
| **Features** | `/feature/*` | Feature management |
| **Requirements** | `/requirement/*` | Requirement management |

For detailed API documentation, see:

- [Authentication API](src/auth/README-auth-api.md)
- [Authentication Summary](src/auth/AUTHENTICATION-SUMMARY.md)

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch

# Debug mode
npm run test:debug
```

### Test Structure

```text
test/
├── unit/           # Unit tests for individual components
├── integration/    # Integration tests for modules
└── e2e/           # End-to-end API tests
```

## 🏗️ Project Structure

```text
src/
├── auth/                    # Authentication module
│   ├── controllers/         # Auth controllers
│   ├── DTOs/               # Data transfer objects
│   ├── guards/             # Authentication guards
│   ├── middlewares/        # Auth middleware
│   ├── services/           # Auth services
│   ├── strategies/         # Passport strategies
│   └── types/              # Type definitions
├── config/                 # Configuration management
│   ├── config.loader.ts    # Environment config loader
│   ├── config.schema.ts    # Validation schema
│   └── winston.config.ts   # Logging configuration
├── core/                   # Core application services
│   ├── controllers/        # App controllers
│   └── services/           # App services
├── planner/                # Core planning functionality
│   ├── controllers/        # Planner controllers
│   ├── DAOs/              # Data access objects
│   ├── DTOs/              # Data transfer objects
│   ├── repositories/       # Data repositories
│   ├── schemas/           # Database schemas
│   ├── services/          # Business logic
│   └── types/             # Type definitions
├── shared/                 # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── DTOs/              # Shared DTOs
│   ├── services/          # Shared services
│   └── types/             # Shared types
└── user/                  # User management
    ├── controllers/       # User controllers
    ├── DTOs/              # User DTOs
    ├── services/          # User services
    └── types/             # User types
```

## 🔧 Development

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Git Hooks

Pre-commit hooks ensure code quality:

- ESLint validation
- Prettier formatting
- Unit test execution

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sokoke_planner

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
API_KEY=your-api-key

# Server
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=debug
```

## 🚀 Deployment

### Docker Deployment

1. **Build the image:**

   ```bash
   docker build -t sokoke-planner-api .
   ```

2. **Run with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

### Production Considerations

- Use environment-specific configuration files
- Enable HTTPS/TLS encryption
- Implement rate limiting
- Set up monitoring and logging
- Configure backup strategies for MongoDB
- Use a reverse proxy (nginx, Apache)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

### Lynx Pardelle

- Website: [https://lynxpardelle.com/](https://lynxpardelle.com/)
- GitHub: [@LynxPardelle](https://github.com/LynxPardelle)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [MongoDB](https://www.mongodb.com/) - Document database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Passport](http://www.passportjs.org/) - Authentication middleware

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## 🛠️ Useful Commands

| Command           | Description                                 |
|-------------------|---------------------------------------------|
| `make stop`       | Stop all running containers                 |
| `make clean`      | Stop, remove volumes, and clean node_modules |
| `make logs`       | Follow logs from the current container      |
| `make rebuild`    | Rebuild everything from scratch             |
| `make install pkg=axios` | Install a package inside the dev container |
| `make install-dev pkg=vitest` | Install a dev dependency inside the container |

---

Happy coding! 🧑‍💻