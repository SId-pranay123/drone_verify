// import { DroneAuthService } from './services/DroneAuthService.js';
// import { DatabaseService } from './services/database.js';

// const main = async () => {
//     await DatabaseService.connect();
    
//     const droneAuthService = new DroneAuthService();
//     await droneAuthService.initialize();

//     console.log('Drone authentication service started');
    
//     // Example drone data
//     const sampleDroneData = {
//         id: "cm3ybceli0001khbogij0macy",
//         userId: "619",
//         remoteData: {
//             basicIDs: [{
//                 uasId: 1,
//                 idType: "another_one",
//                 uaType: "Drone",
//                 serialNumber: "EDDLYW7IA01N8IHY2QEN"
//             }]
//         },
//         deviceLocationLat: 51.50519,
//         deviceLocationLng: -0.22469
//     };


//     console.log('Processing sample drone data...');

//     // Process drone data
//     await droneAuthService.processDroneData(sampleDroneData);
// };

// // Handle application shutdown
// process.on('SIGINT', async () => {
//     await DatabaseService.disconnect();
//     process.exit(0);
// });

// main().catch(console.error);









import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});