// pages/index.js
import Link from 'next/link';
import { useRouter } from 'next/router';

import Header from '@/components/Header';
import { useMyContext } from '@/components/AuthProvider';

const LandingPage = () => {
  const router = useRouter();
  const { authProvider, initAuthProvider } = useMyContext();

  return (
    <div className="background">
      <Header authProvider={authProvider} initAuthProvider={initAuthProvider}>
        <h1>Vortix</h1>
        <div className="button-container">
            <Link href="/browse">
              <button className="button">Sign up</button>
            </Link>
          <button className="button" onClick={() => router.push('/events/0x693D502eB86A21a2C7E36897193b4199C39B06a1')}>Learn more</button>
        </div>
      </Header>
    </div>
  );
};

export default LandingPage;