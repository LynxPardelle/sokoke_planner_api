import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUtilsService {
  /**
   * Check if email domain is allowed
   * @param email - Email to check
   * @param allowedDomains - Array of allowed domains (optional)
   * @returns True if domain is allowed
   */
  isEmailDomainAllowed(email: string, allowedDomains?: string[]): boolean {
    if (!email || !email.includes('@')) {
      return false;
    }

    if (!allowedDomains || allowedDomains.length === 0) {
      return true; // Allow all domains if none specified
    }

    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.map(d => d.toLowerCase()).includes(domain);
  }

  /**
   * Check if username is available (basic format validation)
   * @param username - Username to validate
   * @returns Validation result
   */
  validateUsernameFormat(username: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!username) {
      errors.push('Username is required');
      return { isValid: false, errors };
    }

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (username.length > 30) {
      errors.push('Username must be less than 30 characters long');
    }

    // Only alphanumeric characters, underscores, and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    // Cannot start or end with underscore or hyphen
    if (/^[_-]|[_-]$/.test(username)) {
      errors.push('Username cannot start or end with underscore or hyphen');
    }

    // Reserved usernames
    const reservedUsernames = [
      'admin', 'administrator', 'root', 'user', 'guest', 'api', 'www',
      'mail', 'email', 'test', 'demo', 'support', 'help', 'info',
      'contact', 'service', 'system', 'null', 'undefined'
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      errors.push('This username is reserved and cannot be used');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate username suggestions based on email or name
   * @param email - User email
   * @param name - User name (optional)
   * @returns Array of username suggestions
   */
  generateUsernameSuggestions(email: string, name?: string): string[] {
    const suggestions: string[] = [];

    if (email && email.includes('@')) {
      const emailPrefix = email.split('@')[0];
      suggestions.push(emailPrefix);
      suggestions.push(`${emailPrefix}_user`);
      suggestions.push(`${emailPrefix}${new Date().getFullYear()}`);
    }

    if (name) {
      const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (cleanName.length >= 3) {
        suggestions.push(cleanName);
        suggestions.push(`${cleanName}_user`);
        suggestions.push(`${cleanName}${Math.floor(Math.random() * 1000)}`);
      }
    }

    // Generate random suggestions
    const randomSuffixes = ['user', 'dev', 'pro', 'star', 'cool'];
    for (let i = 0; i < 3; i++) {
      const randomNum = Math.floor(Math.random() * 10000);
      const randomSuffix = randomSuffixes[Math.floor(Math.random() * randomSuffixes.length)];
      suggestions.push(`${randomSuffix}${randomNum}`);
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Sanitize user input (remove potentially harmful characters)
   * @param input - Input string to sanitize
   * @returns Sanitized string
   */
  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>\"'&]/g, '') // Remove potentially harmful HTML/SQL characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .substring(0, 255); // Limit length
  }

  /**
   * Generate a secure session ID
   * @param length - Length of the session ID (default: 32)
   * @returns Secure session ID
   */
  generateSessionId(length: number = 32): string {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Check if user agent looks suspicious
   * @param userAgent - User agent string
   * @returns True if suspicious
   */
  isSuspiciousUserAgent(userAgent: string): boolean {
    if (!userAgent || typeof userAgent !== 'string') {
      return true;
    }

    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /go-http-client/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Rate limiting helper - check if action is allowed
   * @param key - Unique key for the action (e.g., IP + action)
   * @param maxAttempts - Maximum attempts allowed
   * @param windowMs - Time window in milliseconds
   * @param attempts - Current attempts map
   * @returns True if action is allowed
   */
  isActionAllowed(
    key: string, 
    maxAttempts: number, 
    windowMs: number, 
    attempts: Map<string, { count: number; resetTime: number }>
  ): boolean {
    const now = Date.now();
    const attempt = attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }
}
