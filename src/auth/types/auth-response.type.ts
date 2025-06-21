export type TAuthResponse = {
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
};

export type TTokenValidationResponse = {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    lastName: string;
    verified: boolean;
  };
  error?: string;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
};

export type TPasswordResetResponse = {
  success: boolean;
  message: string;
  resetTokenExpiration?: string;
};

export type TEmailVerificationResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    verified: boolean;
  };
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};
