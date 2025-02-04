// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTrading {
    struct EnergyData {
        address prosumer;
        uint256 energyAmount;
        uint256 price;
        uint256 carbonCredits;
        bool isAvailable;
    }

    struct SmartMeterData {
        uint256 consumption;
        uint256 generation;
        uint256 timestamp;
    }

    struct CarbonCreditListing {
        address seller;
        uint256 amount;
        uint256 price;
        bool isAvailable;
    }

    mapping(address => EnergyData) public energyListings;
    mapping(address => SmartMeterData[]) public meterReadings;
    mapping(address => uint256) public carbonCredits;
    mapping(uint256 => CarbonCreditListing) public carbonCreditListings;
    uint256 public nextCreditListingId;

    event EnergyListed(address indexed prosumer, uint256 amount, uint256 price);
    event EnergyPurchased(address indexed buyer, address indexed seller, uint256 amount);
    event MeterDataUpdated(address indexed prosumer, uint256 consumption, uint256 generation);
    event CarbonCreditsListed(address indexed seller, uint256 amount, uint256 price, uint256 listingId);
    event CarbonCreditsPurchased(address indexed buyer, address indexed seller, uint256 amount, uint256 listingId);

    function listEnergy(uint256 _amount, uint256 _price) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        
        energyListings[msg.sender] = EnergyData({
            prosumer: msg.sender,
            energyAmount: _amount,
            price: _price,
            carbonCredits: calculateCarbonCredits(_amount),
            isAvailable: true
        });
        
        emit EnergyListed(msg.sender, _amount, _price);
    }

    function purchaseEnergy(address _seller) public payable {
        EnergyData storage listing = energyListings[_seller];
        require(listing.isAvailable, "Energy not available");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.isAvailable = false;
        carbonCredits[msg.sender] += listing.carbonCredits;
        
        payable(_seller).transfer(msg.value);
        emit EnergyPurchased(msg.sender, _seller, listing.energyAmount);
    }

    function listCarbonCredits(uint256 _amount, uint256 _price) public {
        require(_amount > 0, "Amount must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        require(carbonCredits[msg.sender] >= _amount, "Insufficient carbon credits");

        carbonCredits[msg.sender] -= _amount;
        
        carbonCreditListings[nextCreditListingId] = CarbonCreditListing({
            seller: msg.sender,
            amount: _amount,
            price: _price,
            isAvailable: true
        });

        emit CarbonCreditsListed(msg.sender, _amount, _price, nextCreditListingId);
        nextCreditListingId++;
    }

    function purchaseCarbonCredits(uint256 _listingId) public payable {
        CarbonCreditListing storage listing = carbonCreditListings[_listingId];
        require(listing.isAvailable, "Credits not available");
        require(msg.value >= listing.price * listing.amount, "Insufficient payment");

        listing.isAvailable = false;
        carbonCredits[msg.sender] += listing.amount;
        
        payable(listing.seller).transfer(msg.value);
        emit CarbonCreditsPurchased(msg.sender, listing.seller, listing.amount, _listingId);
    }

    function updateMeterData(uint256 _consumption, uint256 _generation) public {
        meterReadings[msg.sender].push(SmartMeterData({
            consumption: _consumption,
            generation: _generation,
            timestamp: block.timestamp
        }));
        
        emit MeterDataUpdated(msg.sender, _consumption, _generation);
    }

    function calculateCarbonCredits(uint256 _energyAmount) internal pure returns (uint256) {
        // Simplified carbon credit calculation
        return _energyAmount / 100;
    }

    function getMeterReadings(address _prosumer) public view returns (SmartMeterData[] memory) {
        return meterReadings[_prosumer];
    }

    function getCarbonCreditListing(uint256 _listingId) public view returns (
        address seller,
        uint256 amount,
        uint256 price,
        bool isAvailable
    ) {
        CarbonCreditListing memory listing = carbonCreditListings[_listingId];
        return (listing.seller, listing.amount, listing.price, listing.isAvailable);
    }
}