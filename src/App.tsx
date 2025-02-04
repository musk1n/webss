import React, { useState } from 'react';
import MetaMaskConnect from './components/MetaMaskConnect';
import Dashboard from './components/Dashboard';

function App() {
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = (connectedAccount: string) => {
    setAccount(connectedAccount);
  };

  return (
    <div>
      {!account ? (
        <MetaMaskConnect onConnect={handleConnect} />
      ) : (
        <Dashboard account={account} />
      )}
    </div>
  );
}

export default App;