import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { WithdrawalModal } from '../components/wallet/WithdrawalModal';
import { WithdrawalHistory } from '../components/wallet/WithdrawalHistory';
import { Modal } from '../components/ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Wallet, Plus, CreditCard, ArrowDownToLine, Smartphone, Banknote } from 'lucide-react';
import { walletService, WithdrawalResponse } from '../services/wallet.service';
import { razorpayService } from '../services/razorpay.service';

type PaymentMethodTab = 'razorpay' | 'card';

export function WalletPage() {
  const { user } = useAuth();
  const { balance, transactions, deposit, isLoading, refreshWallet } = useWallet();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentTab, setPaymentTab] = useState<PaymentMethodTab>('razorpay');
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalResponse[]>([]);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(false);
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    razorpayService.getConfig().then((c) => setRazorpayAvailable(c.available)).catch(() => setRazorpayAvailable(false));
  }, [isDepositModalOpen]);

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

  const handleRazorpayDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError(null);
    const amount = parseFloat(depositAmount);
    if (amount < 10) {
      setDepositError('Minimum deposit is ₹10');
      return;
    }
    setIsRazorpayLoading(true);
    try {
      const order = await razorpayService.createOrder(amount, 'INR');
      await razorpayService.openCheckout(order, {
        userEmail: user?.email,
        userName: user?.first_name || user?.username ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username : undefined,
        onSuccess: () => {
          refreshWallet();
          setIsDepositModalOpen(false);
          setDepositAmount('');
        },
        onDismiss: () => setIsRazorpayLoading(false),
        onError: (msg) => {
          setDepositError(msg);
          setIsRazorpayLoading(false);
        },
      });
    } catch (err: any) {
      setDepositError(err?.message || 'Failed to start payment');
      setIsRazorpayLoading(false);
    }
  };

  const handleCardDeposit = async (e: React.FormEvent) => {
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

  const quickAmounts = paymentTab === 'razorpay' ? [100, 500, 1000, 2000] : [10, 25, 50, 100];

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
      <Modal isOpen={isDepositModalOpen} onClose={() => { setIsDepositModalOpen(false); setDepositError(null); }} title="Deposit Funds">
        <Tabs value={paymentTab} onValueChange={(v) => { setPaymentTab(v as PaymentMethodTab); setDepositError(null); }}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="razorpay" disabled={!razorpayAvailable} className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              UPI / Netbanking (India)
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Card (Stripe)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="razorpay" className="mt-0">
            <form onSubmit={handleRazorpayDeposit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                  <Input type="number" min="10" step="1" placeholder="0" className="pl-8" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} required autoFocus />
                </div>
                <p className="text-xs text-slate-500">Minimum deposit is ₹10. Pay via UPI, card, netbanking or wallet.</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {quickAmounts.map(amt => (
                  <button key={amt} type="button" onClick={() => setDepositAmount(amt.toString())} className="py-2 px-3 text-sm font-medium border-2 border-slate-200 rounded-md hover:bg-brand-gold-50 hover:border-brand-gold-500 hover:text-brand-gold-700 transition-all">
                    ₹{amt}
                  </button>
                ))}
              </div>
              {depositError && <p className="text-sm text-red-600">{depositError}</p>}
              <Button type="submit" className="w-full" isLoading={isRazorpayLoading} disabled={isRazorpayLoading || !razorpayAvailable}>
                {razorpayAvailable ? 'Pay with Razorpay (UPI / Card / Netbanking)' : 'Razorpay not configured'}
              </Button>
              <p className="text-xs text-center text-slate-500">Secured by Razorpay. Supports GPay, PhonePe, Paytm, cards & netbanking.</p>
            </form>
          </TabsContent>

          <TabsContent value="card" className="mt-0">
            <form onSubmit={handleCardDeposit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input type="number" min="5" step="1" placeholder="0.00" className="pl-8" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} required />
                </div>
                <p className="text-xs text-slate-500">Minimum deposit is $5.00</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {quickAmounts.map(amt => (
                  <button key={amt} type="button" onClick={() => setDepositAmount(amt.toString())} className="py-2 px-3 text-sm font-medium border-2 border-slate-200 rounded-md hover:bg-brand-gold-50 hover:border-brand-gold-500 hover:text-brand-gold-700 transition-all">
                    ${amt}
                  </button>
                ))}
              </div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Confirm Deposit
              </Button>
              <p className="text-xs text-center text-slate-500">Payments are processed securely via Stripe.</p>
            </form>
          </TabsContent>
        </Tabs>
      </Modal>

      {/* Withdrawal Modal */}
      <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} onSuccess={handleWithdrawalSuccess} />
    </div>;
}

