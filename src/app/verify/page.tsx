'use client';
import { useState } from 'react';
import { useAuth } from '../okta/oktaContext';

export default function Verify() {
  const auth = useAuth();
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState('');
  const requestEmailCode = async () => {
    setCodeRequested(true);
    await auth.sendMfaVerificationCode('email').then(() => {
      alert('Code sent to email');
    });
  };

  const verify = async () => {
    await auth.verifyCode(code);
  };
  return (
    <>
      <div className='page-container'>
        <div className='login-card'>
          <div className='header-container'>
            <h1 className='header'>Verify your enrolled factors</h1>
          </div>
          <div className='fields-container'>
            {!codeRequested ? (
              <>
                <button className='form-button' onClick={requestEmailCode}>
                  Verify Email
                </button>
              </>
            ) : (
              <>
                <input
                  type='text'
                  placeholder='Enter the code'
                  className='form-field'
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className='form-button' onClick={verify}>
                  Verify
                </button>
              </>
            )}
          </div>
          <div className='form-controls'>
            <button className='form-button-aux'>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
