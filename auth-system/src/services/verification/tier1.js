// // import Keyring from "@polkadot/keyring";
// // import { hexToU8a, u8aToHex } from "@polkadot/util";
// // import { DroneData } from '../../models/DroneData.js';
// // import dotenv from 'dotenv';
// // dotenv.config();


// // export class Tier1Verification {
// //     constructor(blockchainService) {
// //         this.blockchainService = blockchainService;
// //     }

// //     async verify(droneData) {
// //         try {
// //             const keyring = new Keyring({ type: "sr25519" });
// //             const dronePair = keyring.addFromUri(process.env.DRONE_SEED);

// //             // Register if not already registered
// //             const existingDrone = await DroneData.findOne({ droneId: droneData.id });
// //             if (!existingDrone) {
// //                 await this.blockchainService.registerDrone(
// //                     droneData.id,
// //                     dronePair.address,
// //                     {
// //                         serialNumber: droneData.remoteData.basicIDs[0].serialNumber,
// //                         registrationTime: Date.now()
// //                     }
// //                 );
// //             }

// //             const signedData = await this.signDroneData(droneData, dronePair);
// //             console.log('Tier 1 verification successful');
// //             return { verified: true, signature: signedData };
// //         } catch (error) {
// //             console.error('Tier 1 verification failed:', error);
// //             return { verified: false, error: error.message };
// //         }
// //     }

// //     async signDroneData(droneData, dronePair) {
// //         const dataHash = this.createDataHash(droneData);
// //         const signature = dronePair.sign(hexToU8a(dataHash));
// //         return {
// //             dataHash,
// //             signature: u8aToHex(signature)
// //         };
// //     }

// //     createDataHash(droneData) {
// //         return u8aToHex(
// //             JSON.stringify({
// //                 id: droneData.id,
// //                 location: [droneData.deviceLocationLat, droneData.deviceLocationLng],
// //                 timestamp: new Date()
// //             })
// //         );
// //     }
// // }




// import fs from 'fs/promises';
// import path from 'path';
// import { initPeaqsdkInstance } from '../../utils/blockchain.js';
// import { hexToU8a, u8aToHex } from '@polkadot/util';
// import { cryptoWaitReady } from '@polkadot/util-crypto';
// import Keyring from '@polkadot/keyring';
// import { generateAndSignData, generateKeyPair } from '../../utils/utils.js';



// /**
//  * Generates a key pair from a seed.
//  * @param {String} seed - The seed phrase.
//  * @returns {KeyringPair} - The key pair.
//  */
// export const generateKeyPair = (seed) => {
//   const keyring = new Keyring({ type: 'sr25519' });
//   return keyring.addFromUri(seed);
// };

// /**
//  * Generates and signs data.
//  * @param {String} machineSeed - The machine's seed phrase.
//  * @param {Object} data - The data to sign.
//  * @returns {Object} - Contains dataHex and signatureHex.
//  */
// export const generateAndSignData = async (machineSeed, data) => {
// //   await cryptoWaitReady();
//   const machineKeypair = generateKeyPair(machineSeed);
//   const dataString = JSON.stringify(data);
//   const dataHex = u8aToHex(Buffer.from(dataString));
//   const signature = machineKeypair.sign(hexToU8a(dataHex));
//   const signatureHex = u8aToHex(signature);

//   return { dataHex, signatureHex };
// };



// export const registerDroneDID = async (droneId) => {
//   const { sdkInstanceInstance, keyring } = await initPeaqsdkInstance();

//   console.log("sdkInstanceInstance : ", sdkInstanceInstance._metadata.pair.address);

//   console.log("Registering Drone DID...");
//   // The "machine" seed or key
//   const seedsPath = path.join(process.cwd(), 'src' ,'utils', 'seeds.json');
//   const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));
//   const machineSeed = seeds.machine;
//   console.log("machineSeed : ", machineSeed);
//   // await cryptoWaitReady();
//   console.log("connecting to sdkInstance...");
//   const machinePair = keyring.addFromUri(machineSeed);
//   console.log("machinePair : ", machinePair.address);
//   await sdkInstanceInstance.connect();
//   console.log("Connected to sdkInstance");

//   try {
//     console.log('Registering Drone DID...');
//     const didResult = await sdkInstanceInstance.did.create(
//       {
//         name: `did:peaq:${machinePair.address}`,
//         // address: machinePair.address
//       },
//       (result) => {
//         // handle result / transaction status
//       }
//     );

