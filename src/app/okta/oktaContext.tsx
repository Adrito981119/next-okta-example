'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthenticatorKey, CustomUserClaims, IdxStatus, Tokens, UserClaims } from '@okta/okta-auth-js';
import { oktaAuth } from './okta';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AuthContextProps } from './authContextProps';

const AuthContext = createContext<AuthContextProps>({
  authState: false,
  user: undefined,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
  checkAuthState: async () => {},
  unlockAccount: async () => {},
  forgotPassword: async () => {},
  sendMfaVerificationCode: async () => {},
  verifyCode: async () => {},
  validateToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const OktaValidateTokenEndpoint = `${process.env.NEXT_PUBLIC_OKTA_BASE_URL}/oauth2/${process.env.NEXT_PUBLIC_AUTHORIZATION_SERVER_ID}/v1/introspect?client_id=${process.env.NEXT_PUBLIC_OKTA_CLIENT_ID}`;
  const [authState, setAuthState] = useState(false);
  const [user, setUser] = useState<UserClaims<CustomUserClaims> | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, [oktaAuth.getAccessToken()]);

  const checkAuthState = async () => {
    const oktaCookie = document.cookie.split('; ').find((row) => row.startsWith('okta-token-storage='));
    const isValid = await validateToken(oktaAuth.getAccessToken() || oktaCookie?.split('=')[1] || '');
    if (oktaCookie && isValid) {
      const activeUser = await oktaAuth.token.getUserInfo();
      await authSuccessCallback(activeUser);
      return true;
    } else {
      authFailureCallback();
      return false;
    }
  };

  const validateToken = async (token: string | undefined) => {
    if (!token) {
      return false;
    }
    return await axios
      .post(OktaValidateTokenEndpoint, new URLSearchParams({ token }).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => {
        return res.data.active;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  const cleanOktaCache = () => {
    sessionStorage.removeItem('okta-transaction-storage');
    localStorage.removeItem('okta-shared-transaction-storage');
    localStorage.removeItem('okta-cache-storage');
    document.cookie = 'okta-token-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const login = async (email: string, password: string, isMFA?: boolean) => {
    cleanOktaCache();
    try {
      const transaction = await oktaAuth.idx.authenticate({ username: email, password: password });
      if (transaction.status === IdxStatus.SUCCESS) {
        if (transaction.tokens) {
          enableSession(transaction.tokens);
        } else {
          console.error('Tokens are undefined');
        }
      }
      if (transaction.status === IdxStatus.PENDING && isMFA) {
        router.push(`/verify?&email=${email}`);
      }
    } catch {}
  };

  const logout = async () => {
    await oktaAuth.signOut().then(() => {
      document.cookie = 'okta-token-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setAuthState(false);
      setUser(null);
    });
  };

  const sendMfaVerificationCode = async (factorType: string) => {
    switch (factorType) {
      case 'email':
        await oktaAuth.idx.proceed({ authenticator: AuthenticatorKey.OKTA_EMAIL, methodType: factorType });
        break;
      case 'sms':
        await oktaAuth.idx.proceed({ authenticator: AuthenticatorKey.PHONE_NUMBER, methodType: factorType });
        break;
      case 'voice':
        await oktaAuth.idx.proceed({ authenticator: AuthenticatorKey.PHONE_NUMBER, methodType: factorType });
        break;
    }
  };

  const verifyCode = async (verificationCode: string) => {
    await oktaAuth.idx.proceed({ credentials: { passcode: verificationCode } }).then(async (result) => {
      if (result.status === IdxStatus.SUCCESS) {
        if (result.tokens) {
          enableSession(result.tokens);
        } else {
          console.error('Tokens are undefined');
        }
      }
    });
  };

  const enableSession = async (tokens: Tokens) => {
    oktaAuth.tokenManager.setTokens(tokens);
    const activeUser = await oktaAuth.token.getUserInfo();
    await authSuccessCallback(activeUser ?? null);
    if (tokens.accessToken) {
    }
    router.push('/landing');
  };

  const authSuccessCallback = async (activeUser: UserClaims<CustomUserClaims>) => {
    setAuthState(true);
    setUser(activeUser);
  };

  const authFailureCallback = () => {
    document.cookie = 'okta-token-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setAuthState(false);
    setUser(null);
  };

  const unlockAccount = async (factor: string) => {
    await oktaAuth
      .unlockAccount({
        factorType: 'EMAIL',
        username: factor,
      })
      .then((res) => {
        if (res.status === 'RECOVERY_CHALLENGE') {
        }
      })
      .catch((error) => {
        if (error.errorCode === 'E0000095') {
        }
      });
  };

  const forgotPassword = async (factor: string) => {
    await oktaAuth
      .forgotPassword({
        factorType: 'EMAIL',
        username: factor,
      })
      .then((res) => {
        if (res.status === 'RECOVERY_CHALLENGE') {
        }
      })
      .catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        user,
        login,
        logout,
        setUser,
        checkAuthState,
        validateToken,
        forgotPassword,
        unlockAccount,
        sendMfaVerificationCode,
        verifyCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
