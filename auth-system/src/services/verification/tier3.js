// export class Tier3Verification {
//     async verify(droneData) {
//         try {
//             const [registrationValid, locationValid, weatherValid] = await Promise.all([
//                 this.checkRegistrationOracle(droneData),
//                 this.checkLocationOracle(droneData),
//                 this.checkWeatherOracle(droneData)
//             ]);

//             return {
//                 verified: registrationValid && locationValid && weatherValid,
//                 details: {
//                     registration: registrationValid,
//                     location: locationValid,
//                     weather: weatherValid
//                 }
//             };
//         } catch (error) {
//             console.error('Tier 3 verification failed:', error);
//             return { verified: false, error: error.message };
//         }
//     }

//     // Simulate oracle checks (to be implemented with real APIs)
//     async checkRegistrationOracle(droneData) {
//         // Simulate API call to registration authority
//         return true;
//     }

//     async checkLocationOracle(droneData) {
//         // Simulate checking no-fly zones
//         return true;
//     }

//     async checkWeatherOracle(droneData) {
//         // Simulate weather conditions check
//         return true;
//     }
// }











import OracleResult from '../../models/OracleResult.js';

// Stub for an "OracleService" that checks external data source
const mockOracleService = async (droneData) => {
  // A real implementation might query an external API, run ML inference, etc.
  // Here we just accept everything as verified for demonstration.
  return true;
};

export const verifyDataWithOracle = async (dataId, droneData) => {
  // In real life: pick a real oracle, pass `droneData`
  const oracleName = 'MockOracle';
  const isValid = await mockOracleService(droneData);

  // Record the result in DB
  const result = await OracleResult.create({
    dataId,
    oracleName,
    verificationResult: isValid
  });
  return result;
};
