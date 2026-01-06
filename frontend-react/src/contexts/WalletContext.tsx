import React, { useEffect, useState, createContext, useContext } from 'react';
import { Transaction } from '../types';
import { walletService } from '../services/wallet.service';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number) => Promise<void>;
  purchase: (amount: number, description: string) => Promise<boolean>;
  isLoading: boolean;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWallet = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const wallet = await walletService.getWallet();
      setBalance(wallet.balance);
      const txns = await walletService.getTransactions();
      setTransactions(txns);
    } catch (err) {
      console.error('Failed to refresh wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshWallet();
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [user]);

  const deposit = async (amount: number) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // This will be handled by Stripe checkout flow
      // For now, just refresh wallet after deposit
      await refreshWallet();
    } catch (err) {
      console.error('Deposit error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const purchase = async (amount: number, description: string): Promise<boolean> => {
    if (!user) return false;
    if (balance < amount) return false;
    setIsLoading(true);
    try {
      // Purchase is handled by lottery service
      // Just refresh wallet after purchase
      await refreshWallet();
      return true;
    } catch (err) {
      console.error('Purchase error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return <WalletContext.Provider value={{
    balance,
    transactions,
    deposit,
    purchase,
    isLoading,
    refreshWallet
  }}>
      {children}
    </WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