//     console.log(`DID created for drone: ${droneId}`, didResult);
//     return didResult;
//   } catch (error) {
//     console.error('Error registering Drone DID:', error);
//     throw error;
//   } finally {
//     await sdkInstanceInstance.disconnect();
//   }
// };


//     // async signDroneData(droneData, dronePair) {
//     //     const dataHash = createDataHash(droneData);
//     //     const signature = dronePair.sign(hexToU8a(dataHash));
//     //     return {
//     //         dataHash,
//     //         signature: u8aToHex(signature)
//     //     };
//     // }

//     // createDataHash(droneData) {
//     //     return u8aToHex(
//     //         JSON.stringify({
//     //             id: droneData.id,
//     //             location: [droneData.deviceLocationLat, droneData.deviceLocationLng],
//     //             timestamp: new Date()
//     //         })
//     //     );
//     // }


// // export const storeDataOnChain = async (data) => {
// //   const { sdkInstanceInstance, keyring } = await initPeaqsdkInstance();
// //   const seedsPath = path.join(process.cwd(),'src', 'utils', 'seeds.json');
// //   const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));
// //   const machineSeed = seeds.machine;
  
// //   // await cryptoWaitReady();
// //   const machinePair = keyring.addFromUri(machineSeed);

// //   // Convert data to hex
// //   const dataHex = u8aToHex(JSON.stringify(data));
// //   const signature = u8aToHex(machinePair.sign(hexToU8a(dataHex)));

// //   const payload = {
// //     data: dataHex,
// //     signature: signature
// //   };

// //   // You can store using a custom extrinsic or "peaqStorage" (example from doc)
// //   const payloadHex = u8aToHex(JSON.stringify(payload));

// //   try {
// //     const txHash = await sdkInstanceInstance.api.tx.peaqStorage
// //       .addItem(machinePair.address, payloadHex)
// //       .signAndSend(machinePair);

// //     console.log('Data stored on-chain, transaction hash:', txHash.toHex());
// //     return txHash.toHex();
// //   } catch (error) {
// //     console.error('Error storing data on-chain:', error);
// //     throw error;
// //   }
// // };


// /**
//  * Stores signed data on the peaq blockchain.
//  * @param {Object} data - The drone data to store on-chain.
//  * @returns {String} - The transaction hash.
//  */
// export const storeDataOnChain = async (data) => {
//   console.log('storeDataOnChain called');
//   const {sdkInstanceInstance, keyring} = await initPeaqsdkInstance();

//   console.log("Creating keypair...");

//   const seedsPath = path.join(process.cwd(), 'src','utils', 'seeds.json');
//   const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));
//   const machineSeed = seeds.machine;

//   console.log("machineSeed : ", machineSeed);
//   // Generate and sign data
//   const { dataHex, signatureHex } = await generateAndSignData(machineSeed, data);

//   console.log("here.................................")

//   const payload = {
//     data: dataHex,
//     signature: signatureHex,
//   };

//   // Serialize payload into hex format for storage
//   const payloadHex = u8aToHex(Buffer.from(JSON.stringify(payload)));

//   try {
//     // Reuse generateKeyPair from utils
//     const { generateKeyPair } = await import('../../utils/utils.js');
//     const machinePair = generateKeyPair(machineSeed);

//     // const txHash = await makeExtrinsicCall(
//     //   "peaqStorage",
//     //   "addItem",
//     //   [machinePair.address, payloadHex],
//     //   true,
//     //   machinePair
//     // );

//     sdkInstanceInstance.connect();

//     try{
//       const txHash = await sdkInstanceInstance.storage.addItem({
//         itemType: "DID",
//         item: "hi"
//       })
//     }catch(error){
//       console.log("Error storing data on-chain:", error);
//       throw error;
//     }finally{
//       sdkInstanceInstance.disconnect();
//     }
  
//   } catch (error) {
//     console.error('Error storing data on-chain:', error);
//     throw error;
//   }
// };

// services/tier1Service.js
import fs from 'fs/promises';
import path from 'path';
import { initPeaqSDK } from '../../utils/blockchain.js';
import { u8aToHex, hexToU8a } from '@polkadot/util';
import { generateAndSignData, generateKeyPair } from '../../utils/utils.js';
import { deflate, inflate } from 'pako'; // For compression

