import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: any, args: ValidationArguments) {
    if (!password || typeof password !== 'string') {
      return false;
    }

    // Minimum 8 characters
    if (password.length < 8) {
      return false;
    }

    // Maximum 128 characters
    if (password.length > 128) {
      return false;
    }

    // Must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Must contain at least one number
    if (!/\d/.test(password)) {
      return false;
    }

    // Must contain at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }

    // Check for common passwords
    const commonPasswords = [
      'password', 'password123', '123456', '123456789', 'qwerty',
      'abc123', 'password1', 'admin', 'letmein', 'welcome'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character. Common passwords are not allowed.';
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
  validate(username: any, args: ValidationArguments) {
    if (!username || typeof username !== 'string') {
      return false;
    }

    // Length check
    if (username.length < 3 || username.length > 30) {
      return false;
    }    // Only alphanumeric characters, underscores, hyphens, ñ/Ñ, and accented characters
    if (!/^[a-zA-Z0-9_\-ñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜãõÃÕçÇ]+$/.test(username)) {
      return false;
    }

    // Cannot start or end with underscore or hyphen
    if (/^[_-]|[_-]$/.test(username)) {
      return false;
    }

    // Reserved usernames
    const reservedUsernames = [
      'admin', 'administrator', 'root', 'user', 'guest', 'api', 'www',
      'mail', 'email', 'test', 'demo', 'support', 'help', 'info',
      'contact', 'service', 'system', 'null', 'undefined'
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      return false;
    }

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Username must be 3-30 characters long, contain only letters (including ñ/Ñ and accented characters), numbers, underscores, and hyphens, and cannot be a reserved word.';
  }
}

export function IsValidUsername(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUsernameConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsValidNameConstraint implements ValidatorConstraintInterface {
  validate(name: any, args: ValidationArguments) {
    if (!name || typeof name !== 'string') {
      return false;
    }

    // Length check
    if (name.length < 2 || name.length > 50) {
      return false;
    }

    // Only letters (including ñ/Ñ and accented characters), spaces, apostrophes, and hyphens
    if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜãõÃÕçÇ\s'\-]+$/.test(name)) {
      return false;
    }

    // Cannot start or end with space, apostrophe, or hyphen
    if (/^[\s'\-]|[\s'\-]$/.test(name)) {
      return false;
    }

    // No consecutive spaces, apostrophes, or hyphens
    if (/[\s'\-]{2,}/.test(name)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Name must be 2-50 characters long, contain only letters (including ñ/Ñ and accented characters), spaces, apostrophes, and hyphens, and cannot start or end with special characters.';
  }
}

export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidNameConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsValidEmailWithInternationalCharsConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    if (!email || typeof email !== 'string') {
      return false;
    }

    // Basic email format validation with support for international characters
    // This regex supports international characters in the local part before @
    const emailRegex = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜãõÃÕçÇ._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional checks
    if (email.length > 254) {
      return false;
    }

    // Check local part length (before @)
    const localPart = email.split('@')[0];
    if (localPart.length > 64) {
      return false;
    }

    // Cannot start or end with dot, hyphen, or underscore
    if (/^[._-]|[._-]$/.test(localPart)) {
      return false;
    }

    // No consecutive dots
    if (/\.{2,}/.test(email)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Please provide a valid email address. International characters (ñ/Ñ and accented characters) are supported.';
  }
}

export function IsValidEmailWithInternationalChars(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidEmailWithInternationalCharsConstraint,
    });
  };
}
