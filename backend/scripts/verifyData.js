// scripts/verifyData.js
import fs from 'fs/promises';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import { getStorage, generateKeyPair } from '../src/utils/utils.js';

const verifyData = async (itemType, droneId) => {
  try {
    const storedDataHex = await getStorage(itemType);

    if (!storedDataHex) {
      throw new Error('Data not found on blockchain.');
    }

    const payload = JSON.parse(Buffer.from(hexToU8a(storedDataHex)).toString());

    const { data: dataHex, signature: signatureHex } = payload;

    // Load seeds
    const seeds = JSON.parse(await fs.readFile('seeds.json', 'utf8'));
    const droneSeed = seeds[droneId];

    if (!droneSeed) {
      throw new Error('Invalid Drone ID for verification.');
    }

    const droneKeypair = generateKeyPair(droneSeed);

    const isValid = signatureVerify(hexToU8a(dataHex), hexToU8a(signatureHex), droneKeypair.publicKey).isValid;

    if (isValid) {
      console.log('Data verified successfully.');
    } else {
      console.log('Data verification failed.');
    }
  } catch (error) {
    console.error("Verification Error:", error);
  }
};

// Example usage:
// node scripts/verifyData.js your_item_type_here drone1

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error("Usage: node verifyData.js <itemType> <droneId>");
  process.exit(1);
}

const [itemType, droneId] = args;
verifyData(itemType, droneId);