/**
 * Creates a DID on the peaq blockchain.
 * @param {String} nameDID - The human-readable name for the DID.
 * @param {Object} customDocumentFields - Custom fields for the DID Document.
 * @returns {String} - The block hash of the transaction.
 */
export const createDID = async (nameDID, customDocumentFields) => {
  const {sdkInstance, keyring} = await initPeaqSDK();

  sdkInstance.connect();

  // console.log("===========================================")
  // console.log(sdkInstance)
  // console.log("===========================================")


  try {
    const blockHash = await sdkInstance.did.create({
      name: nameDID,
      // customDocumentFields: customDocumentFields
    });
    console.log("===========================================")
    console.log(`DID created for ${nameDID} with block hash: ${blockHash.block_hash}`);
    console.log("===========================================")
    return blockHash.block_hash;
  } catch (error) {
    console.error('Error creating DID:', error);
    throw error;
  }finally{
    sdkInstance.disconnect();
  }
};

/**
 * Reads a DID from the peaq blockchain.
 * @param {String} nameDID - The name of the DID to read.
 * @returns {Object} - The DID document.
 */
export const readDID = async (nameDID) => {
  const {sdkInstance, keyring} = await initPeaqSDK();
  sdkInstance.connect();
  try {
    const did = await sdkInstance.did.read({ name: nameDID });
    console.log(`DID document for ${nameDID}:`, did.document);
    return did.document;
  } catch (error) {
    console.error('Error reading DID:', error);
    throw error;
  }finally{
    sdkInstance.disconnect();
  }
};

/**
 * Updates a DID on the peaq blockchain.
 * @param {String} nameDID - The name of the DID to update.
 * @param {Object} customDocumentFields - The new custom fields for the DID Document.
 * @returns {String} - The block hash of the transaction.
 */
export const updateDID = async (nameDID, customDocumentFields) => {
  const {sdkInstance, keyring} = await initPeaqSDK();
  sdkInstance.connect();
  try {
    const blockHash = await sdkInstance.did.update({
      name: nameDID,
      customDocumentFields: customDocumentFields
    });

    console.log(`DID ${nameDID} updated with block hash: ${blockHash.block_hash}`);
    return blockHash.block_hash;
  } catch (error) {
    console.error('Error updating DID:', error);
    throw error;
  }finally{
    sdkInstance.disconnect();
  }
};

/**
 * Removes a DID from the peaq blockchain.
 * @param {String} nameDID - The name of the DID to remove.
 * @returns {Object} - The response object containing message and block_hash.
 */
export const removeDID = async (nameDID) => {
  const {sdkInstance, keyring} = await initPeaqSDK();
  sdkInstance.connect();
  try {
    const result = await sdkInstance.did.remove({ name: nameDID });
    console.log(`DID ${nameDID} removed:`, result.message);
    return result;
  } catch (error) {
    console.error('Error removing DID:', error);
    throw error;
  }finally{
    sdkInstance.disconnect();
  }
};





// Compress data before storing on chain
export const compressData = (data) => {
  try {
    // Convert data to string if it's an object
    const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
    
    // Compress the data
    const compressed = deflate(dataString, { level: 9 }); // Maximum compression level
    
    // Convert to hex string for storage
    const compressedHex = u8aToHex(compressed);
    
    // Check the size
    const sizeInBytes = compressedHex.length / 2; // Divide by 2 because hex encoding doubles the size
    if (sizeInBytes > 256) {
      throw new Error(`Compressed data size (${sizeInBytes} bytes) still exceeds 256 byte limit`);
    }
    
    return compressedHex;
  } catch (error) {
    throw new Error(`Compression failed: ${error.message}`);
  }
};


/**
 * Stores signed data on the peaq blockchain.
 * @param {Object} data - The drone data to store on-chain.
 * @returns {String} - The transaction hash.
 */
// export const storeDataOnChain = async (data) => {
//   // const {sdkInstance, keyring} = await initPeaqSDK();
//   // sdkInstance.connect();

//   // const seedsPath = path.join(process.cwd(), 'src','utils', 'seeds.json');
//   // const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));
//   // const machineSeed = seeds.machine;

//   // // Generate and sign data
//   // const { dataHex, signatureHex } = await generateAndSignData(machineSeed, data);
//   // console.log("dataHex : ", dataHex);
//   // const payload = {
//   //   data: dataHex,
//   //   signature: signatureHex,
//   // };
//   // console.log("payload : ", payload);

//   // const compressedPayload = compressData(payload);

