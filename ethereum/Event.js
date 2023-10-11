import * as web3 from 'zksync-web3';

import { EVENT_ABI } from './contracts';

class Event {

    constructor(contractAddress, provider) {
        this.contract = new web3.Contract(
            contractAddress, 
            EVENT_ABI,
            provider
        )
        this.address = contractAddress;
        this.provider = provider;
        this.name = '';
        this.tickets = [];
        this.owner = '';
    }

    async initialize() {
        // Get event name
        this.name = await this.getEventName();
        
        // Get tickets
        var tmpTickets = []
        var ids = await this.getTicketIDs();
        var i = 0;
        while (i < ids.length) {
            var ticketDetails = await this.getTicketDetails(ids[i]);
            // if ticketDetails.length !== 2 then handle error
            var ticket = {
                id: ids[i],
                name: ticketDetails[0],
                value: ticketDetails[1]
            }
            tmpTickets.push(ticket);
            i += 1;
        }
        this.tickets = tmpTickets;

        var ownerAddress = await this.contract.owner();
        this.owner = ownerAddress;
    }

    async refreshTickets() {
        var tmpTickets = []
        var ids = await this.getTicketIDs();
        var i = 0;
        while (i < ids.length) {
            var ticketDetails = await this.getTicketDetails(ids[i]);
            // if ticketDetails.length !== 2 then handle error
            var ticket = {
                id: ids[i],
                name: ticketDetails[0],
                value: ticketDetails[1]
            }
            tmpTickets.push(ticket);
            i += 1;
        }
        this.tickets = tmpTickets;
    }

    async getEventName() {
        var name = await this.contract.getEventName();
        return name;
    }

    async createTicketType(name, amount, value) {
        var addr = await this.provider.listAccounts();
        addr = addr[0];
        if (addr !== this.owner) {
            console.log('cannot call function if not event owner');
            return;
        }
        if (name.length === 0) {
            console.log('cannot have an empty name');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const tx = await connectedContract.createTicketType(name, amount, value);
        await tx.wait();

        // TODO: find a better way to get new ID. i.e. from the event that is emitted by the contract function.
        var id = await this.contract.getTicketIDs();
        id = id[id.length - 1];
        return id;
    }

    async getTicketIDs() {
        var idsBigNumber = await this.contract.getTicketIDs();
        var i = 0;
        var ids = []
        while (i < idsBigNumber.length) {
            ids.push(idsBigNumber[i].toNumber());
            i += 1;
        }

        return ids;
    }

    async getTicketDetails(id) {
        var details = await this.contract.getTicketDetails(id);
        // assert that details.length === 2
        return [details[0], details[1].toNumber()];
    }

    async mintMore(id, amount) {
        var addr = await this.provider.listAccounts();
        addr = addr[0];
        if (addr !== this.owner) {
            console.log('cannot call function if not event owner');
            return;
        }
        const details = await this.getTicketDetails(id);
        if (details[0].length === 0) {
            console.log('ticket id does not exist');
            return;
        }
        if (amount <= 0) {
            console.log('amount must be greater than 0');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const tx = await connectedContract.mintMore(id, amount);
        await tx.wait();
    }

    async assignValue(value, id) {
        var addr = await this.provider.listAccounts();
        addr = addr[0];
        if (addr !== this.owner) {
            console.log('cannot call function if not event owner');
            return;
        }
        const details = await this.getTicketDetails(id);
        if (details[0].length === 0) {
            console.log('ticket id does not exist');
            return;
        }
        if (value < 0) {
            console.log('value must not be less than 0');
            return;
        }

        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const tx = await connectedContract.assignValue(value, id);
        await tx.wait();
    }

    async balanceOf(address, tokenId) {
        const balance = await this.contract.balanceOf(address, tokenId);
        return balance.toNumber();
    }

    async isApprovedForAll(owner, operator) {
        const isApproved = await this.contract.isApprovedForAll(owner, operator);
        return isApproved;
    }

    async setApprovalForAll(operator, isApproved) {
        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        const tx = await connectedContract.setApprovalForAll(operator, isApproved);
        await tx.wait();
    }
}

export default Event;