import React, { useState, useEffect, createContext, useContext } from 'react';
import { Lottery, Ticket } from '../types';
import { lotteryService } from '../services/lottery.service';
import { useWallet } from './WalletContext';
import { useAuth } from './AuthContext';

interface LotteryContextType {
  lotteries: Lottery[];
  tickets: Ticket[];
  createLottery: (data: Omit<Lottery, 'id' | 'ticketsSold' | 'status' | 'organizationId'>) => Promise<void>;
  purchaseTickets: (lotteryId: string, quantity: number) => Promise<boolean>;
  getLottery: (id: string) => Lottery | undefined;
  getUserTickets: () => Ticket[];
  refreshLotteries: () => Promise<void>;
  isLoading: boolean;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

export function LotteryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { purchase: walletPurchase, refreshWallet } = useWallet();
  const { user } = useAuth();

  const refreshLotteries = async () => {
    setIsLoading(true);
    try {
      const data = await lotteryService.getLotteries();
      setLotteries(data);
    } catch (err) {
      console.error('Failed to refresh lotteries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLotteries();
  }, []);

  const createLottery = async (data: Omit<Lottery, 'id' | 'ticketsSold' | 'status' | 'organizationId'>) => {
    if (!user || user.role !== 'org_admin') return;
    setIsLoading(true);
    try {
      await lotteryService.createLottery({
        name: data.name,
        description: data.description,
        ticketPrice: data.ticketPrice,
        totalTickets: data.totalTickets,
        prizePool: data.prizePool,
        drawDate: data.drawDate,
      });
      await refreshLotteries();
    } catch (err) {
      console.error('Failed to create lottery:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseTickets = async (lotteryId: string, quantity: number): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    try {
      await lotteryService.purchaseTickets({ lotteryId, quantity });
      await refreshWallet();
      await refreshLotteries();
      // Refresh user tickets
      const userTickets = await lotteryService.getMyTickets(lotteryId);
      setTickets(prev => [...prev, ...userTickets]);
      return true;
    } catch (err) {
      console.error('Failed to purchase tickets:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getLottery = (id: string) => lotteries.find(l => l.id === id);

  const getUserTickets = () => {
    if (!user) return [];
    return tickets.filter(t => t.userId === user.id);
  };

  return <LotteryContext.Provider value={{
    lotteries,
    tickets,
    createLottery,
    purchaseTickets,
    getLottery,
    getUserTickets,
    refreshLotteries,
    isLoading
  }}>
      {children}
    </LotteryContext.Provider>;
}

export function useLottery() {
  const context = useContext(LotteryContext);
  if (context === undefined) {
    throw new Error('useLottery must be used within a LotteryProvider');
  }
  return context;
}

