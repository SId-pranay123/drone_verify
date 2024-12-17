// src/controllers/dataController.js
import DroneData from "../models/DroneData.js";
import fs from "fs/promises";
import { generateKeyPair, signData, makeExtrinsicCall } from "../utils/utils.js";
import { u8aToHex, hexToU8a } from "@polkadot/util";
import { signatureVerify } from "@polkadot/util-crypto";

export const submitData = async (req, res) => {
  try {
    const { remoteId, latitude, longitude, speed, height } = req.body;

    // Load seeds
    const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
    const droneSeed = seeds[remoteId];

    if (!droneSeed) {
      return res.status(400).json({ error: "Invalid Drone ID" });
    }

    // Generate Key Pair for Drone
    const droneKeypair = generateKeyPair(droneSeed);

    // Prepare Data
    const data = { remoteId, latitude, longitude, speed, height };
    const dataString = JSON.stringify(data);
    const dataHex = u8aToHex(Buffer.from(dataString));

    // Sign Data
    const signature = signData(dataHex, droneKeypair);

    // Store in MongoDB
    const droneData = new DroneData({
      remoteId,
      latitude,
      longitude,
      speed,
      height,
      signature: u8aToHex(signature)
      // blockchainTxHash will be updated after blockchain storage
    });

    await droneData.save();

    // Prepare Payload for Blockchain
    const payload = {
      data: dataHex,
      signature: u8aToHex(signature)
    };

    const payloadHex = u8aToHex(Buffer.from(JSON.stringify(payload)));

    // Make Extrinsic Call to Store Data on Blockchain
    const txHash = await makeExtrinsicCall(
      "peaqStorage",
      "addItem",
      [droneKeypair.address, payloadHex],
      true,
      droneKeypair
    );

    // Update MongoDB with Transaction Hash
    droneData.blockchainTxHash = txHash;
    await droneData.save();

    res.status(200).json({ message: "Data submitted and stored on blockchain", txHash });
  } catch (error) {
    console.error("Data Submission Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
