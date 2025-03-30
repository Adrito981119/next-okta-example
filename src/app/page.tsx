'use client';
import { useState } from 'react';

export default function Home() {
  const [MFA, setMFA] = useState(false);
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
              <input id='username' name='username' type='text' className='form-field' />
            </div>
            <div className='field'>
              <label htmlFor='password' className='form-label'>
                Password
              </label>
              <input id='password' name='password' type='password' className='form-field' />
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
            <button className='form-button'>Sign in</button>
            <div className='aux-controls'>
              <button className='form-button-aux'>Forgot Password</button>
              <button className='form-button-aux'>Unlock Account</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
