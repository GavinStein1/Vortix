// pages/about.js
import React from 'react';
import { useRouter } from 'next/router';

import { useMyContext } from '@/components/AuthProvider';
import Header from '@/components/Header';

const AboutPage = () => {
  const router = useRouter();
  const { authProvider, initAuthProvider } = useMyContext();
  
  return (
    <div className="background">
      <Header authProvider={authProvider} initAuthProvider={initAuthProvider}>
        <div className="button-container">
          <h1>About</h1>
          <p>Some information about the app.</p>
          <button onClick={() => {router.push('/')}}>Back to Landing</button>
        </div>
      </Header>
    </div>
  );
};

export default AboutPage;