// pages/events/[eventAddress].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as web3 from 'zksync-web3';

import { EVENT_ABI, MARKETPLACE_ABI, MARKETPLACE_CONTRACT_ADDRESS } from '@/ethereum/contracts';
import Event from '@/ethereum/Event';
import Marketplace from '@/ethereum/Marketplace';

const EventPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [provider, setProvider] = useState(null);
  const [event, setEvent] = useState(null);
  const [marketplace, setMarketplace] = useState(null);

  useEffect(() => {
    // Check if user has connected to app
    checkMetamaskConnection();

    async function fetchData(eventAddress) {
        if (eventAddress) {
            // Connect to metamask and create Event instance
            const metamaskProvider = new web3.Web3Provider(window.ethereum);
            var tmpEvent = new Event(eventAddress, metamaskProvider);
            await tmpEvent.initialize();
            var tmpMarketplace = new Marketplace(metamaskProvider);
            setProvider(metamaskProvider);
            setEvent(tmpEvent);
            setMarketplace(tmpMarketplace);

            const accountAddr = await metamaskProvider.listAccounts();
            if (tmpEvent.owner === accountAddr[0]) {
                setIsOwner(true);
            }     
            setLoading(false);
        }
    }

    if (router.query.eventAddress) {
        const { eventAddress } = router.query;
        try {
            // Get contract data
            fetchData(eventAddress);
        } catch (err) {
            console.log(err);
        }
    }
  }, [router.query]);

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
    }
  };

  // Function to navigate to the "Marketplace" page
  const navigateToMarketplace = () => {
    // You can pass data or state to the "Marketplace" page as needed
    router.push('/marketplace/' + event.address);
  };

  const onSubmitCreateTicketType = async (e) => {
    e.preventDefault();
    try {
        // Get input values
        const ticketName = document.getElementById("ticketNameInput").value;
        const ticketQuantity = parseInt(document.getElementById("numTicketsInput").value);
        if (isNaN(ticketQuantity)) {
            console.log('ticket quantity must be an integer number');
            return;
        }

        const ticketPrice = parseFloat(document.getElementById("ticketPriceInput").value);
        if (isNaN(ticketPrice)) {
            console.log('ticket price must be a decimal number');
            return;
        }

        // Call contract function: CreateTicketType(_name, _amount, _price)
        await event.createTicketType(ticketName, ticketQuantity, ticketPrice);        
        await event.refreshTickets();
    } catch (err) {
        console.log(err);
    }
  };

  const onClickListTicketType = async (id, price) => {    
    // get number of tickets
    var quantity = await event.balanceOf(event.owner, id);
    quantity = quantity.toNumber();

    // check/get approval
    var tx = await event.isApprovedForAll(event.owner, marketplace.address);
    if (!tx) {
        tx = await event.setApprovalForAll(marketplace.address, true);
        await tx.wait();
    }

    // send transaction
    marketplace.listTicket(event.address, id, price, quantity);
    alert('ticket/s listed');
  }

  const changeLoading = () => {
    setLoading(!loading);
  }

  return (
    <div className="background">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Display contract data */}
          <div className="contract-data">
            {/* Render the contract data here */}
            <h1>{event.name}</h1>
          </div>

          {/* Button to navigate to the "Marketplace" page */}
          <div className="get-tickets-container">
            <button className="button" onClick={navigateToMarketplace}>Get Tickets</button>
          </div>
          {isOwner ? (
            <div className="create-form">
                <form>
                    <h3>Create new ticket type</h3>
                    <label htmlFor="ticketNameInput">Ticket name:</label>
                    <input type="text" id="ticketNameInput" name="ticketNameInput" required />

                    <label htmlFor="numTicketsInput">Number of tickets:</label>
                    <input type="number" id="numTicketsInput" name="numTicketsInput" step="1" required />

                    <label htmlFor="ticketPriceInput">Set price of each ticket:</label>
                    <input type="number" id="ticketPriceInput" name="ticketPriceInput" step="0.01" required />

                    <button className="button" type="submit" onClick={onSubmitCreateTicketType}>Create</button>
                </form>
            </div>
            ) : 
            <></>
            }
          <div>
            <ul>
                {event.tickets ? event.tickets.map((item, index) => (
                    <li key={index}>
                        <div>
                            <p>{item.name}</p>
                            {isOwner ? (
                                <button className="button" onClick={async () => onClickListTicketType(item.id, item.price)}>List</button>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <p>{item.value}</p>
                        </div>
                    </li>
                )) : (
                    <></>
                )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
