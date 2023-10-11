// pages/browse.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const BrowsePage = () => {
  const router = useRouter();
  const [contractData, setContractData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has connected to app
    checkMetamaskConnection();
  }, []);

  const checkMetamaskConnection = async () => {
    try {
      // Check if Metamask is installed
      if (window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length === 0) {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
      router.push('/');
    }
  };

  return (
    <div className="background">
      <h1>Browse Page</h1>
      {loading ? <p>Loading...</p> : <p>Contract Data: {contractData}</p>}
    </div>
  );
};

export default BrowsePage;
