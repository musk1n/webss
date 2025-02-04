const { ethers } = require("ethers");
require("dotenv").config();

// Replace with your IPFS hash
const IPFS_HASH = "our-ipfs-hash"; // Replace with the hash from Pinata

async function main() {
  // Connect to Sepolia via Alchemy
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Load contract ABI (fixed, no extra wrapping)
  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "verifier",
          "type": "address"
        }
      ],
      "name": "HashStored",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "storeHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "getVerifier",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "hashToVerifier",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Interact with contract
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
  const tx = await contract.storeHash(IPFS_HASH);
  await tx.wait();
  console.log(`Hash stored! TX: ${tx.hash}`);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});