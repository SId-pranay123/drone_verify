// src/services/patternValidationService.js
import DroneData from "../models/DroneData.js";

/**
 * Validates the incoming drone data against historical patterns.
 * @param {object} newData - The new drone data to validate.
 * @returns {object} - Validation result containing isValid and messages.
 */
export const validateDataPattern = async (newData) => {
  const { remoteId, latitude, longitude, speed, height } = newData;

  // Fetch recent historical data for the drone
  const historicalData = await DroneData.find({ remoteId })
    .sort({ timestamp: -1 })
    .limit(100); // Adjust the limit as needed

  if (historicalData.length === 0) {
    return {
      isValid: true,
      messages: ["Insufficient historical data for pattern validation."],
    };
  }

  // Example Pattern 1: Speed Range Validation
  const speeds = historicalData.map(data => data.speed);
  const averageSpeed = speeds.reduce((acc, curr) => acc + curr, 0) / speeds.length;
  const speedThreshold = averageSpeed * 0.5; // 50% below average
  const speedUpperThreshold = averageSpeed * 1.5; // 150% above average

  const speedValid = speed >= speedThreshold && speed <= speedUpperThreshold;

  // Example Pattern 2: Height Range Validation
  const heights = historicalData.map(data => data.height);
  const averageHeight = heights.reduce((acc, curr) => acc + curr, 0) / heights.length;
  const heightThreshold = averageHeight * 0.5;
  const heightUpperThreshold = averageHeight * 1.5;

  const heightValid = height >= heightThreshold && height <= heightUpperThreshold;

  // Example Pattern 3: Geographical Consistency
  // Check if the new data's location is within a reasonable distance from recent locations
  const recentLocation = historicalData[0]; // Most recent
  const distance = calculateDistance(latitude, longitude, recentLocation.latitude, recentLocation.longitude);
  const maxDistance = 10; // in kilometers, adjust as needed

  const locationValid = distance <= maxDistance;

  // Compile Validation Results
  const isValid = speedValid && heightValid && locationValid;
  const messages = [];

  if (!speedValid) {
    messages.push(`Speed ${speed} is outside the expected range (${speedThreshold.toFixed(2)} - ${speedUpperThreshold.toFixed(2)}).`);
  }

  if (!heightValid) {
    messages.push(`Height ${height} is outside the expected range (${heightThreshold.toFixed(2)} - ${heightUpperThreshold.toFixed(2)}).`);
  }

  if (!locationValid) {
    messages.push(`Location is ${distance.toFixed(2)} km away from the recent location, which exceeds the maximum allowed distance of ${maxDistance} km.`);
  }

  return { isValid, messages };
};

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1.
 * @param {number} lon1 - Longitude of point 1.
 * @param {number} lat2 - Latitude of point 2.
 * @param {number} lon2 - Longitude of point 2.
 * @returns {number} - Distance in kilometers.
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => degree * (Math.PI / 180);

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};
