import { Keyring } from '@polkadot/keyring';
import { hexToU8a, u8aToHex } from '@polkadot/util';
// import { cryptoWaitReady } from '@polkadot/util-crypto';

/**
 * Generates a key pair from a seed.
 * @param {String} seed - The seed phrase.
 * @returns {KeyringPair} - The key pair.
 */
export const generateKeyPair = (seed) => {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromUri(seed);
};

/**
 * Generates and signs data.
 * @param {String} machineSeed - The machine's seed phrase.
 * @param {Object} data - The data to sign.
 * @returns {Object} - Contains dataHex and signatureHex.
 */
export const generateAndSignData = async (machineSeed, data) => {
  // await cryptoWaitReady();
  const machineKeypair = generateKeyPair(machineSeed);
  const dataString = JSON.stringify(data);
  const dataHex = u8aToHex(Buffer.from(dataString));
  const signature = machineKeypair.sign(hexToU8a(dataHex));
  const signatureHex = u8aToHex(signature);

  return { dataHex, signatureHex };
};

/**
 * Generates a DID Document hash.
 * @param {String} address - The machine's address.
 * @param {Object} customDocumentFields - Custom fields for the DID Document.
 * @returns {String} - The DID Document hash.
 */
export const generateDidDocument = async (address, customDocumentFields) => {
  const { Sdk } = await import('@peaq-network/sdk'); // Dynamic import to prevent circular dependencies
  const didHash = await Sdk.generateDidDocument({ address, customDocumentFields });
  return didHash.value;
};