// src/services/blockchainService.js
import { Sdk } from "@peaq-network/sdk";
import { generateKeyPair, makeExtrinsicCall, getStorage, verifySignature } from "../utils/utils.js";
import fs from "fs/promises";
import { hexToU8a, u8aToHex } from "@polkadot/util";

/**
 * Initializes the SDK instance with the owner's seed.
 */
const initializeSdk = async () => {
  const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
  const ownerSeed = seeds.owner;

  const sdkInstance = await Sdk.createInstance({
    baseUrl: "wss://wsspc1-qa.agung.peaq.network",
    seed: ownerSeed,
  });

  return sdkInstance;
};

/**
 * Registers a drone on the blockchain.
 * @param {string} droneId - The identifier for the drone (e.g., 'drone1').
 */
export const registerDroneOnBlockchain = async (droneId) => {
  try {
    const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
    const ownerSeed = seeds.owner;
    const droneSeed = seeds[droneId];

    if (!droneSeed) {
      throw new Error(`Seed for ${droneId} not found.`);
    }

    const sdkInstance = await initializeSdk();
    const keyring = new Sdk.Keyring({ type: "sr25519" });
    const dronePair = keyring.addFromUri(droneSeed);

    // Register the drone's DID
    const result = await sdkInstance.did.create(
      { name: `did:peaq:${dronePair.address}`, address: dronePair.address },
      (result) => {
        console.log(`Registration Result for ${droneId}:`, result);
      }
    );

    console.log(`Drone ${droneId} registered with DID: did:peaq:${dronePair.address}`);
    return dronePair.address;
  } catch (error) {
    console.error(`Error registering drone ${droneId}:`, error);
    throw error;
  }
};

/**
 * Stores signed drone data on the blockchain.
 * @param {object} dataPayload - The data to store, including dataHex and signatureHex.
 * @param {string} droneAddress - The blockchain address of the drone.
 * @param {object} droneKeypair - The key pair of the drone for signing the transaction.
 * @returns {string} - The transaction hash.
 */
export const storeDataOnBlockchain = async (dataPayload, droneAddress, droneKeypair) => {
  try {
    const payloadHex = u8aToHex(Buffer.from(JSON.stringify(dataPayload)));

    const txHash = await makeExtrinsicCall(
      "peaqStorage",
      "addItem",
      [droneAddress, payloadHex],
      true,
      droneKeypair
    );

    console.log(`Data stored on blockchain with transaction hash: ${txHash}`);
    return txHash;
  } catch (error) {
    console.error("Error storing data on blockchain:", error);
    throw error;
  }
};

/**
 * Retrieves data from the blockchain.
 * @param {string} itemType - The identifier for the stored item.
 * @returns {object} - The retrieved data payload.
 */
export const retrieveDataFromBlockchain = async (itemType) => {
  try {
    const storedDataHex = await getStorage(itemType);

    if (!storedDataHex) {
      throw new Error('Data not found on blockchain.');
    }

    const payload = JSON.parse(Buffer.from(hexToU8a(storedDataHex)).toString());
    return payload;
  } catch (error) {
    console.error("Error retrieving data from blockchain:", error);
    throw error;
  }
};

/**
 * Verifies the integrity and authenticity of the data retrieved from the blockchain.
 * @param {object} payload - The data payload containing dataHex and signatureHex.
 * @param {string} droneId - The identifier of the drone.
 * @returns {boolean} - True if verification is successful, false otherwise.
 */
export const verifyDataIntegrity = async (payload, droneId) => {
  try {
    const { data: dataHex, signature: signatureHex } = payload;

    // Load seeds
    const seeds = JSON.parse(await fs.readFile('seeds.json', 'utf8'));
    const droneSeed = seeds[droneId];

    if (!droneSeed) {
      throw new Error('Invalid Drone ID for verification.');
    }

    const droneKeypair = generateKeyPair(droneSeed);

    const isValid = verifySignature(dataHex, signatureHex, droneKeypair.publicKey);

    return isValid;
  } catch (error) {
    console.error("Error verifying data integrity:", error);
    throw error;
  }
};
