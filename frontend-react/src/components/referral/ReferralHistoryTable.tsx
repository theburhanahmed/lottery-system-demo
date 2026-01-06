import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Referral } from '../../services/referral.service';

interface ReferralHistoryTableProps {
  referrals: Referral[];
}

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'warning' as const,
    icon: Clock
  },
  active: {
    label: 'Active',
    variant: 'default' as const,
    icon: AlertCircle
  },
  completed: {
    label: 'Completed',
    variant: 'success' as const,
    icon: CheckCircle2
  },
  expired: {
    label: 'Expired',
    variant: 'secondary' as const,
    icon: XCircle
  }
};

export function ReferralHistoryTable({ referrals }: ReferralHistoryTableProps) {
  if (referrals.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No referrals yet</p>
            <p className="text-sm text-slate-400 mt-2">
              Share your referral code to start earning bonuses
            </p>
          </div>
        </CardContent>
      </Card>;
  }

  return <Card>
      <CardHeader>
        <CardTitle>Referral History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referrals.map(referral => {
                const config = statusConfig[referral.status];
                const Icon = config.icon;
                return (
                  <tr key={referral.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {referral.referredUserName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {referral.referredUserEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={config.variant} className="inline-flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-brand-gold-600 tabular-nums">
                        ${referral.bonusAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(referral.expiryDate).toLocaleDateString()}
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

