import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { WithdrawalResponse } from '../../services/wallet.service';
import { cn } from '../../utils/cn';

interface WithdrawalHistoryProps {
  withdrawals: WithdrawalResponse[];
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'warning' as const,
    icon: Clock,
    color: 'text-amber-600'
  },
  processing: {
    label: 'Processing',
    variant: 'default' as const,
    icon: AlertCircle,
    color: 'text-indigo-600'
  },
  approved: {
    label: 'Approved',
    variant: 'success' as const,
    icon: CheckCircle2,
    color: 'text-emerald-600'
  },
  completed: {
    label: 'Completed',
    variant: 'success' as const,
    icon: CheckCircle2,
    color: 'text-emerald-600'
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive' as const,
    icon: XCircle,
    color: 'text-red-600'
  }
};

export function WithdrawalHistory({ withdrawals }: WithdrawalHistoryProps) {
  if (withdrawals.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No withdrawal requests yet</p>
          </div>
        </CardContent>
      </Card>;
  }

  return <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawals.map(withdrawal => {
                const config = statusConfig[withdrawal.status];
                const Icon = config.icon;
                return (
                  <tr key={withdrawal.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(withdrawal.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 tabular-nums">
                        ${withdrawal.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">
                      {withdrawal.withdrawalMethod.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={config.variant} className="inline-flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                      {withdrawal.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>;
}

