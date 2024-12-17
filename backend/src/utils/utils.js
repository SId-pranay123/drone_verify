// src/utils/utils.js
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, signatureVerify } from "@polkadot/util-crypto";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { ApiPromise, WsProvider } from "@polkadot/api";

export const generateKeyPair = (seed) => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(seed);
};

export const signData = (dataHex, keypair) => {
  return keypair.sign(hexToU8a(dataHex));
};

export const makeExtrinsicCall = async (module, method, params, isSigned, keypair) => {
  await cryptoWaitReady();
  const provider = new WsProvider("wss://wsspc1-qa.agung.peaq.network");
  const api = await ApiPromise.create({ provider });

  const tx = api.tx[module][method](...params);

  return new Promise((resolve, reject) => {
    tx.signAndSend(keypair, (result) => {
      if (result.status.isInBlock || result.status.isFinalized) {
        resolve(result.status.asInBlock.toString());
        // Optionally, handle unsubscribing here
      }
    }).catch(err => {
      reject(err);
    });
  });
};

export const getStorage = async (itemType) => {
  await cryptoWaitReady();
  const provider = new WsProvider("wss://wsspc1-qa.agung.peaq.network");
  const api = await ApiPromise.create({ provider });

  const data = await api.query.peaqStorage[itemType]();
  return data.toHex();
};

export const verifySignature = (dataHex, signatureHex, publicKey) => {
  const dataU8a = hexToU8a(dataHex);
  const signatureU8a = hexToU8a(signatureHex);
  return signatureVerify(dataU8a, signatureU8a, publicKey).isValid;
};
