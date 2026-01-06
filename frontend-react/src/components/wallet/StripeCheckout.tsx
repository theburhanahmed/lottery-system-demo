import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';

interface StripeCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': {
        color: '#94a3b8'
      }
    },
    invalid: {
      color: '#dc2626',
      iconColor: '#dc2626'
    }
  }
};

export function StripeCheckout({ amount, onSuccess, onError }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError(stripeError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // Payment method created successfully
      // The parent component will handle the actual payment intent creation
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      onError(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-slate-300 rounded-md focus-within:ring-2 focus-within:ring-brand-gold-500 focus-within:border-transparent transition-all">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Amount to deposit</span>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={isProcessing} disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : `Deposit $${amount.toFixed(2)}`}
      </Button>

      <p className="text-xs text-center text-slate-500">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>;
}

