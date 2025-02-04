// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EmissionsTracker {
    // Maps IPFS hash => verifier address
    mapping(string => address) public hashToVerifier;
    // Maps verifier address => IPFS hash
    mapping(address => string) public verifierToHash;

    // Event to track IPFS hash storage
    event HashStored(string indexed ipfsHash, address indexed verifier);

    /**
     * @dev Store an IPFS hash and link it to the sender's address.
     * @param _ipfsHash The IPFS hash of the JSON file.
     */
    function storeHash(string calldata _ipfsHash) external {
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        hashToVerifier[_ipfsHash] = msg.sender;
        verifierToHash[msg.sender] = _ipfsHash;
        emit HashStored(_ipfsHash, msg.sender);
    }

    /**
     * @dev Retrieve the verifier address for a given IPFS hash.
     * @param _ipfsHash The IPFS hash to query.
     */
    function getVerifier(string calldata _ipfsHash) external view returns (address) {
        return hashToVerifier[_ipfsHash];
    }

    /**
     * @dev Retrieve the IPFS hash for a given verifier address.
     * @param _verifier The verifier address to query.
     */
    function getHash(address _verifier) external view returns (string memory) {
        return verifierToHash[_verifier];
    }
}