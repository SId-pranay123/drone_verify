// import { Sdk } from "@peaq-network/sdk";
// import { cryptoWaitReady } from "@polkadot/util-crypto";
// import { CONFIG } from '../config/config.js';
// import dotenv from 'dotenv';
// dotenv.config();

// export class BlockchainService {
//     constructor() {
//         this.sdk = null;
//     }

//     async initialize() {
//         await cryptoWaitReady();
//         this.sdk = await Sdk.createInstance({
//             baseUrl: CONFIG.PEAQ_NODE_URL,
//             seed: process.env.OWNER_SEED
//         });
//         console.log("Blockchain service initialized");
//     }

//     async registerDrone(_droneId, address, _attributes) {
//         const droneDID = `did:peaq:${address}`;
//         console.log(`Registering drone: ${droneDID}`);
//         await this.sdk.did.create({
//             name: droneDID,
//             address,
//         }, (result) => {
//             console.log(`Registered drone: ${result}`);
//             // this.storeVerificationResult(droneDID, result);
//         });
//     }

//     async storeVerificationResult(droneId, result) {
//         await this.sdk.did.setAttribute(droneId, 'verification', result);
//     }
// }









import { Sdk } from '@peaq-network/sdk';
import Keyring from '@polkadot/keyring';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// A simple singleton or factory for the peaq SDK instance
let sdkInstance = null;
let keyring = null;

export const initPeaqSDK = async () => {
  if (sdkInstance) return { sdkInstance, keyring };

  try {
    const seedsPath = path.join(process.cwd(), 'src', 'utils', 'seeds.json');
    const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));

    const ownerSeed = seeds.owner;
    keyring = new Keyring({ type: 'sr25519' });

    console.log("seed : ", ownerSeed, "BAse url : ", process.env.PEAQ_WSS_URL);

    sdkInstance = await Sdk.createInstance({
      baseUrl: "wss://wss-async.agung.peaq.network",
      seed: "wide east oyster slim planet victory enter alcohol tide earth bid genuine",
    });

    // console.log('peaq SDK initialized', sdkInstance);
    // console.log("==============================")

    return { sdkInstance, keyring };
  } catch (error) {
    console.error('Error initializing peaq SDK:', error);
    throw error;
  }
};
