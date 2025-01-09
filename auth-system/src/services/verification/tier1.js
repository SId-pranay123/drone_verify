import Keyring from "@polkadot/keyring";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { DroneData } from '../../models/DroneData.js';

export class Tier1Verification {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    async verify(droneData) {
        try {
            const keyring = new Keyring({ type: "sr25519" });
            const dronePair = keyring.addFromUri(process.env.DRONE_SEED);

            // Register if not already registered
            const existingDrone = await DroneData.findOne({ droneId: droneData.id });
            if (!existingDrone) {
                await this.blockchainService.registerDrone(
                    droneData.id,
                    dronePair.address,
                    {
                        serialNumber: droneData.remoteData.basicIDs[0].serialNumber,
                        registrationTime: Date.now()
                    }
                );
            }

            const signedData = await this.signDroneData(droneData, dronePair);
            return { verified: true, signature: signedData };
        } catch (error) {
            console.error('Tier 1 verification failed:', error);
            return { verified: false, error: error.message };
        }
    }

    async signDroneData(droneData, dronePair) {
        const dataHash = this.createDataHash(droneData);
        const signature = dronePair.sign(hexToU8a(dataHash));
        return {
            dataHash,
            signature: u8aToHex(signature)
        };
    }

    createDataHash(droneData) {
        return u8aToHex(
            JSON.stringify({
                id: droneData.id,
                location: [droneData.deviceLocationLat, droneData.deviceLocationLng],
                timestamp: new Date()
            })
        );
    }
}