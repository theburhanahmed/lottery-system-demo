import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CreditCard,
  Building2,
  Bitcoin,
  TrendingUp,
  Trophy,
  Ticket,
  ArrowDownLeft,
  ArrowUpRight } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { AdapterUser, AdapterTransaction } from '../types/adapter';
interface WalletPageProps {
  user: AdapterUser;
  transactions: AdapterTransaction[];
  onAddFunds: (amount: number, method: string) => void;
  onWithdraw: (amount: number, method: string) => void;
}
export function WalletPage({
  user,
  transactions,
  onAddFunds,
  onWithdraw
}: WalletPageProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const presets = [50, 100, 500, 1000];
  const methods = [
  {
    value: 'Credit Card',
    icon: CreditCard
  },
  {
    value: 'Bank Transfer',
    icon: Building2
  },
  {
    value: 'Crypto',
    icon: Bitcoin
  }];

  const recentTx = transactions.slice(0, 5);
  const handleAction = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    setLoading(true);
    setTimeout(() => {
      if (activeTab === 'deposit') {
        onAddFunds(val, method);
      } else {
        onWithdraw(val, method);
      }
      setAmount('');
      setLoading(false);
    }, 600);
  };
  const typeIcon = (type: string) => {
    if (type === 'deposit') return <TrendingUp size={14} />;
    if (type === 'winning') return <Trophy size={14} />;
    if (type === 'withdrawal') return <ArrowUpRight size={14} />;
    return <Ticket size={14} />;
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Wallet
        </h1>
        <p className="text-gray-500 mt-1">Manage your funds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-emerald-100 text-sm">Available Balance</p>
                <p className="text-3xl font-extrabold">
                  ${user.walletBalance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-emerald-200">Total Deposited</p>
                <p className="font-bold text-lg">
                  $
                  {transactions.
                  filter((t) => t.type === 'deposit').
                  reduce((s, t) => s + t.amount, 0).
                  toLocaleString()}
                </p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-emerald-200">Total Won</p>
                <p className="font-bold text-lg">
                  $
                  {transactions.
                  filter((t) => t.type === 'winning').
                  reduce((s, t) => s + t.amount, 0).
                  toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <Card className="lg:col-span-2">
          <div className="flex border-b border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'deposit' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

              <span className="flex items-center justify-center gap-2">
                <ArrowDownLeft size={18} /> Deposit Funds
              </span>
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'withdraw' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

              <span className="flex items-center justify-center gap-2">
                <ArrowUpRight size={18} /> Withdraw Funds
              </span>
            </button>
          </div>

          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {presets.map((p) =>
            <button
              key={p}
              onClick={() => setAmount(p.toString())}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${amount === p.toString() ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>

                ${p}
              </button>
            )}
          </div>

          {/* Custom amount */}
          <Input
            label={
            activeTab === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'
            }
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder="Enter amount"
            icon={<span className="text-gray-400 font-medium">$</span>} />

          {activeTab === 'withdraw' &&
          amount &&
          parseFloat(amount) > user.walletBalance &&
          <p className="text-sm text-red-500 mt-1">
                Amount exceeds your available balance of $
                {user.walletBalance.toLocaleString()}
              </p>
          }

          {/* Payment method */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeTab === 'deposit' ? 'Payment Method' : 'Withdraw To'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {methods.map((m) =>
              <button
                key={m.value}
                onClick={() => setMethod(m.value)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${method === m.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>

                  <m.icon size={18} />
                  {m.value}
                </button>
              )}
            </div>
          </div>

          <Button
            variant={activeTab === 'deposit' ? 'primary' : 'secondary'}
            size="lg"
            className="w-full mt-6"
            onClick={handleAction}
            loading={loading}
            disabled={
            !amount ||
            parseFloat(amount) <= 0 ||
            activeTab === 'withdraw' &&
            parseFloat(amount) > user.walletBalance
            }>

            {activeTab === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
          </Button>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Transactions</h2>
          <Link to="/transactions">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentTx.map((tx) =>
          <div key={tx.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : tx.type === 'winning' ? 'bg-amber-50 text-amber-600' : tx.type === 'withdrawal' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-500'}`}>

                  {typeIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.description}
                  </p>
                  <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
              </div>
              <span
              className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>

                {tx.amount > 0 ? '+' : ''}$
                {Math.abs(tx.amount).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </Card>

      <style>{`
        @keyframes page-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-page-in { animation: page-in 0.4s ease-out; }
      `}</style>
    </div>);

}