//   // // Serialize payload into hex format for storage
//   // const payloadHex = u8aToHex(Buffer.from(JSON.stringify(compressedPayload)));

//   // console.log("payloadHex : ", payloadHex);

//   // // console.log("Payload size in bytes:", Buffer.from(payloadHex, 'hex').length);


//   // try {
//   //   // const machinePair = generateKeyPair(machineSeed);

//   //   console.log("Connecting to sdkInstance... ====================");
//   //   const txHash = await sdkInstance.storage.addItem({
//   //     itemType: data.id, // Assuming 'id' is unique and serves as itemType
//   //     item: payloadHex
//   //   });

//   //   console.log('Data stored on-chain, transaction hash:', txHash.block_hash);
//   //   return txHash.block_hash;
//   // } catch (error) {
//   //   console.error('Error storing data on-chain:', error);
//   //   throw error;
//   // }finally{
//   //   sdkInstance.disconnect();
//   // }


//   const {sdkInstance, keyring} = await initPeaqSDK();
//   sdkInstance.connect();

//   try {
//     const seedsPath = path.join(process.cwd(), 'src','utils', 'seeds.json');
//     const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));
//     const machineSeed = seeds.machine;
//   // Generate and sign data
//   const { dataHex, signatureHex } = await generateAndSignData(machineSeed, data);
    
//   // 1. First compress the dataHex itself
//   const compressedDataHex = u8aToHex(deflate(hexToU8a(dataHex), { level: 9 }));
  
//   // 2. Create a minimal payload with compressed data
//   const compressedPayload = {
//     d: compressedDataHex,
//     s: signatureHex.slice(0, 128) // Take first 64 bytes of signature if needed
//   };

//   // 3. Convert compressed payload to hex
//   const payloadHex = u8aToHex(Buffer.from(JSON.stringify(compressedPayload)));
//   console.log("Intermediate payloadHex size:", payloadHex.length / 2, "bytes");

//   // 4. Compress the payloadHex again
//   const finalCompressed = u8aToHex(deflate(hexToU8a(payloadHex), { level: 9 }));
//   console.log("Final compressed size:", finalCompressed.length / 2, "bytes");

//   // Verify final size
//   if (finalCompressed.length / 2 > 256) {
//     throw new Error(`Compressed data still exceeds 256 bytes: ${finalCompressed.length / 2} bytes`);
//   }

//   console.log("Connecting to sdkInstance...");
//   const txHash = await sdkInstance.storage.addItem({
//     itemType: data.id,
//     item: finalCompressed
//   });

//   console.log('Data stored on-chain, transaction hash:', txHash.block_hash);
//   return txHash.block_hash;
// } catch (error) {
//   console.error('Error storing data on-chain:', error);
//   throw error;
// } finally {
//   sdkInstance.disconnect();
// }
// };

/**
 * Retrieves and verifies data from the peaq blockchain.
 * @param {String} itemType - The key representing the item to retrieve.
 * @returns {Boolean} - True if data is verified successfully, else false.
 */
// export const retrieveAndVerifyData = async (itemType) => {
//   const {sdkInstance, keyring} = await initPeaqSDK();
//   sdkInstance.connect();
//   try {
//     const result = await sdkInstance.storage.getItem({ itemType: itemType });
//     if (!result || !result.data) {
//       throw new Error('Data not found.');
//     }

//     const payload = JSON.parse(Buffer.from(result.data.slice(2), 'hex').toString());

//     const { dataHex, signatureHex } = payload;

//     // Read the DID to get the public key
//     const droneId = itemType; // Assuming itemType is droneId
//     const didDocument = await readDID(droneId);
//     const publicKeyMultibase = didDocument.verificationMethods[0].publicKeyMultibase;
//     const publicKey = Buffer.from(publicKeyMultibase, 'hex');

//     // Verify signature
//     const { signatureVerify } = await import('@polkadot/util-crypto');

//     const isValid = signatureVerify(
//       hexToU8a(dataHex),
//       hexToU8a(signatureHex),
//       publicKey
//     ).isValid;

//     if (isValid) {
//       console.log('Data verified successfully.');
//       return true;
//     } else {
//       console.log('Verification failed.');
//       return false;
//     }
//   } catch (error) {
//     console.error('Error retrieving or verifying data:', error);
//     throw error;
//   }finally{
//     sdkInstance.disconnect();
//   }
// };



