const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Pinata API configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

async function retrieveFromIPFS(ipfsHash, outputFileName) {
  try {
    // 1. Construct IPFS gateway URL (using Pinata's dedicated gateway)
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    // 2. Make authenticated request to Pinata gateway
    const response = await axios.get(ipfsUrl, {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });

    // 3. Save to JSON file
    fs.writeFileSync(outputFileName, JSON.stringify(response.data, null, 2));
    console.log(`Data saved to ${outputFileName}`);

    return response.data;

  } catch (error) {
    console.error('Error retrieving data:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Usage
const IPFS_HASH = 'retrieved-hash-id'; // Replace with your IPFS hash
const OUTPUT_FILE = 'retrieved-data.json';

retrieveFromIPFS(IPFS_HASH, OUTPUT_FILE);