import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AlertCircle, Building2, Mail, Coins } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { walletService } from '../../services/wallet.service';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type WithdrawalMethod = 'bank_transfer' | 'paypal' | 'crypto';
const MINIMUM_WITHDRAWAL = 10;

export function WithdrawalModal({ isOpen, onClose, onSuccess }: WithdrawalModalProps) {
  const { balance } = useWallet();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<WithdrawalMethod>('bank_transfer');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    paypalEmail: '',
    cryptoAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numAmount = parseFloat(amount) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (numAmount < MINIMUM_WITHDRAWAL) {
      setError(`Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL}`);
      return;
    }
    if (numAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    // Validate account details based on method
    if (method === 'bank_transfer' && (!accountDetails.accountNumber || !accountDetails.routingNumber)) {
      setError('Please provide account and routing numbers');
      return;
    }
    if (method === 'paypal' && !accountDetails.paypalEmail) {
      setError('Please provide PayPal email');
      return;
    }
    if (method === 'crypto' && !accountDetails.cryptoAddress) {
      setError('Please provide crypto wallet address');
      return;
    }

    setIsLoading(true);
    try {
      await walletService.requestWithdrawal({
        amount: numAmount,
        withdrawalMethod: method,
        accountDetails
      });
      onSuccess();
      onClose();
      // Reset form
      setAmount('');
      setAccountDetails({
        accountNumber: '',
        routingNumber: '',
        paypalEmail: '',
        cryptoAddress: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to request withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  const methods = [
    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
    { id: 'paypal', label: 'PayPal', icon: Mail },
    { id: 'crypto', label: 'Cryptocurrency', icon: Coins }
  ];

  return <Modal isOpen={isOpen} onClose={onClose} title="Request Withdrawal">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Available Balance */}
        <div className="bg-gradient-to-br from-brand-gold-50 to-brand-gold-100 p-4 rounded-lg border border-brand-gold-200">
          <div className="text-sm text-brand-gold-900 mb-1">
            Available Balance
          </div>
          <div className="text-3xl font-bold text-brand-gold-900 tabular-nums">
            ${balance.toFixed(2)}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <Input
            label="Withdrawal Amount"
            type="number"
            min={MINIMUM_WITHDRAWAL}
            max={balance}
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            helperText={`Minimum: $${MINIMUM_WITHDRAWAL} | Maximum: $${balance.toFixed(2)}`}
            required
            autoFocus
          />
        </div>

        {/* Withdrawal Method Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Withdrawal Method
          </label>
          <div className="grid grid-cols-1 gap-2">
            {methods.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as WithdrawalMethod)}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                    method === m.id
                      ? 'border-brand-gold-500 bg-brand-gold-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${method === m.id ? 'text-brand-gold-600' : 'text-slate-400'}`} />
                  <span className={`font-medium ${method === m.id ? 'text-brand-gold-900' : 'text-slate-700'}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Details */}
        {method === 'bank_transfer' && (
          <div className="space-y-4">
            <Input
              label="Account Number"
              type="text"
              placeholder="Enter account number"
              value={accountDetails.accountNumber}
              onChange={e => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
              required
            />
            <Input
              label="Routing Number"
              type="text"
              placeholder="Enter routing number"
              value={accountDetails.routingNumber}
              onChange={e => setAccountDetails({ ...accountDetails, routingNumber: e.target.value })}
              required
            />
          </div>
        )}

        {method === 'paypal' && (
          <Input
            label="PayPal Email"
            type="email"
            placeholder="your@email.com"
            value={accountDetails.paypalEmail}
            onChange={e => setAccountDetails({ ...accountDetails, paypalEmail: e.target.value })}
            required
          />
        )}

        {method === 'crypto' && (
          <Input
            label="Crypto Wallet Address"
            type="text"
            placeholder="Enter wallet address"
            value={accountDetails.cryptoAddress}
            onChange={e => setAccountDetails({ ...accountDetails, cryptoAddress: e.target.value })}
            required
          />
        )}

        {/* Summary */}
        {numAmount > 0 && (
          <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Withdrawal Amount</span>
              <span className="font-medium text-slate-900 tabular-nums">
                ${numAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">New Balance</span>
              <span className="font-medium text-slate-900 tabular-nums">
                ${(balance - numAmount).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
          <strong>Note:</strong> Withdrawal requests are reviewed by our team and typically processed within 1-3 business days. You'll receive an email notification once your withdrawal is approved.
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            Request Withdrawal
          </Button>
        </div>
      </form>
    </Modal>;
}

