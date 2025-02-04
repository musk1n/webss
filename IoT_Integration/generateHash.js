const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
require("dotenv").config();

// Load Pinata API keys from .env
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function uploadToPinata() {
  try {
    // Read the JSON file
    const filePath = "./emissions.json";
    const readableStream = fs.createReadStream(filePath);

    // Upload to Pinata
    const options = {
      pinataMetadata: {
        name: "EmissionsData",
      },
      pinataOptions: {
        cidVersion: 0, // Use CIDv0 for compatibility
      },
    };

    const result = await pinata.pinFileToIPFS(readableStream, options);
    console.log("File uploaded to IPFS!");
    console.log("IPFS Hash:", result.IpfsHash);

    return result.IpfsHash; // Return the IPFS hash
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
  }
}

uploadToPinata();