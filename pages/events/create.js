// pages/events/create.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as web3 from 'zksync-web3';

import EventFactory from '@/ethereum/EventFactory';

const CreateEventPage = () => {
  const router = useRouter();
  const [isloading, setIsLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [factory, setFactory] = useState(null);

  useEffect(() => {
    // Check if user has connected to app
    checkMetamaskConnection();

    const initializeFactory = async (pvdr) => {
      const tmpFactory = new EventFactory(pvdr);
      await tmpFactory.initialize();
      setFactory(tmpFactory);
      setIsLoading(false);
    };

    // Connect to factory contract
    const tmpProvider = new web3.Web3Provider(window.ethereum);
    initializeFactory(tmpProvider);
    setProvider(tmpProvider);
  }, []);

  const checkMetamaskConnection = async () => {
    try {
      // Check if Metamask is installed
      if (window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length === 0) {
          router.push('/');
        } else {
            setConnected(true);
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
    }
  };

  const onSubmitCreateEvent = async (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById("textInput").value;

        const tx = await factory.deployEvent(name);
        await tx.wait();
        
        const events = await factoryContract.getEvents();
        const newEventAddress = events[events.length - 1];
        
        router.push('/events/' + newEventAddress);
    } catch (err) {
        console.log(err);
    }

  };

  if (!connected) {
    return (
      <div>
        <p>You need to connect to MetaMask and grant permission to create an event.</p>
        {/* <button onClick={requestPermission}>Connect to MetaMask</button> */}
      </div>
    );
  }

  return (
    <>
      { isloading ? (
        <p>loading...</p>
      ) : (
        <div className="background">
          <h1>Create your own event</h1>
          {/* Your content for the create event page */}
          <div className="centered-div">
          <form id="myForm" onSubmit={onSubmitCreateEvent}>
            <label className="label-std" htmlFor="textInput">Name your event:</label>
            <input type="text" id="textInput" name="textInput" required />
            <button className="button" type="submit">Create</button>
        </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEventPage;
