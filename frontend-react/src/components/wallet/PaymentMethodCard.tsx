import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CreditCard, Building2, Trash2, Check } from 'lucide-react';
import { PaymentMethod } from '../../services/stripe.service';
import { cn } from '../../utils/cn';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetPrimary: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function PaymentMethodCard({ paymentMethod, onSetPrimary, onDelete, isLoading }: PaymentMethodCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(paymentMethod.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return <Card className={cn('transition-all', paymentMethod.isPrimary && 'ring-2 ring-brand-gold-500')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', paymentMethod.type === 'card' ? 'bg-indigo-100' : 'bg-emerald-100')}>
              {paymentMethod.type === 'card' ? (
                <CreditCard className={cn('h-5 w-5', paymentMethod.type === 'card' ? 'text-indigo-600' : 'text-emerald-600')} />
              ) : (
                <Building2 className="h-5 w-5 text-emerald-600" />
              )}
            </div>

            <div>
              {paymentMethod.card && (
                <>
                  <div className="font-medium text-slate-900 capitalize">
                    {paymentMethod.card.brand} •••• {paymentMethod.card.last4}
                  </div>
                  <div className="text-sm text-slate-500">
                    Expires {paymentMethod.card.expMonth}/{paymentMethod.card.expYear}
                  </div>
                </>
              )}
              {paymentMethod.bankAccount && (
                <>
                  <div className="font-medium text-slate-900">
                    {paymentMethod.bankAccount.bankName}
                  </div>
                  <div className="text-sm text-slate-500">
                    •••• {paymentMethod.bankAccount.last4}
                  </div>
                </>
              )}
              {paymentMethod.isPrimary && (
                <Badge variant="default" className="mt-2">
                  <Check className="h-3 w-3 mr-1" />
                  Primary
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {!paymentMethod.isPrimary && (
              <Button variant="ghost" size="sm" onClick={() => onSetPrimary(paymentMethod.id)} disabled={isLoading}>
                Set Primary
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isLoading} className={cn(showDeleteConfirm && 'bg-red-50 text-red-600 hover:bg-red-100')}>
              <Trash2 className="h-4 w-4" />
              {showDeleteConfirm && <span className="ml-1">Confirm?</span>}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
}

