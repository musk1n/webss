// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Governance {
    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
    }

    address public admin;
    mapping(address => uint256) public votes;
    Proposal[] public proposals;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createProposal(string memory description) external onlyAdmin {
        proposals.push(Proposal({
            description: description,
            voteCount: 0,
            executed: false
        }));
    }

    function voteOnProposal(uint256 proposalId) external {
        require(votes[msg.sender] == 0, "You have already voted");
        require(proposalId < proposals.length, "Invalid proposal");

        Proposal storage proposal = proposals[proposalId];
        proposal.voteCount += 1;
        votes[msg.sender] = proposalId;
    }

    function executeProposal(uint256 proposalId) external onlyAdmin {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        require(proposal.voteCount > 1, "Insufficient votes");

        proposal.executed = true;
        // Add logic to execute the proposal's action (e.g., modify the system)
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }
}