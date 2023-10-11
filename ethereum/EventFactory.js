import * as web3 from 'zksync-web3';

import { FACTORY_CONTRACT_ABI, FACTORY_CONTRACT_ADDRESS } from './contracts';

class EventFactory {

    constructor(provider) {
        this.contract = new web3.Contract(
            FACTORY_CONTRACT_ADDRESS,
            FACTORY_CONTRACT_ABI,
            provider
        )
        this.provider = provider;
        this.events = [];
        this.address = FACTORY_CONTRACT_ADDRESS;
    }

    async initialize() {
        await this.getEvents();
    }

    async getEvents() {
        const events = await this.contract.getEvents();
        var i = 0;
        while (i < events.length) {
            this.events.push(events[i]);
            i += 1;
        }
    }

    pushEvent(address) {
        this.events.push(address);
    };

    async getEventDetails(index) {
        const details = await this.contract.getEventDetails(index);
        return details;
    }

    async deployEvent(eventName) {
        if (eventName.length === 0) {
            console.log('Event name cannot be empty');
            return;
        }
        
        var addr = await this.provider.listAccounts();
        addr = addr[0];
        const signer = this.provider.getSigner();
        const connectedContract = this.contract.connect(signer);
        connectedContract.on('EventCreated', async (owner, address) => {
            if (owner === addr) {
                this.pushEvent(address);
            }
        });
        console.log(this.events[this.events.length - 1]);
        const tx = await connectedContract.deployEvent(eventName);
        await tx.wait();

        // TODO: Find a better way to get new event address from emitted event
        return this.events[this.events.length - 1];
    }
}

export default EventFactory;