// import Drone from '../models/DroneData.js';
// import { registerDroneDID, storeDataOnChain } from './verification/tier1.js';
// import { learnPatterns, validateDataWithPatterns } from './verification/tier2.js';
// import { verifyDataWithOracle } from './verification/tier3.js';

// /**
//  * Register a new drone, store the data in Mongo, and register the DID on-chain.
//  */
// export const registerNewDrone = async (dronePayload) => {
//   // 1. Store in DB
//   const { deviceLocationLat, deviceLocationLng } = dronePayload;
//   const droneData = {
//     ...dronePayload,
//     deviceLocation: {
//       type: 'Point',
//       coordinates: [deviceLocationLng, deviceLocationLat]
//     }
//   };

//   const drone = await Drone.create(droneData);

//   // 2. Register DID on peaq
//   await registerDroneDID(drone.id);

//   // Mark tier1Verified = true if the data is truly from the device
//   // (this might be subject to additional checks or signing logic)
//   drone.tier1Verified = true;
//   await drone.save();

//   // Store Tier 1 data on-chain
//   await storeDataOnChain(dronePayload);

//   // Learn patterns from Tier 1 data
//   await learnPatterns(drone.id, droneData);

//   return drone;
// };

// /**
//  * Process new drone data (e.g., from a queue). 
//  * Attempt Tier1, then Tier2, then Tier3 if needed.
//  */
// export const processDroneData = async (dronePayload) => {
//   // Find existing drone doc
//   const existingDrone = await Drone.findOne({ id: dronePayload.id });
//   if (!existingDrone) {
//     throw new Error(`Drone with ID ${dronePayload.id} not found.`);
//   }

//   // Example:
//   // 1) If the data is directly signed by the drone => store on chain (Tier 1)
//   //    For simplicity, let's assume it's from the drone itself:
//   await storeDataOnChain(dronePayload);
//   existingDrone.tier1Verified = true;
//   await existingDrone.save();

//   // 2) Tier 2: Pattern matching
//   const patternMatch = await validateDataWithPatterns(existingDrone.id, dronePayload);
//   if (patternMatch) {
//     existingDrone.tier2Verified = true;
//     await existingDrone.save();
//   }

//   // 3) Tier 3: Oracle-based
//   const oracleResult = await verifyDataWithOracle(existingDrone.id, dronePayload);
//   if (oracleResult.verificationResult) {
//     existingDrone.tier3Verified = true;
//     await existingDrone.save();
//   }

//   return existingDrone;
// };


// /**
//  * Removes a drone's DID from the blockchain and database.
//  * @param {String} droneId - The unique identifier of the drone.
//  * @returns {Object} - The removal result.
//  */
// export const removeDrone = async (droneId) => {
//   const drone = await Drone.findOne({ id: droneId });
//   if (!drone) {
//     throw new Error(`Drone with ID ${droneId} not found.`);
//   }

//   // Remove DID from blockchain
//   const removeResult = await removeDID(droneId);

//   // Optionally, remove drone from DB
//   await Drone.deleteOne({ id: droneId });
//   console.log(`Drone ${droneId} removed from DB and blockchain`);

//   return removeResult;
// };







// services/droneService.js
import Drone from '../models/DroneData.js';
import { createDID, readDID, updateDID, removeDID, storeDataOnChain, retrieveAndVerifyData } from './verification/tier1.js';
import { learnPatterns, validateDataWithPatterns } from './verification/tier2.js';
import { verifyDataWithOracle } from './verification/tier3.js';

/**
 * Registers a new drone:
 * 1. Stores the drone in MongoDB.
 * 2. Creates a DID on the peaq blockchain.
 * 3. Marks Tier 1 as verified.
 * 4. Stores signed data on-chain.
 * 5. Learns patterns from Tier 1 data.
 * @param {Object} dronePayload - The drone data payload.
 * @returns {Object} - The registered Drone document.
 */
