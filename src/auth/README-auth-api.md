# Authentication API Documentation

This document describes how to use the authentication endpoints in the Sokoke Planner API.

## Base URL
All authentication endpoints are prefixed with `/auth`

## Endpoints

### 1. User Registration
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "MySecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "a1b2c3d4e5f6...",
    "user": {
      "id": "60d5ec49f6b2c8001f8b4567",
      "email": "john.doe@example.com",
      "name": "John",
      "lastName": "Doe",
      "verified": false
    },
    "expiresIn": 900
  }
}
```

### 2. User Login
**POST** `/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "MySecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "a1b2c3d4e5f6...",
    "user": {
      "id": "60d5ec49f6b2c8001f8b4567",
      "email": "john.doe@example.com",
      "name": "John",
      "lastName": "Doe",
      "verified": true
    },
    "expiresIn": 900
  }
}
```

### 3. Token Refresh
**POST** `/auth/refresh`

Refresh an expired access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "b2c3d4e5f6g7...",
  "expiresIn": 900
}
```

### 4. Token Validation
**POST** `/auth/validate`

Validate if a JWT token is still valid.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "60d5ec49f6b2c8001f8b4567",
    "email": "john.doe@example.com",
    "name": "John",
    "lastName": "Doe",
    "verified": true
  }
}
```

### 5. Forgot Password
**POST** `/auth/forgot-password`

Request a password reset link.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email.",
  "resetTokenExpiration": "2 hours"
}
```

### 6. Reset Password
**POST** `/auth/reset-password`

Reset password using a reset token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "MyNewSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully."
}
```

### 7. Email Verification
**POST** `/auth/verify-email`

Verify user's email address.

**Request Body:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

### 8. Change Password (Authenticated)
**POST** `/auth/change-password`

Change password for authenticated users.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "currentPassword": "MyCurrentPassword123!",
  "newPassword": "MyNewSecurePassword456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

### 9. Get Current User
**GET** `/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "60d5ec49f6b2c8001f8b4567",
    "email": "john.doe@example.com",
    "name": "John",
    "lastName": "Doe",
    "verified": true
  }
}
```

### 10. Logout
**POST** `/auth/logout`

Logout user and invalidate refresh token.

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 11. Health Check
**GET** `/auth/health`

Check authentication service health.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-06-17T10:30:00.000Z",
  "service": "Authentication Service"
}
```

### 12. Service Info
**GET** `/auth/info`

Get authentication service information.

**Response:**
```json
{
  "service": "Authentication Service",
  "version": "1.0.0",
  "endpoints": [
    "POST /auth/register",
    "POST /auth/login",
    "POST /auth/refresh",
    "..."
  ],
  "features": [
    "User Registration",
    "User Authentication",
    "JWT Token Management",
    "..."
  ]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

## Authentication Flow Examples

### Complete Registration Flow
```javascript
// 1. Register user
const registerResponse = await fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'MySecurePassword123!'
  })
});

// 2. Verify email (token sent via email)
const verifyResponse = await fetch('/auth/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'verification-token-from-email'
  })
});
```

### Login and API Usage Flow
```javascript
// 1. Login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john.doe@example.com',
    password: 'MySecurePassword123!'
  })
});

const { data } = await loginResponse.json();
const { accessToken, refreshToken } = data;

// 2. Use token for authenticated requests
const userResponse = await fetch('/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// 3. Refresh token when expired
const refreshResponse = await fetch('/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refreshToken: refreshToken
  })
});
```

### Password Reset Flow
```javascript
// 1. Request password reset
const forgotResponse = await fetch('/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john.doe@example.com'
  })
});

// 2. Reset password with token from email
const resetResponse = await fetch('/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'reset-token-from-email',
    newPassword: 'MyNewSecurePassword123!'
  })
});
```

## Security Features

- **JWT Tokens**: Secure token-based authentication
- **Password Strength Validation**: Strong password requirements enforced
- **Rate Limiting Ready**: Service includes utilities for implementing rate limiting
- **Suspicious Activity Detection**: Automatic detection of suspicious user agents
- **Token Expiration**: Configurable token expiration times
- **Refresh Token Rotation**: New refresh tokens generated on each refresh
- **Input Sanitization**: All inputs are validated and sanitized
- **Error Logging**: Comprehensive logging for security monitoring

## Configuration

The authentication service can be configured via environment variables:

```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Guards and Decorators

The auth module provides guards that can be used to protect routes:

```typescript
import { JwtAuthGuard, OptionalJwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';

// Require authentication
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute(@Request() req) {
  // req.user contains authenticated user info
  return { user: req.user };
}

// Optional authentication
@UseGuards(OptionalJwtAuthGuard)
@Get('optional-auth-route')
async optionalAuthRoute(@Request() req) {
  // req.user might be null if not authenticated
  return { user: req.user || null };
}
```