// export const retrieveAndVerifyData = async (itemType) => {
//   const {sdkInstance, keyring} = await initPeaqSDK();
//   sdkInstance.connect();
  
//   try {
//     const result = await sdkInstance.storage.getItem({ itemType: itemType });
//     if (!result || !result.data) {
//       throw new Error('Data not found.');
//     }

//     // 1. Decompress the outer layer
//     const compressedData = hexToU8a(result.data);
//     const decompressedPayloadHex = inflate(compressedData, { to: 'string' });
    
//     // 2. Parse the decompressed payload
//     const compressedPayload = JSON.parse(Buffer.from(hexToU8a(decompressedPayloadHex)).toString());
    
//     // 3. Decompress the inner dataHex
//     const dataHex = u8aToHex(inflate(hexToU8a(compressedPayload.d)));
//     const signatureHex = compressedPayload.s;

//     console.log('Decompressed dataHex:', dataHex);
//     console.log('Signature:', signatureHex);

//     // Read the DID to get the public key
//     const droneId = itemType;
//     const didDocument = await readDID(droneId);
//     const publicKeyMultibase = didDocument.verificationMethods[0].publicKeyMultibase;
//     const publicKey = Buffer.from(publicKeyMultibase, 'hex');

//     // Verify signature
//     const { signatureVerify } = await import('@polkadot/util-crypto');

//     const isValid = signatureVerify(
//       hexToU8a(dataHex),
//       hexToU8a(signatureHex),
//       publicKey
//     ).isValid;

//     if (isValid) {
//       // If verification successful, return both status and decompressed data
//       const decompressedData = JSON.parse(Buffer.from(hexToU8a(dataHex)).toString());
//       console.log('Data verified successfully.');
//       return {
//         isValid: true,
//         data: decompressedData
//       };
//     } else {
//       console.log('Verification failed.');
//       return {
//         isValid: false,
//         data: null
//       };
//     }
//   } catch (error) {
//     console.error('Error retrieving or verifying data:', error);
//     throw error;
//   } finally {
//     sdkInstance.disconnect();
//   }
// };

// export const storeDataOnChain = async (data) => {
//   const {sdkInstance, keyring} = await initPeaqSDK();
//   sdkInstance.connect();

//   try {
//     const seedsPath = path.join(process.cwd(), 'src','utils', 'seeds.json');
//     const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));
//     const machineSeed = seeds.machine;

//     // Generate and sign data
//     const { dataHex, signatureHex } = await generateAndSignData(machineSeed, data);
    
//     // Compress data
//     const compressedDataHex = u8aToHex(deflate(hexToU8a(dataHex), { level: 9 }));
//     const compressedPayload = {
//       d: compressedDataHex,
//       s: signatureHex
//     };

//     // Convert to final compressed hex
//     const payloadHex = u8aToHex(Buffer.from(JSON.stringify(compressedPayload)));
//     const finalCompressed = u8aToHex(deflate(hexToU8a(payloadHex), { level: 9 }));
    
//     // Split into chunks of 200 bytes (leaving room for metadata)
//     const chunkSize = 200;
//     const chunks = [];
//     for (let i = 0; i < finalCompressed.length; i += chunkSize * 2) {
//       chunks.push(finalCompressed.slice(i, i + chunkSize * 2));
//     }

//     console.log(`Splitting data into ${chunks.length} chunks`);

//     // Store chunks with metadata
//     const results = [];
//     for (let i = 0; i < chunks.length; i++) {
//       const chunkMetadata = {
//         total: chunks.length,
//         index: i,
//         chunk: chunks[i]
//       };

//       const txHash = await sdkInstance.storage.addItem({
//         itemType: `${data.id}_${i}`,
//         item: u8aToHex(Buffer.from(JSON.stringify(chunkMetadata)))
//       });
//       results.push(txHash.block_hash);
//     }

//     // Store chunk metadata
//     const metadataHash = await sdkInstance.storage.addItem({
//       itemType: `${data.id}_meta`,
//       item: u8aToHex(Buffer.from(JSON.stringify({
//         totalChunks: chunks.length,
//         originalId: data.id
//       })))
//     });

//     console.log('All chunks stored successfully');
//     return {
//       metadataHash: metadataHash.block_hash,
//       chunkHashes: results,
//       totalChunks: chunks.length
//     };
//   } catch (error) {
//     console.error('Error storing data on-chain:', error);
//     throw error;
//   } finally {
//     sdkInstance.disconnect();
//   }
// };

