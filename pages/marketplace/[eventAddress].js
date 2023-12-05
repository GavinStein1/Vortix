// pages/events/[eventAddress].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as web3 from 'zksync-web3';
import { Web3Auth } from '@web3auth/modal';

import Event from '@/ethereum/Event';
import Marketplace from '@/ethereum/Marketplace';
import { useMyContext } from '@/components/AuthProvider';

const EventPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [event, setEvent] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const { authProvider } = useMyContext();

  useEffect(() => {
    if (!authProvider) {
      router.push('/');
    }
    async function fetchEventData(eventAddress) {
        if (eventAddress) {
            // Connect to event contract
            var tmpEvent = new Event(eventAddress, authProvider);
            await tmpEvent.initialize();
            setEvent(tmpEvent);
            setLoading(false);
        }
    }

    async function fetchMarketplaceData(eventAddress) {
        if (eventAddress) {
            // Connect to marketplace contract
            var tmpMarketplace = new Marketplace(authProvider);
            setMarketplace(tmpMarketplace);

            // Get data from marketplace contract
            var response = await tmpMarketplace.getListingGroupSellers(eventAddress);
            var i = 0;
            var ids = [];
            var price = 0;
            var amount = 0;
            var tempTickets = [];
            var totalTix = 0;
            while (i < response.length) {
                ids = await tmpMarketplace.getListingIDs(eventAddress, response[i]);
                var j = 0;
                while (j < ids.length) {
                    price = await tmpMarketplace.getTicketPrice(eventAddress, response[i], ids[j]);
                    amount = await tmpMarketplace.getTicketAmounts(eventAddress, response[i], ids[j]);
                    tempTickets.push({
                        id: ids[j],
                        price: price,
                        amount: amount,
                        seller: response[i]
                    })
                    j += 1;
                }
                var tempTotal = await tmpMarketplace.getListingTotalAmount(eventAddress, response[i]);
                totalTix += tempTotal;
                i += 1; 
            }
            setTickets(tempTickets);
            setTicketsLoading(false);
            setTotalTickets(totalTix);
        }
    }

    if (router.query.eventAddress) {
        const { eventAddress } = router.query;
        try {
          fetchEventData(eventAddress);
          fetchMarketplaceData(eventAddress)
          authProvider.listAccounts().then(
            (value) => {
                setUserAddress(value[0]);
            }
          )            
        } catch (err) {
            console.log(err);
        }
    }
  }, [router.query]);

  const onClickBuyTickets = async (ticket) => {
    // get quantity to purchase
    const quantity = document.getElementById("quantity" + ticket.id).value;

    // Send transaction
    await marketplace.buyItem(event.address, ticket.id, ticket.seller, quantity);
  };

  const onClickCancelListing = async (ticket) => {
    // user must be ticket owner
    if (userAddress !== ticket.seller) {
        alert('Cannot cancel listings by other users');
        return;
    }
    
    // quantity to cancel
    const quantity = await event.balanceOf(ticket.seller, ticket.id);

    // call cancel function
    await marketplace.cancelListing(event.address, ticket.id, quantity);

    // refresh the page
    window.location.reload();
  };
  
  return (
    <div className="background">
      {loading ? (
        <p>Loading...</p>
      ) : ticketsLoading ? (
        <h1>Ticket hub: {event.name}</h1>
      ) : (
        <>
          {/* Display contract data */}
          <div className="contract-data">
            {/* Render the contract data here */}
            <h1>Ticket hub: {event.name}</h1>
            <h4>Tickets available: {totalTickets}</h4>
          </div>
          <div>
            {userAddress}
          </div>
          <div>
            <ul>
                {tickets.map((item, index) => (
                    <li key={index}>
                        <div>
                            <p>{item.id}, from {item.seller}</p>
                        </div>
                        <div>
                            <p>${item.price}</p>
                        </div>
                        <div>
                            <p>Available: {item.amount}</p>
                        </div>
                        <div>
                            <label htmlFor={"quantity" + item.id}>quantity: </label>
                            <input type="text" id={"quantity" + item.id} name={"quantity" + item.id}/>
                            <button className="button" onClick={async () => onClickBuyTickets(item)}>Purchase tickets</button>
                        </div>
                        <div>
                            {
                                item.seller === userAddress ? (
                                    <button className="button" onClick={async () => onClickCancelListing(item)}>Cancel listing</button>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
