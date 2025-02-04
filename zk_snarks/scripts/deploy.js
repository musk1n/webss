const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("Lock.sol");
  const token = await Token.deploy();

  await token.deployed();

  console.log(`Contract deployed to: ${token.address}`);
}

// Run the function
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
