import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { WithdrawalModal } from '../components/wallet/WithdrawalModal';
import { WithdrawalHistory } from '../components/wallet/WithdrawalHistory';
import { Modal } from '../components/ui/Modal';
import { Wallet, Plus, CreditCard, ArrowDownToLine } from 'lucide-react';
import { walletService, WithdrawalResponse } from '../services/wallet.service';

export function WalletPage() {
  const { balance, transactions, deposit, isLoading } = useWallet();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawals, setWithdrawals] = useState<WithdrawalResponse[]>([]);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(false);

  // Fetch withdrawals on mount
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setIsLoadingWithdrawals(true);
    try {
      const data = await walletService.getWithdrawals();
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setIsLoadingWithdrawals(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      await deposit(amount);
      setIsDepositModalOpen(false);
      setDepositAmount('');
    }
  };

  const handleWithdrawalSuccess = () => {
    fetchWithdrawals();
  };

  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">My Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-brand-slate-900 to-brand-slate-800 text-white border border-brand-gold-500/20 shadow-glow-gold">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 font-medium mb-1">Total Balance</p>
                <h2 className="text-4xl font-bold tabular-nums">
                  ${balance.toFixed(2)}
                </h2>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <Wallet className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setIsDepositModalOpen(true)} className="bg-brand-gold-500 hover:bg-brand-gold-400 text-white border-none shadow-lg hover:shadow-glow-gold">
                <Plus className="mr-2 h-4 w-4" />
                Deposit Funds
              </Button>
              <Button onClick={() => setIsWithdrawalModalOpen(true)} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card className="flex flex-col justify-center items-center text-center p-6">
          <div className="w-12 h-12 bg-brand-gold-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-brand-gold-600" />
          </div>
          <h3 className="font-medium text-slate-900">Secure Payments</h3>
          <p className="text-sm text-slate-500 mt-2">
            Your funds are held securely. Deposits are instant and withdrawals are processed within 1-3 business days.
          </p>
        </Card>
      </div>

      {/* Withdrawal History */}
      <WithdrawalHistory withdrawals={withdrawals} />

      {/* Transaction History */}
      <TransactionHistory transactions={transactions} />

      {/* Deposit Modal */}
      <Modal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} title="Deposit Funds">
        <form onSubmit={handleDeposit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Amount to Deposit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <Input type="number" min="5" step="1" placeholder="0.00" className="pl-8" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} required autoFocus />
            </div>
            <p className="text-xs text-slate-500">Minimum deposit is $5.00</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[10, 25, 50, 100].map(amt => (
              <button key={amt} type="button" onClick={() => setDepositAmount(amt.toString())} className="py-2 px-3 text-sm font-medium border-2 border-slate-200 rounded-md hover:bg-brand-gold-50 hover:border-brand-gold-500 hover:text-brand-gold-700 transition-all">
                ${amt}
              </button>
            ))}
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Confirm Deposit
          </Button>

          <p className="text-xs text-center text-slate-500">
            Payments are processed securely via Stripe
          </p>
        </form>
      </Modal>

      {/* Withdrawal Modal */}
      <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} onSuccess={handleWithdrawalSuccess} />
    </div>;
}

