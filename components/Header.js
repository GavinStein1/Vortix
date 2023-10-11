import Link from 'next/link';
import { useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import * as web3 from 'zksync-web3';

const Header = ({children}) => {
  const [provider, setProvider] = useState(null);

  const setupWeb3Auth = async () => {
    const auth = new Web3Auth({
      clientId: "BHDH7JXeM3R7DMkve07vqlMtmnyAR4gYbi_qsGZfT73J3nO0vhbJ_GMIvhP0NKCS4A_A_8msH-IPN67Pox9VNGM", // get it from Web3Auth Dashboard
      web3AuthNetwork: "sapphire_devnet",
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x118",
        rpcTarget: "https://testnet.era.zksync.dev",
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: "Zksync Era Testnet",
        blockExplorer: "https://goerli.explorer.zksync.io/",
        ticker: "ETH",
        tickerName: "Ethereum",
      },
    });
    await auth.initModal();

    const web3authProvider = await auth.connect();

    const tmpProvider = new web3.Web3Provider(web3authProvider); // web3auth.provider
    setProvider(tmpProvider);
  };

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
          <Link href="/contact">
            <button className="button">Contact Us</button>
          </Link>
          <button className="button" onClick={setupWeb3Auth}>Login</button>
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
