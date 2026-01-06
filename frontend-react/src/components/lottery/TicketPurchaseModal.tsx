import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Lottery } from '../../types';
import { useWallet } from '../../contexts/WalletContext';
import { useLottery } from '../../contexts/LotteryContext';
import { AlertCircle, CheckCircle2, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lottery: Lottery;
}

export function TicketPurchaseModal({ isOpen, onClose, lottery }: TicketPurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [error, setError] = useState<string | null>(null);
  const { balance } = useWallet();
  const { purchaseTickets } = useLottery();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = quantity * lottery.ticketPrice;
  const canAfford = balance >= totalCost;

  const handlePurchase = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const success = await purchaseTickets(lottery.id, quantity);
      if (success) {
        setStep('success');
      } else {
        setError('Purchase failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setQuantity(1);
    setStep('select');
    setError(null);
    onClose();
  };

  return <Modal isOpen={isOpen} onClose={reset} title={step === 'success' ? 'Purchase Successful!' : `Buy Tickets: ${lottery.name}`}>
      {step === 'select' && <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-500">Ticket Price</span>
              <span className="font-medium">${lottery.ticketPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Your Balance</span>
              <span className={`font-medium ${canAfford ? 'text-slate-900' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              How many tickets?
            </label>
            <div className="flex items-center space-x-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50">-</button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(100, quantity + 1))} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50">+</button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Cost</span>
              <span className="text-2xl font-bold text-indigo-600">${totalCost.toFixed(2)}</span>
            </div>

            {!canAfford && <div className="flex items-center p-3 mb-4 text-sm text-red-800 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Insufficient balance. Please deposit funds.</span>
              </div>}

            <div className="flex space-x-3">
              {canAfford ? (
                <Button className="w-full" onClick={() => setStep('confirm')}>
                  Review Purchase
                </Button>
              ) : (
                <Link to="/wallet" className="w-full">
                  <Button className="w-full" variant="secondary">
                    <Wallet className="mr-2 h-4 w-4" />
                    Deposit Funds
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>}

      {step === 'confirm' && <div className="space-y-6">
          <p className="text-slate-600">
            You are about to purchase <strong className="text-slate-900">{quantity} tickets</strong> for <strong className="text-slate-900">{lottery.name}</strong>.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Cost</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>New Balance</span>
              <span>${(balance - totalCost).toFixed(2)}</span>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('select')} disabled={isProcessing}>
              Back
            </Button>
            <Button className="flex-1" onClick={handlePurchase} isLoading={isProcessing}>
              Confirm Purchase
            </Button>
          </div>
        </div>}

      {step === 'success' && <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-900">Good Luck!</h3>
            <p className="text-slate-500 mt-1">
              You have successfully purchased {quantity} tickets.
            </p>
          </div>
          <Button className="w-full" onClick={reset}>
            Done
          </Button>
        </div>}
    </Modal>;
}