// // Modified retrieval function to handle chunks
// export const retrieveAndVerifyData = async (itemType) => {
//   const {sdkInstance, keyring} = await initPeaqSDK();
//   sdkInstance.connect();
  
//   try {
//     // First get metadata
//     const metadataResult = await sdkInstance.storage.getItem({ 
//       itemType: `${itemType}_meta` 
//     });
    
//     if (!metadataResult || !metadataResult.data) {
//       throw new Error('Metadata not found');
//     }

//     const metadata = JSON.parse(Buffer.from(metadataResult.data.slice(2), 'hex').toString());
//     const { totalChunks } = metadata;

//     // Retrieve all chunks
//     let assembledData = '';
//     for (let i = 0; i < totalChunks; i++) {
//       const chunkResult = await sdkInstance.storage.getItem({ 
//         itemType: `${itemType}_${i}` 
//       });
      
//       if (!chunkResult || !chunkResult.data) {
//         throw new Error(`Chunk ${i} not found`);
//       }

//       const chunkMetadata = JSON.parse(Buffer.from(chunkResult.data.slice(2), 'hex').toString());
//       assembledData += chunkMetadata.chunk;
//     }

//     // Decompress and verify assembled data
//     const decompressedPayloadHex = inflate(hexToU8a(assembledData), { to: 'string' });
//     const compressedPayload = JSON.parse(Buffer.from(hexToU8a(decompressedPayloadHex)).toString());
    
//     const dataHex = u8aToHex(inflate(hexToU8a(compressedPayload.d)));
//     const signatureHex = compressedPayload.s;

//     // Verify signature
//     const droneId = itemType;
//     const didDocument = await readDID(droneId);
//     const publicKeyMultibase = didDocument.verificationMethods[0].publicKeyMultibase;
//     const publicKey = Buffer.from(publicKeyMultibase, 'hex');

//     const { signatureVerify } = await import('@polkadot/util-crypto');
//     const isValid = signatureVerify(
//       hexToU8a(dataHex),
//       hexToU8a(signatureHex),
//       publicKey
//     ).isValid;

//     if (isValid) {
//       const decompressedData = JSON.parse(Buffer.from(hexToU8a(dataHex)).toString());
//       console.log('Data verified successfully');
//       return {
//         isValid: true,
//         data: decompressedData
//       };
//     } else {
//       console.log('Verification failed');
//       return {
//         isValid: false,
//         data: null
//       };
//     }
//   } catch (error) {
//     console.error('Error retrieving or verifying data:', error);
//     throw error;
//   } finally {
//     sdkInstance.disconnect();
//   }
// };

export const storeDataOnChain = async (data) => {
  const {sdkInstance, keyring} = await initPeaqSDK();
  sdkInstance.connect();

  try {
    const seedsPath = path.join(process.cwd(), 'src','utils', 'seeds.json');
    const seeds = JSON.parse(await fs.readFile(seedsPath, 'utf8'));
    const machineSeed = seeds.machine;

    // Generate and sign data
    const { dataHex, signatureHex } = await generateAndSignData(machineSeed, data);
    
    // Store only the signature
    const payload = {
      s: signatureHex  // Only storing signature
    };

    // Convert to hex and compress
    const payloadHex = u8aToHex(Buffer.from(JSON.stringify(payload)));
    console.log("Original payload size:", payloadHex.length / 2, "bytes");

    const compressedHex = u8aToHex(deflate(hexToU8a(payloadHex), { level: 9 }));
    console.log("Compressed size:", compressedHex.length / 2, "bytes");

    if (compressedHex.length / 2 > 256) {
      throw new Error(`Compressed data still exceeds 256 bytes: ${compressedHex.length / 2} bytes`);
    }

    console.log("Connecting to sdkInstance...");
    const txHash = await sdkInstance.storage.addItem({
      itemType: data.id,
      item: compressedHex
    });

    console.log('Signature stored on-chain, transaction hash:', txHash.block_hash);
    return txHash.block_hash;
  } catch (error) {
    console.error('Error storing data on-chain:', error);
    throw error;
  } finally {
    sdkInstance.disconnect();
  }
};

// export const retrieveAndVerifyData = async (itemType) => {
//   const {sdkInstance, keyring} = await initPeaqSDK();
//   sdkInstance.connect();
  
//   try {
//     const result = await sdkInstance.storage.getItem({ itemType: itemType });
//     if (!result || !result.data) {
//       throw new Error('Data not found.');
//     }

