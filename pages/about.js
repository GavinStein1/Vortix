// pages/about.js
import React from 'react';
import { useRouter } from 'next/router';

const AboutPage = () => {
  const router = useRouter();

  return (
    <div className="background">
      <h1>About Vortix</h1>
      <p>Some information about the app.</p>
      <button onClick={() => router.push('/')}>Back to Landing</button>
    </div>
  );
};

export default AboutPage;