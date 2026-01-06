import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { ReferralStats as Stats } from '../../services/referral.service';

interface ReferralStatsProps {
  stats: Stats;
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  const statCards = [
    {
      label: 'Total Referred',
      value: stats.totalReferred,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      label: 'Total Earned',
      value: `$${stats.totalEarned.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      label: 'Available Balance',
      value: `$${stats.availableBalance.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-brand-gold-600',
      bgColor: 'bg-brand-gold-100'
    },
    {
      label: 'Pending Bonuses',
      value: `$${stats.pendingBonuses.toFixed(2)}`,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
      const Icon = stat.icon;
      return <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {stat.value}
              </p>
            </CardContent>
          </Card>;
    })}
    </div>;
}

