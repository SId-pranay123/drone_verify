import { Sdk } from "@peaq-network/sdk";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { CONFIG } from '../config/config.js';

export class BlockchainService {
    constructor() {
        this.sdk = null;
    }

    async initialize() {
        await cryptoWaitReady();
        this.sdk = await Sdk.createInstance({
            baseUrl: CONFIG.PEAQ_NODE_URL,
            seed: process.env.OWNER_SEED
        });
        console.log("Blockchain service initialized");
    }

    async registerDrone(droneId, address, attributes) {
        const droneDID = `did:peaq:${droneId}`;
        await this.sdk.did.create({
            name: droneDID,
            address,
            attributes
        });
    }

    async storeVerificationResult(droneId, result) {
        await this.sdk.did.setAttribute(droneId, 'verification', result);
    }
}