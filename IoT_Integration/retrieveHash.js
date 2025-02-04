require("dotenv").config();
const { ethers } = require("ethers");

async function retrieveHash() {
  try {
    if (!process.env.SEPOLIA_RPC_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
      throw new Error("Missing environment variables.");
    }

    // Connect to Ethereum
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractAddress = process.env.CONTRACT_ADDRESS;

    // Corrected ABI
    const contractABI = ["function getHash(address) view returns (string)"];

    // Contract instance with signer
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Use the signer's address
    const userAddress = signer.address;
    console.log("Checking stored hash for address:", userAddress);

    // Retrieve hash
    const ipfsHash = await contract.getHash(userAddress);
    console.log("Retrieved IPFS Hash:", ipfsHash);

    return ipfsHash;
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Run function
retrieveHash();