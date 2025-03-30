import { oktaConfig } from './config';
import { OktaAuth } from '@okta/okta-auth-js';
export const oktaAuth = new OktaAuth(oktaConfig);
