import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import { useMyContext } from '@/components/AuthProvider';
import Marketplace from '@/ethereum/Marketplace';

const Account = () => {
    const router = useRouter();
    const { authProvider } = useMyContext();
    const [loading, setLoading] = useState(true);
    const [userAddress, setUserAddress] = useState('');
    const [marketplace, setMarketplace] = useState(null);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if(!authProvider) {
            router.push('/');
        }

        async function getData() {
            const addr = await authProvider.listAccounts();
            setUserAddress(addr[0]);
            var tmpMarketplace = new Marketplace(authProvider);
            setMarketplace(tmpMarketplace);

            var bal = tmpMarketplace.getProceeds();
            setBalance(bal);
            setLoading(false);
        }

        getData();

    }, []);

    const withdrawFunds = async () => {
        const accounts = await authProvider.listAccounts();
        console.log("account: ", accounts[0]);
        console.log((await marketplace.getProceeds()));
        // await marketplace.withdrawProceeds();
    };

    return (
        <div className="background">
            {loading ? (
                <p>loading...</p>
            ) : (
                <Header authProvider={authProvider}>
                    <div className="button-container">
                        <h1>{userAddress}</h1>
                        <button className="button" onClick={withdrawFunds}>Withdraw balance</button>
                    </div>
                </Header>
            )}
        </div>
    )

}

export default Account;