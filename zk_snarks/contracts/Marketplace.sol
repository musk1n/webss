// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "zk_snarks/contracts/Marketplace.sol";  // Import the existing Marketplace contract

// Extend the Marketplace contract
contract ExtendedMarketplace is Marketplace {
    address public admin;
    mapping(string => uint256) public regionPollutionLevels;
    TradeOffer[] public tradeOffers;

    constructor(address _carboCredToken, address _electroCredToken) 
        Marketplace(_carboCredToken, _electroCredToken) {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function updatePollutionLevel(string memory region, uint256 pollutionLevel) external onlyAdmin {
        regionPollutionLevels[region] = pollutionLevel;
    }

    function listTrade(uint256 amount, uint256 basePrice, string memory region, bool isCarboCred) external {
        uint256 adjustedPrice = basePrice * (regionPollutionLevels[region] / 100);
        
        if (isCarboCred) {
            require(carboCredToken.balanceOf(msg.sender) >= amount, "Insufficient CarboCred balance");
        } else {
            require(electroCredToken.balanceOf(msg.sender) >= amount, "Insufficient ElectroCred balance");
        }

        tradeOffers.push(TradeOffer({
            seller: msg.sender,
            amount: amount,
            pricePerUnit: adjustedPrice,
            region: region,
            isCarboCred: isCarboCred
        }));
    }

    function buyTrade(uint256 tradeId) external payable {
        require(tradeId < tradeOffers.length, "Invalid trade ID");
        TradeOffer memory offer = tradeOffers[tradeId];

        uint256 totalPrice = offer.pricePerUnit * offer.amount;
        require(msg.value == totalPrice, "Incorrect payment amount");

        if (offer.isCarboCred) {
            carboCredToken.transferFrom(offer.seller, msg.sender, offer.amount);
        } else {
            electroCredToken.transferFrom(offer.seller, msg.sender, offer.amount);
        }

        payable(offer.seller).transfer(msg.value);
        delete tradeOffers[tradeId];
    }

    function getAllOffers() external view returns (TradeOffer[] memory) {
        return tradeOffers;
    }

    function getOffersByRegion(string memory region) external view returns (TradeOffer[] memory) {
        uint256 offerCount = 0;
        for (uint256 i = 0; i < tradeOffers.length; i++) {
            if (keccak256(bytes(tradeOffers[i].region)) == keccak256(bytes(region))) {
                offerCount++;
            }
        }

        TradeOffer[] memory regionOffers = new TradeOffer[](offerCount);
        uint256 index = 0;
        for (uint256 i = 0; i < tradeOffers.length; i++) {
            if (keccak256(bytes(tradeOffers[i].region)) == keccak256(bytes(region))) {
                regionOffers[index] = tradeOffers[i];
                index++;
            }
        }

        return regionOffers;
    }
}