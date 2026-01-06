import React from 'react';
import { Transaction } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ArrowDownLeft, ArrowUpRight, Ticket, Trophy } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'purchase':
        return <Ticket className="h-4 w-4 text-indigo-600" />;
      case 'winnings':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-slate-500" />;
    }
  };

  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
      case 'winnings':
      case 'referral':
        return 'text-green-600';
      default:
        return 'text-slate-900';
    }
  };

  return <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions.map(txn => (
                  <tr key={txn.id} className="bg-white border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={cn('p-2 rounded-full bg-slate-100', txn.type === 'deposit' && 'bg-green-100', txn.type === 'purchase' && 'bg-indigo-100', txn.type === 'winnings' && 'bg-amber-100')}>
                          {getIcon(txn.type)}
                        </div>
                        <span className="capitalize font-medium text-slate-700">
                          {txn.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {txn.description}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className={cn('px-6 py-4 text-right font-medium', getAmountColor(txn.type))}>
                      {txn.amount > 0 ? '+' : ''}
                      {txn.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>;
}

