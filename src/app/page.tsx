'use client';
import { useState } from 'react';
import { useAuth } from './okta/oktaContext';

export default function Home() {
  const [MFA, setMFA] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const login = async () => {
    await auth.login(username, password, MFA);
  };

  const forgotPassword = async () => {
    auth.forgotPassword(username);
  };

  const unlockAccount = async () => {
    await auth.unlockAccount(username);
  };
  return (
    <>
      <div className='page-container'>
        <div className='login-card'>
          <div className='header-container'>
            <h1 className='header'>Login</h1>
          </div>
          <div className='fields-container'>
            <div className='field'>
              <label htmlFor='username' className='form-label'>
                Username
              </label>
              <input
                id='username'
                name='username'
                type='text'
                className='form-field'
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='field'>
              <label htmlFor='password' className='form-label'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                className='form-field'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className='checkbox-container'>
            <input
              type='checkbox'
              id='login-checkbox'
              className='login-checkbox'
              checked={!MFA}
              onChange={() => setMFA(!MFA)}
            />
            <label htmlFor='remember-me'>Without MFA</label>

            <input
              type='checkbox'
              id='login-checkbox'
              className='login-checkbox'
              checked={MFA}
              onChange={() => setMFA(!MFA)}
            />
            <label htmlFor='remember-me'>With MFA</label>
          </div>
          <div className='form-controls'>
            <button className='form-button' onClick={login}>
              Sign in
            </button>
            <div className='aux-controls'>
              <button className='form-button-aux' onClick={forgotPassword}>
                Forgot Password
              </button>
              <button className='form-button-aux' onClick={unlockAccount}>
                Unlock Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
