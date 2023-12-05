import React, { createContext, useContext, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import * as web3 from 'zksync-web3';

const MyContext = createContext();

export const useMyContext = () => {
  return useContext(MyContext);
};

export const MyProvider = ({ children }) => {
    const [authProvider, setAuthProvider] = useState(null);

    const initAuthProvider = async () => {
        const web3auth = new Web3Auth({
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
        await web3auth.initModal();

        const web3authProvider = await web3auth.connect();
        const tmpProvider = new web3.Web3Provider(web3authProvider);
        setAuthProvider(tmpProvider);
    };

    return (
        <MyContext.Provider value={{ authProvider, initAuthProvider }}>
        {children}
        </MyContext.Provider>
    );
};