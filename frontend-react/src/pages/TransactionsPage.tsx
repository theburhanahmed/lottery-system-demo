import React, { useMemo, useState, createElement } from 'react';
import {
  TrendingUp,
  Ticket,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpRight } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { AdapterTransaction } from '../types/adapter';
interface TransactionsPageProps {
  transactions: AdapterTransaction[];
}
const PAGE_SIZE = 6;
export function TransactionsPage({ transactions }: TransactionsPageProps) {
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const filters = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'deposit',
    label: 'Deposits'
  },
  {
    value: 'purchase',
    label: 'Purchases'
  },
  {
    value: 'winning',
    label: 'Winnings'
  },
  {
    value: 'withdrawal',
    label: 'Withdrawals'
  }];

  const typeIcon = (type: string) => {
    if (type === 'deposit') return <TrendingUp size={14} />;
    if (type === 'winning') return <Trophy size={14} />;
    if (type === 'withdrawal') return <ArrowUpRight size={14} />;
    return <Ticket size={14} />;
  };
  const typeColor = (type: string) => {
    if (type === 'deposit') return 'bg-emerald-50 text-emerald-600';
    if (type === 'winning') return 'bg-amber-50 text-amber-600';
    if (type === 'withdrawal') return 'bg-gray-100 text-gray-600';
    return 'bg-red-50 text-red-500';
  };
  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Balance After'];
    const rows = transactions.map((t) => [
    t.date,
    t.type,
    `"${t.description}"`,
    t.amount,
    t.balanceAfter]
    );
    const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.join(','))].
    join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Transactions
          </h1>
          <p className="text-gray-500 mt-1">
            Your complete transaction history
          </p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download size={16} className="mr-2" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) =>
        <button
          key={f.value}
          onClick={() => {
            setFilter(f.value);
            setPage(0);
          }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f.value ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>

            {f.label}
          </button>
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-hidden" padding={false}>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.map((tx) =>
            <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                <td className="px-6 py-4">
                  <Badge variant={tx.type as any}>
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {tx.description}
                </td>
                <td
                className={`px-6 py-4 text-sm font-bold text-right ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>

                  {tx.amount > 0 ? '+' : ''}$
                  {Math.abs(tx.amount).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-right">
                  ${tx.balanceAfter.toLocaleString()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paged.map((tx) =>
        <Card key={tx.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColor(tx.type)}`}>

                  {typeIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{tx.date}</span>
                    <Badge variant={tx.type as any}>{tx.type}</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>

                  {tx.amount > 0 ? '+' : ''}$
                  {Math.abs(tx.amount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  Bal: ${tx.balanceAfter.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 &&
      <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1}-
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{' '}
            {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">

              <ChevronLeft size={18} />
            </button>
            <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">

              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      }

      {filtered.length === 0 &&
      <Card className="text-center py-16 mt-4">
          <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No transactions found
          </h3>
          <p className="text-gray-500">Try adjusting your filters.</p>
        </Card>
      }

      <style>{`
        @keyframes page-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-page-in { animation: page-in 0.4s ease-out; }
      `}</style>
    </div>);

}