//     // Decompress and get signature
//     const compressedData = hexToU8a(result.data);
//     const decompressedPayloadHex = inflate(compressedData, { to: 'string' });
//     const payload = JSON.parse(Buffer.from(hexToU8a(decompressedPayloadHex)).toString());
    
//     const signatureHex = payload.s;
//     console.log('Retrieved signature:', signatureHex);

//     // Get the public key from DID
//     const droneId = itemType;
//     const didDocument = await readDID(droneId);
//     const publicKeyMultibase = didDocument.verificationMethods[0].publicKeyMultibase;
//     const publicKey = Buffer.from(publicKeyMultibase, 'hex');

//     // Verify signature
//     const { signatureVerify } = await import('@polkadot/util-crypto');

//     // Note: You'll need to reconstruct or obtain the original data separately
//     // This could be from a separate storage system or passed as a parameter
//     const isValid = signatureVerify(
//       hexToU8a(dataHex),  // You'll need to obtain dataHex separately
//       hexToU8a(signatureHex),
//       publicKey
//     ).isValid;

//     if (isValid) {
//       console.log('Signature verified successfully.');
//       return {
//         isValid: true,
//         signature: signatureHex
//       };
//     } else {
//       console.log('Verification failed.');
//       return {
//         isValid: false,
//         signature: null
//       };
//     }
//   } catch (error) {
//     console.error('Error retrieving or verifying signature:', error);
//     throw error;
//   } finally {
//     sdkInstance.disconnect();
//   }
// };



// Helper function to ensure proper hex format



export const retrieveAndVerifyData = async (itemType) => {
  const {sdkInstance, keyring} = await initPeaqSDK();
  sdkInstance.connect();
  
  try {
    const result = await sdkInstance.storage.getItem({ itemType: itemType });
    if (!result || !result.data) {
      throw new Error('Data not found.');
    }

    console.log('Raw result data:', result.data); // Debug log

    try {
      // Decompress and get signature
      const compressedData = hexToU8a(result.data);
      console.log('Compressed data:', Buffer.from(compressedData).toString('hex')); // Debug log
      
      const decompressedData = inflate(compressedData);
      console.log('Decompressed data:', Buffer.from(decompressedData).toString()); // Debug log
      
      const decompressedString = Buffer.from(decompressedData).toString();
      console.log('Decompressed string:', decompressedString); // Debug log

      let payload;
      try {
        payload = JSON.parse(decompressedString);
      } catch (parseError) {
        console.error('JSON Parse error:', parseError);
        // Try parsing with hex conversion
        const hexString = Buffer.from(decompressedData).toString('hex');
        payload = JSON.parse(Buffer.from(hexString, 'hex').toString());
      }

      const signatureHex = payload.s;
      console.log('Retrieved signature:', signatureHex);

      // Get the public key from DID
      const droneId = itemType;
      const didDocument = await readDID(droneId);
      const publicKeyMultibase = didDocument.verificationMethods[0].publicKeyMultibase;
      const publicKey = Buffer.from(publicKeyMultibase, 'hex');

      // Since we're only storing signatures, we need the original data to verify
      const originalDataHex = u8aToHex(Buffer.from(JSON.stringify(data)));

      // Verify signature
      const { signatureVerify } = await import('@polkadot/util-crypto');

      const isValid = signatureVerify(
        hexToU8a(originalDataHex),
        hexToU8a(signatureHex),
        publicKey
      ).isValid;

      if (isValid) {
        console.log('Signature verified successfully.');
        return {
          isValid: true,
          signature: signatureHex
        };
      } else {
        console.log('Verification failed.');
        return {
          isValid: false,
          signature: null
        };
      }
    } catch (processingError) {
      // console.error('Error processing retrieved data:', processingError);
      // throw new Error(`Error processing retrieved data: ${processingError.message}`);
    }
  } catch (error) {
    // console.error('Error retrieving or verifying signature:', error);
    // throw error;
  } finally {
    sdkInstance.disconnect();
  }
};




const ensureHexPrefix = (hex) => {
  return hex.startsWith('0x') ? hex : `0x${hex}`;
};

// Helper function to handle potential compression errors
const safeDecompress = (compressedData) => {
  try {
    return inflate(compressedData, { to: 'string' });
  } catch (error) {
    throw new Error(`Decompression failed: ${error.message}`);
  }
};



















