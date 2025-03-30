import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';
export interface AuthContextProps {
  authState: boolean;
  user: UserClaims<CustomUserClaims> | undefined | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: UserClaims<CustomUserClaims> | null) => void;
  checkAuthState: () => void;
  unlockAccount: (factor: string) => Promise<void>;
  forgotPassword: (email: string) => void;
  sendMfaVerificationCode: (factorType: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  validateToken: (token: string | undefined) => void;
}
