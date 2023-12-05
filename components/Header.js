import Link from 'next/link';
import { useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import * as web3 from 'zksync-web3';

const Header = ({ children, authProvider, initAuthProvider }) => {

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Link href="/">
            <>
              <img src="/logo.png" alt="Logo" />
            </>
          </Link>
        </div>
        <nav className="header-nav">
          <Link href="/about">
            <button className="button">About</button>
          </Link>
          <Link href="/events/0x693D502eB86A21a2C7E36897193b4199C39B06a1">
            <button className="button">Contact Us</button>
          </Link>
          {!authProvider ? (
            <button className="button" onClick={initAuthProvider}>Login</button>
          ) : (
            <Link href="/account">
              <button className="button">Account</button>
            </Link>
          )}
          
        </nav>
        <style jsx>{`
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            color: #fff;
          }
          .header-logo img {
            max-width: 100px;
          }
          .header-nav {
            display: flex;
          }
          .header-nav a {
            margin-right: 20px;
            color: #fff;
            text-decoration: none;
          }
        `}</style>
      </header>
      {children}
    </>
  );
};

export default Header;
