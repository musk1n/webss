// Simulated IoT data generation
export const getSmartMeterData = () => {
  return {
    consumption: Math.floor(Math.random() * 100),
    generation: Math.floor(Math.random() * 150),
    timestamp: Date.now()
  };
};