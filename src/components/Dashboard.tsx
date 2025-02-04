import React, { useState, useEffect } from 'react';
import { LineChart, Battery, Zap, Coins, ArrowLeftRight, TrendingUp } from 'lucide-react';
import { getSmartMeterData } from '../utils/mockIoT';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { ethers } from 'ethers';

interface DashboardProps {
  account: string;
}

interface CarbonCreditListing {
  seller: string;
  amount: number;
  price: number;
  id: string;
}

interface EnergyListing {
  seller: string;
  amount: number;
  price: number;
}

const Dashboard: React.FC<DashboardProps> = ({ account }) => {
  const [meterData, setMeterData] = useState({
    consumption: 0,
    generation: 0,
    carbonCredits: 0
  });

  const [creditAmount, setCreditAmount] = useState('');
  const [creditPrice, setCreditPrice] = useState('');
  const [availableCredits, setAvailableCredits] = useState<CarbonCreditListing[]>([]);

  // Energy trading state
  const [energyAmount, setEnergyAmount] = useState('');
  const [energyPrice, setEnergyPrice] = useState('');
  const [availableEnergy, setAvailableEnergy] = useState<EnergyListing[]>([]);

  useEffect(() => {
    const updateMeterData = () => {
      const data = getSmartMeterData();
      setMeterData(prev => ({
        ...prev,
        consumption: data.consumption,
        generation: data.generation
      }));
    };

    updateMeterData();
    const interval = setInterval(updateMeterData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Load carbon credits balance
      const credits = await contract.carbonCredits(account);
      setMeterData(prev => ({ ...prev, carbonCredits: Number(credits) }));

      // Load available carbon credit listings
      const listings = [];
      const nextListingId = await contract.nextCreditListingId();
      
      for (let i = 0; i < nextListingId; i++) {
        const listing = await contract.getCarbonCreditListing(i);
        if (listing.isAvailable) {
          listings.push({
            id: i.toString(),
            seller: listing.seller,
            amount: Number(listing.amount),
            price: Number(ethers.formatEther(listing.price))
          });
        }
      }
      setAvailableCredits(listings);

      // Load energy listings
      const energyListings = [];
      // Add energy listing loading logic here when implemented in the contract
      setAvailableEnergy(energyListings);

    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  };

  const handleListCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const amount = ethers.parseUnits(creditAmount, 0);
      const price = ethers.parseEther(creditPrice);

      const tx = await contract.listCarbonCredits(amount, price);
      await tx.wait();

      // Reload data
      loadBlockchainData();
      
      // Reset form
      setCreditAmount('');
      setCreditPrice('');
    } catch (error) {
      console.error('Error listing credits:', error);
      alert('Error listing credits. Please check the console for details.');
    }
  };

  const handleBuyCredits = async (listing: CarbonCreditListing) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const totalPrice = ethers.parseEther((listing.price * listing.amount).toString());
      const tx = await contract.purchaseCarbonCredits(listing.id, { value: totalPrice });
      await tx.wait();

      // Reload data
      loadBlockchainData();
    } catch (error) {
      console.error('Error buying credits:', error);
      alert('Error buying credits. Please check the console for details.');
    }
  };

  const handleListEnergy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const amount = ethers.parseUnits(energyAmount, 0);
      const price = ethers.parseEther(energyPrice);

      const tx = await contract.listEnergy(amount, price);
      await tx.wait();

      // Reload data
      loadBlockchainData();
      
      // Reset form
      setEnergyAmount('');
      setEnergyPrice('');
    } catch (error) {
      console.error('Error listing energy:', error);
      alert('Error listing energy. Please check the console for details.');
    }
  };

  const handleBuyEnergy = async (seller: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const listing = await contract.energyListings(seller);
      const tx = await contract.purchaseEnergy(seller, { value: listing.price });
      await tx.wait();

      // Reload data
      loadBlockchainData();
    } catch (error) {
      console.error('Error buying energy:', error);
      alert('Error buying energy. Please check the console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Energy Dashboard</h1>
          <p className="text-gray-600">Connected Account: {account}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Battery className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Current Generation</h2>
            </div>
            <p className="text-3xl font-bold text-green-500">{meterData.generation} kWh</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Consumption</h2>
            </div>
            <p className="text-3xl font-bold text-blue-500">{meterData.consumption} kWh</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <Coins className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold">Carbon Credits</h2>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{meterData.carbonCredits}</p>
          </div>
        </div>

        {/* Carbon Credit Trading Platform */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <ArrowLeftRight className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-2xl font-bold">Carbon Credit Trading</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* List Carbon Credits */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-xl font-semibold">List Carbon Credits</h3>
              </div>
              <form onSubmit={handleListCredits} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount of Credits
                  </label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Credit (ETH)
                  </label>
                  <input
                    type="number"
                    value={creditPrice}
                    onChange={(e) => setCreditPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter price in ETH"
                    step="0.001"
                    min="0"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  List Credits
                </button>
              </form>
            </div>

            {/* Available Carbon Credits */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Coins className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="text-xl font-semibold">Available Carbon Credits</h3>
              </div>
              <div className="space-y-4">
                {availableCredits.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Seller: {listing.seller}</span>
                      <span className="text-sm font-medium text-purple-600">
                        {listing.price} ETH/credit
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{listing.amount} Credits Available</span>
                      <button
                        onClick={() => handleBuyCredits(listing)}
                        className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Buy Credits
                      </button>
                    </div>
                  </div>
                ))}
                {availableCredits.length === 0 && (
                  <p className="text-gray-500 text-center">No carbon credits available for purchase</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Energy Trading Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <LineChart className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold">Energy Trading</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">List Energy for Sale</h3>
              <form onSubmit={handleListEnergy} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (kWh)
                  </label>
                  <input
                    type="number"
                    value={energyAmount}
                    onChange={(e) => setEnergyAmount(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    value={energyPrice}
                    onChange={(e) => setEnergyPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter price in ETH"
                    step="0.001"
                    min="0"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  List Energy
                </button>
              </form>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Available Energy</h3>
              <div className="space-y-4">
                {availableEnergy.map((listing, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Seller: {listing.seller}</span>
                      <span className="text-sm font-medium text-purple-600">
                        {listing.price} ETH
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{listing.amount} kWh Available</span>
                      <button
                        onClick={() => handleBuyEnergy(listing.seller)}
                        className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Buy Energy
                      </button>
                    </div>
                  </div>
                ))}
                {availableEnergy.length === 0 && (
                  <p className="text-gray-500 text-center">No energy listings available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;