export const registerNewDrone = async (dronePayload) => {
  const { deviceLocationLat, deviceLocationLng } = dronePayload;
  const droneData = {
    ...dronePayload,
    deviceLocation: {
      type: 'Point',
      coordinates: [deviceLocationLng, deviceLocationLat]
    }
  };

  console.log("=====================================")
  console.log("=========Drone payload ==============")  
  console.log(droneData)

  // 5CkMQCvzBLaHkJavq6KSMWweKWtRcLHT6hK6JH35ysSz38JT

  // Store in DB
  const drone = await Drone.create(droneData);
  console.log(`Drone registered in DB with ID ${drone.id}`);
  console.log("=====================================")

  // Define customDocumentFields for DID
  const mongoID = drone.id; // Using drone's unique ID
  const customDocumentFields = {
    prefix: 'peaq', // Customize as needed
    controller: '5CkMQCvzBLaHkJavq6KSMWweKWtRcLHT6hK6JH35ysSz38JT', // Replace with actual controller address
    verifications: [
      {
        type: 'Ed25519VerificationKey2020'
      }
    ],
    signature: {
      type: 'Ed25519VerificationKey2020',
      issuer: '5CkMQCvzBLaHkJavq6KSMWweKWtRcLHT6hK6JH35ysSz38JT', // Replace with actual issuer address
      hash: '0x12345' // Replace with actual hash
    },
    services: [
      {
        id: '#mongoDBConnection',
        type: 'yourDataBaseName',
        serviceEndpoint: 'mongodb+srv://siddharthtechsteck:1oxZ161djmEQagly@cluster0.nuwajor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/droneData',
        data: 'yourCollectionName'
      },
      {
        id: '#mongoDBIdentifier',
        type: 'mongoID',
        serviceEndpoint: 'mongodb+srv://siddharthtechsteck:1oxZ161djmEQagly@cluster0.nuwajor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/droneData',
        data: mongoID
      },
    ]
  };

  console.log("=====================================")
  // Create DID on blockchain
  await createDID(drone.id, customDocumentFields);

  // Mark Tier 1 as verified
  drone.tier1Verified = true;
  await drone.save();
  console.log(`Tier 1 verified for drone ${drone.id}`);

  console.log("=====================================")
  console.log("=========Drone payload ==============")

  // Store signed data on-chain
  await storeDataOnChain(dronePayload);

  // Learn patterns from Tier 1 data
  await learnPatterns(drone.id, dronePayload);

  return drone;
};

/**
 * Processes new drone data:
 * 1. Stores data on-chain (Tier 1).
 * 2. Validates data with pattern matching (Tier 2).
 * 3. Verifies data with oracle (Tier 3).
 * @param {Object} dronePayload - The drone data payload.
 * @returns {Object} - The updated Drone document.
 */
export const processDroneData = async (dronePayload) => {
  const existingDrone = await Drone.findOne({ id: dronePayload.id });
  if (!existingDrone) {
    throw new Error(`Drone with ID ${dronePayload.id} not found.`);
  }

  console.log("=====================================")
  console.log("=========Drone payload ==============")  
  console.log(dronePayload)
  console.log("=====================================")
  console.log("=========Drone payload ==============")  
  // Tier 1: Store data on-chain
  await storeDataOnChain(dronePayload);
  existingDrone.tier1Verified = true;
  await existingDrone.save();
  console.log(`Tier 1 verified for drone ${existingDrone.id}`);

  // Tier 2: Pattern matching
  const patternMatch = await validateDataWithPatterns(existingDrone.id, dronePayload);
  if (patternMatch) {
    existingDrone.tier2Verified = true;
    await existingDrone.save();
    console.log(`Tier 2 verified for drone ${existingDrone.id}`);
  }

  // Tier 3: Oracle-based verification
  const oracleResult = await verifyDataWithOracle(existingDrone.id, dronePayload);
  if (oracleResult.verificationResult) {
    existingDrone.tier3Verified = true;
    await existingDrone.save();
    console.log(`Tier 3 verified for drone ${existingDrone.id}`);
  }

  return existingDrone;
};

/**
 * Removes a drone's DID from the blockchain and database.
 * @param {String} droneId - The unique identifier of the drone.
 * @returns {Object} - The removal result.
 */
export const removeDrone = async (droneId) => {
  const drone = await Drone.findOne({ id: droneId });
  if (!drone) {
    throw new Error(`Drone with ID ${droneId} not found.`);
  }

  // Remove DID from blockchain
  const removeResult = await removeDID(droneId);

  // Optionally, remove drone from DB
  await Drone.deleteOne({ id: droneId });
  console.log(`Drone ${droneId} removed from DB and blockchain`);

  return removeResult;
};