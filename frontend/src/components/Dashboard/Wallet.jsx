import React from 'react';
import { WalletComponent } from '../WalletComponent';

export function Wallet() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Your Wallet</h1>
      <WalletComponent />
    </div>
  );
} 