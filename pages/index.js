// pages/index.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Header from '@/components/Header';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="background">
      <Header>
        <h1>Vortix</h1>
        <div className="button-container">
            <Link href="/browse">
              <button className="button">Sign up</button>
            </Link>
          <button className="button" onClick={() => router.push('/about')}>Learn more</button>
        </div>
      </Header>
    </div>
  );
};

export default LandingPage;