import { OktaAuthOptions } from '@okta/okta-auth-js';

export const oktaConfig: OktaAuthOptions = {
  issuer: process.env.OKTA_ISSUER || '',
  clientId: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID,
  redirectUri: process.env.OKTA_REDIRECT_URI, //necessary for the login to work but we are not going to use it
  postLogoutRedirectUri: process.env.OKTA_POST_LOGOUT_REDIRECT_URI,
  scopes: ['openid', 'profile', 'email'],
  pkce: true, //for SPA type apps it must be true
};
