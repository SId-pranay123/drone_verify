import PQueue from 'p-queue';
import { BlockchainService } from '../utils/blockchain.js';
import { Tier1Verification } from './verification/tier1.js';
import { Tier2Verification } from './verification/tier2.js';
import { Tier3Verification } from './verification/tier3.js';
import { DroneData } from '../models/DroneData.js';

export class DroneAuthService {
    constructor() {
        this.queue = new PQueue({
            concurrent: 1,
            interval: 1000
        });
        this.blockchainService = new BlockchainService();
        this.tier1 = new Tier1Verification(this.blockchainService);
        this.tier2 = new Tier2Verification();
        this.tier3 = new Tier3Verification();
    }

    async initialize() {
        await this.blockchainService.initialize();
    }

    async processDroneData(rawData) {
        this.queue.add(async () => {
            try {
                // Perform all verifications
                console.log(`Processing drone data: ${rawData.id}`);
                const [tier1Result, tier2Result, tier3Result] = await Promise.all([
                    this.tier1.verify(rawData),
                    this.tier2.verify(rawData),
                    this.tier3.verify(rawData)
                ]);

                console.log(`Tier 1: ${tier1Result.verified}`);
                console.log(`Tier 2: ${tier2Result.verified}`);
                console.log(`Tier 3: ${tier3Result.verified}`);

                // Store results
                const droneData = new DroneData({
                    droneId: rawData.id,
                    userId: rawData.userId,
                    serialNumber: rawData.remoteData.basicIDs[0].serialNumber,
                    deviceLocation: {
                        type: 'Point',
                        coordinates: [rawData.deviceLocationLng, rawData.deviceLocationLat]
                    },
                    remoteData: rawData.remoteData,
                    verificationStatus: {
                        tier1: tier1Result.verified,
                        tier2: tier2Result.verified,
                        tier3: tier3Result.verified,
                        timestamp: new Date()
                    }
                });

                await droneData.save();

                // Store verification result on blockchain
                // await this.blockchainService.storeVerificationResult(
                //     rawData.id,
                //     JSON.stringify({
                //         tier1: tier1Result,
                //         tier2: tier2Result,
                //         tier3: tier3Result,
                //         timestamp: new Date()
                //     })
                // );

                console.log(`Drone ${rawData.id} data processed successfully`);
            } catch (error) {
                console.error(`Error processing drone data: ${error.message}`);
            }
        });
    }
}