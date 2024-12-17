// src/services/seedService.js
import { mnemonicGenerate, mnemonicToMiniSecret, naclKeypairFromSeed } from '@polkadot/util-crypto';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * Generates a new mnemonic seed phrase.
 * @returns {string} - The generated seed phrase.
 */
export const generateMnemonic = () => {
  return mnemonicGenerate();
};

/**
 * Derives a key pair from a mnemonic seed phrase.
 * @param {string} mnemonic - The seed phrase.
 * @returns {object} - The key pair.
 */
export const deriveKeyPair = (mnemonic) => {
  const seed = mnemonicToMiniSecret(mnemonic);
  const keyPair = naclKeypairFromSeed(seed);
  return keyPair;
};

/**
 * Encrypts a seed phrase using a passphrase.
 * @param {string} seed - The seed phrase to encrypt.
 * @param {string} passphrase - The passphrase for encryption.
 * @returns {string} - The encrypted seed in hex format.
 */
export const encryptSeed = (seed, passphrase) => {
  const cipher = crypto.createCipher('aes-256-cbc', passphrase);
  let encrypted = cipher.update(seed, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * Decrypts an encrypted seed phrase using a passphrase.
 * @param {string} encryptedSeed - The encrypted seed in hex format.
 * @param {string} passphrase - The passphrase for decryption.
 * @returns {string} - The decrypted seed phrase.
 */
export const decryptSeed = (encryptedSeed, passphrase) => {
  const decipher = crypto.createDecipher('aes-256-cbc', passphrase);
  let decrypted = decipher.update(encryptedSeed, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * Saves the encrypted seed to a secure file or database.
 * For demonstration, we'll save it to a JSON file.
 * @param {string} droneId - The identifier for the drone.
 * @param {string} encryptedSeed - The encrypted seed phrase.
 */
export const saveEncryptedSeed = async (droneId, encryptedSeed) => {
  const filePath = path.join(__dirname, '../../seeds_encrypted.json');
  let seeds = {};
  
  try {
    const data = await fs.readFile(filePath, 'utf8');
    seeds = JSON.parse(data);
  } catch (err) {
    // File might not exist yet
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  
  seeds[droneId] = encryptedSeed;
  
  await fs.writeFile(filePath, JSON.stringify(seeds, null, 2), 'utf8');
};

/**
 * Retrieves and decrypts the seed phrase for a given drone.
 * @param {string} droneId - The identifier for the drone.
 * @param {string} passphrase - The passphrase for decryption.
 * @returns {string} - The decrypted seed phrase.
 */
export const getDecryptedSeed = async (droneId, passphrase) => {
  const filePath = path.join(__dirname, '../../seeds_encrypted.json');
  
  const data = await fs.readFile(filePath, 'utf8');
  const seeds = JSON.parse(data);
  
  const encryptedSeed = seeds[droneId];
  if (!encryptedSeed) {
    throw new Error(`Encrypted seed for drone ${droneId} not found.`);
  }
  
  const decryptedSeed = decryptSeed(encryptedSeed, passphrase);
  return decryptedSeed;
};
