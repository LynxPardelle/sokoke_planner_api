export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      lastName: string;
      verified: boolean;
    };
    expiresIn: number;
  };
}

export interface TokenValidationResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    lastName: string;
    verified: boolean;
  };
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  resetTokenExpiration?: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    verified: boolean;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
