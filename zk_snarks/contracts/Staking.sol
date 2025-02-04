// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "zk_snarks/contracts/Staking.sol";

contract Staking {
    ERC20 public carboCredToken;
    ERC20 public electroCredToken;
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public stakingRewards;

    constructor(address _carboCredToken, address _electroCredToken) {
        carboCredToken = ERC20(_carboCredToken);
        electroCredToken = ERC20(_electroCredToken);
    }

    function stake(uint256 amount, bool isCarboCred) external {
        require(amount > 0, "Amount must be greater than zero");

        if (isCarboCred) {
            require(carboCredToken.transferFrom(msg.sender, address(this), amount), "Stake failed");
            stakes[msg.sender] += amount;
        } else {
            require(electroCredToken.transferFrom(msg.sender, address(this), amount), "Stake failed");
            stakes[msg.sender] += amount;
        }
    }

    function unstake(uint256 amount, bool isCarboCred) external {
        require(stakes[msg.sender] >= amount, "Insufficient stake");

        if (isCarboCred) {
            require(carboCredToken.transfer(msg.sender, amount), "Unstake failed");
            stakes[msg.sender] -= amount;
        } else {
            require(electroCredToken.transfer(msg.sender, amount), "Unstake failed");
            stakes[msg.sender] -= amount;
        }
    }

    function claimReward() external {
        uint256 reward = stakingRewards[msg.sender];
        require(reward > 0, "No rewards available");

        stakingRewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);
    }

    // Additional logic for distributing rewards can be added
}