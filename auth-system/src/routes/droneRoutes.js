import { Router } from 'express';
import { registerNewDrone, processDroneData } from '../services/droneService.js';
import { retrieveAndVerifyData } from '../services/verification/tier1.js';

const router = Router();

/**
 * POST /drone/register
 */
router.post('/register', async (req, res) => {
  try {
    const drone = await registerNewDrone(req.body);
    return res.status(201).json({ success: true, data: drone });
  } catch (error) {
    console.error('Error registering drone:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /drone/data
 * In production, you might push to a queue instead of direct processing.
 */
router.post('/data', async (req, res) => {
  try {
    const updatedDrone = await processDroneData(req.body);
    return res.status(200).json({ success: true, data: updatedDrone });
  } catch (error) {
    console.error('Error processing drone data:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /drone/:id
 * Removes a drone's DID and data.
 */
router.delete('/:id', async (req, res) => {
  try {
    const result = await removeDrone(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error removing drone:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


/**
 * POST /drone/verify
 * Verifies and retrieves drone data from the blockchain
 */
// router.post('/verify', async (req, res) => {
//   try {
//     const { droneId, data } = req.body;
    
//     if (!droneId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'droneId is required' 
//       });
//     }

//     const verificationResult = await retrieveAndVerifyData(droneId);
    
//     if (verificationResult.isValid) {
//       return res.status(200).json({
//         success: true,
//         message: 'Data verified successfully',
//         data: {
//           signature: verificationResult.signature,
//           isValid: true
//         }
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Data verification failed',
//         data: {
//           isValid: false
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error verifying drone data:', error);
//     return res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// });


router.post('/verify', async (req, res) => {
  try {
    const { droneId, ...droneData } = req.body;
    
    if (!droneId) {
      return res.status(400).json({ 
        success: false, 
        message: 'droneId is required' 
      });
    }

    const verificationResult = await retrieveAndVerifyData(droneId, droneData);
    
    if (verificationResult.isValid) {
      return res.status(200).json({
        success: true,
        message: 'Data verified successfully',
        data: {
          signature: verificationResult.signature,
          isValid: true
        }
      });
    } else {
      // return res.status(400).json({
      //   success: false,
      //   message: 'Data verification failed',
      //   data: {
      //     isValid: false
      //   }
      // });
    }
  } catch (error) {
    // console.error('Error verifying drone data:', error);
    // return res.status(500).json({ 
    //   success: false, 
    //   message: error.message,
    //   details: error.stack
    // });
  }
});


export default router;
