// scripts/registerDrone.js
import { Sdk } from "@peaq-network/sdk";
import { Keyring } from "@polkadot/keyring";
import fs from "fs/promises";

const registerDrone = async () => {
  try {
    const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
    const ownerSeed = seeds.owner;
    const droneSeeds = Object.keys(seeds).filter(key => key !== "owner");

    const sdkInstance = await Sdk.createInstance({
      baseUrl: "wss://wsspc1-qa.agung.peaq.network",
      seed: ownerSeed,
    });

    const keyring = new Keyring({ type: "sr25519" });

    for (const droneKey of droneSeeds) {
      const dronePair = keyring.addFromUri(seeds[droneKey]);

      // Register the drone's DID
      const result = await sdkInstance.did.create(
        { name: `did:peaq:${dronePair.address}`, address: dronePair.address },
        (result) => {
          console.log(`Registration Result for ${droneKey}:`, result);
        }
      );

      console.log(`Drone ${droneKey} registered with DID: did:peaq:${dronePair.address}`);
    }
  } catch (error) {
    console.error("Registration Error:", error);
  }
};

registerDrone();
