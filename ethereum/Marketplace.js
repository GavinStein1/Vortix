import * as web3 from 'zksync-web3';

import { MARKETPLACE_ABI, MARKETPLACE_CONTRACT_ADDRESS } from './contracts';
import Event from './Event';

class Marketplace {

    constructor(provider) {
        this.contract = new web3.Contract(
            MARKETPLACE_CONTRACT_ADDRESS,
            MARKETPLACE_ABI,
            provider
        );
        this.provider = provider;
        this.address = MARKETPLACE_CONTRACT_ADDRESS;
    }

    async isListed(eventAddress, ticketId, seller) {
        var addr = '';
        if (seller) {
            addr = seller;
        } else {
            addr = await this.provider.listAccounts();
            addr = addr[0];
        }
        const price = await this.getTicketPrice(eventAddress, addr, ticketId);
        listingIDs = await this.getListingIDs(eventAddress, addr);

        if (listingIDs.length === 0 || price === 0) {
            console.log('No listing exists to cancel');
            return false;
        } else {
            return true;
        }
    }

    async getTicketPrice(eventAddress, seller, ticketId) {
        const ticketPrice = await this.contract.getTicketPrice(eventAddress, seller, ticketId);
        return ticketPrice.toNumber();
    }

    async getListingIDs(eventAddress, seller) {
        const idsBigNumber = await this.contract.getListingIDs(eventAddress, seller);
        var ids = [];
        var i = 0;
        while (i < idsBigNumber.length) {
            ids.push(idsBigNumber[i].toNumber());
            i += 1;
        }
        return ids;
    }

    async getProceeds() {
        const proceeds = await this.contract.getProceeds();
        return proceeds.toNumber();
    }

    async getListingGroupSellers(eventAddress) {
        const response = await this.contract.getListingGroupSellers(eventAddress);
        return response;
    }

    async getTicketAmounts(eventAddress, seller, ticketId) {
        const response = await this.contract.getTicketAmounts(eventAddress, seller, ticketId);
        return response.toNumber();
    }

    async getListingTotalAmount(eventAddress, seller) {
        const response = await this.contract.getListingTotalAmount(eventAddress, seller);
        return response.toNumber();
    }

    async listTicket(eventAddress, ticketId, price, amount) {
        var addr = await this.provider.listAccounts();
        addr = addr[0];
        const priceCheck = await this.getTicketPrice(eventAddress, addr, ticketId);
        if (priceCheck != 0) {
            console.log('Ticket listing exists already');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const overrides = {
            gasLimit: 8000000
        }
        const tx = await connectedContract.listTicket(eventAddress, ticketId, price, amount, overrides);
        await tx.wait();
    }

    async cancetlListing(eventAddress, ticketId, amount) {
        const check = await this.isListed(eventAddress, ticketId);

        if (!check) {
            console.log('No listing exists to cancel');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const tx = await connectedContract.cancelListing(eventAddress, ticketId, amount);
        await tx.wait();
    }

    async buyItem(eventAddress, ticketId, seller, amount) {
        const check = await this.isListed(eventAddress, ticketId, seller);

        if (!check) {
            console.log('No listing exists to buy');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);

        const price = await this.getTicketPrice(eventAddress, seller, ticketId);
        const value = price * amount;
        const overrides = {
            value: value,
            gasLimit: 8000000
        }
        const tx = await connectedContract.buyItem(eventAddress, ticketId, seller, amount, overrides);
        await tx.wait();
        alert("ticket bought!");
    }

    async updateListing(eventAddress, ticketId, newPrice) {
        const check = await this.isListed(eventAddress, ticketId);
        if (!check) {
            console.log('No listing exists to update');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const tx = await connectedContract.updateListing(eventAddress, ticketId, newPrice);
        await tx.wait();
    }

    async withdrawProceeds() {
        var addr = await this.provider.listAccounts();
        addr = addr[0];
        const proceeds = this.getProceeds();
        if (proceeds === 0) {
            console.log('no proceeds to withdraw');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const tx = await connectedContract.withdrawProceeds();
        await tx.wait();
        alert(proceeds + ' withdrawn');
    }

}

export default Marketplace;