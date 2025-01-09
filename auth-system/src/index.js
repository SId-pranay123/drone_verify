import { DroneAuthService } from './services/DroneAuthService.js';
import { DatabaseService } from './services/database.js';

const main = async () => {
    await DatabaseService.connect();
    
    const droneAuthService = new DroneAuthService();
    await droneAuthService.initialize();
    
    // Example drone data
    const sampleDroneData = {
        id: "cm3ybceli0001khbogij0mbwx",
        userId: "618",
        remoteData: {
            basicIDs: [{
                uasId: null,
                idType: "Serial_Number",
                uaType: "Aeroplane",
                serialNumber: "EDDLYW7IA01N8IHY2QEN"
            }]
        },
        deviceLocationLat: 51.50519,
        deviceLocationLng: -0.22469
    };

    // Process drone data
    await droneAuthService.processDroneData(sampleDroneData);
};

// Handle application shutdown
process.on('SIGINT', async () => {
    await DatabaseService.disconnect();
    process.exit(0);
});

main().catch(console.error);