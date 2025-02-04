import React from 'react';
import { WalletIcon } from 'lucide-react';

interface MetaMaskConnectProps {
  onConnect: (account: string) => void;
}

const MetaMaskConnect: React.FC<MetaMaskConnectProps> = ({ onConnect }) => {
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        onConnect(accounts[0]);
      } else {
        alert('Please install MetaMask to use this application');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="text-center">
          <WalletIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to EnergyGrid</h1>
          <p className="text-gray-600 mb-6">Connect your wallet to start trading renewable energy</p>
          <button
            onClick={connectWallet}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Connect MetaMask
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskConnect;