// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "zk_snarks/contracts/ElectroCred.sol";

contract ElectroCred is ERC20 {
    address public owner;
    mapping(uint256 => string) public tokenRegions;  // Token ID => Region

    constructor(uint256 initialSupply) ERC20("ElectroCred", "ECRED") {
        owner = msg.sender;
        _mint(owner, initialSupply);  // Mint initial supply to the contract owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Mint ElectroCred tokens with a specified region
    function mint(address to, uint256 amount, string memory region) external onlyOwner {
        uint256 tokenId = totalSupply();  
        _mint(to, amount);
        tokenRegions[tokenId] = region;  // Assign region to the token
    }

    // Transfer ElectroCred tokens with region information
    function transferWithRegion(address recipient, uint256 amount, string memory region) public returns (bool) {
        uint256 tokenId = totalSupply();  
        _transfer(msg.sender, recipient, amount);
        tokenRegions[tokenId] = region;  
        return true;
    }

    // Get region associated with a token
    function getRegion(uint256 tokenId) external view returns (string memory) {
        return tokenRegions[tokenId];
    }
}
