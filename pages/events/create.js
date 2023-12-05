// pages/events/create.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as web3 from 'zksync-web3';

import EventFactory from '@/ethereum/EventFactory';
import { useMyContext } from '@/components/AuthProvider';
import Header from '@/components/Header';

const CreateEventPage = () => {
  const router = useRouter();
  const [isloading, setIsLoading] = useState(true);
  const [factory, setFactory] = useState(null);
  const { authProvider } = useMyContext();

  useEffect(() => {
    if (!authProvider) {
      router.push('/');
    }
    
    const initializeFactory = async (pvdr) => {
      const tmpFactory = new EventFactory(pvdr);
      await tmpFactory.initialize();
      setFactory(tmpFactory);
      setIsLoading(false);
    };

    // Connect to factory contract
    initializeFactory(authProvider);
  }, [authProvider]);

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

  return (
    <>
      { isloading ? (
        <p>loading...</p>
      ) : (
        <div className="background">
          <Header authProvider={authProvider}>
            <h1>Create your own event</h1>
            {/* Your content for the create event page */}
            <div className="centered-div">
              <form id="myForm" onSubmit={onSubmitCreateEvent}>
                <label className="label-std" htmlFor="textInput">Name your event:</label>
                <input type="text" id="textInput" name="textInput" required />
                <button className="button" type="submit">Create</button>
              </form>
            </div>
            </Header>
        </div>
      )}
    </>
  );
};

export default CreateEventPage;
