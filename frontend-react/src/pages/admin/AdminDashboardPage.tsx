import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Ticket,
  Users,
  DollarSign,
  Plus,
  Eye,
  Shield,
  PlayCircle } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import type { AdapterLottery, AdapterTransaction } from '../../types/adapter';
interface AdminDashboardPageProps {
  lotteries: AdapterLottery[];
  transactions: AdapterTransaction[];
  onRunDraw: (id: string) => void;
}
export function AdminDashboardPage({
  lotteries,
  transactions,
  onRunDraw
}: AdminDashboardPageProps) {
  const [selectedLottery, setSelectedLottery] = useState<AdapterLottery | null>(null);
  const totalRevenue = transactions.
  filter((t) => t.type === 'purchase').
  reduce((s, t) => s + Math.abs(t.amount), 0);
  const activeLotteries = lotteries.filter((l) => l.status === 'active').length;
  const totalTicketsSold = lotteries.reduce((s, l) => s + l.ticketsSold, 0);
  const stats = [
  {
    icon: DollarSign,
    label: 'Total Revenue',
    value: `$${totalRevenue.toLocaleString()}`,
    color: 'text-emerald-600 bg-emerald-50'
  },
  {
    icon: Ticket,
    label: 'Active Lotteries',
    value: activeLotteries.toString(),
    color: 'text-blue-600 bg-blue-50'
  },
  {
    icon: Users,
    label: 'Total Tickets Sold',
    value: totalTicketsSold.toLocaleString(),
    color: 'text-purple-600 bg-purple-50'
  },
  {
    icon: BarChart3,
    label: 'Total Lotteries',
    value: lotteries.length.toString(),
    color: 'text-amber-600 bg-amber-50'
  }];

  const handleRunDraw = () => {
    if (selectedLottery) {
      onRunDraw(selectedLottery.id);
      setSelectedLottery(null);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Dashboard
          </h1>
        </div>
        <Link to="/admin/create">
          <Button variant="primary" size="lg">
            <Plus size={18} /> Create New Lottery
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) =>
        <Card key={stat.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>

                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Lotteries Table */}
      <Card padding={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">All Lotteries</h2>
          <Link to="/admin/create">
            <Button variant="ghost" size="sm">
              <Plus size={14} /> New
            </Button>
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Tickets
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Prize Pool
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Draw Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lotteries.map((l) =>
              <tr
                key={l.id}
                className="hover:bg-gray-50/50 transition-colors">

                  <td className="px-6 py-4 font-medium text-gray-900 text-sm">
                    {l.title}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={l.status}>{l.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {l.ticketsSold}/{l.totalTickets}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-600">
                    ${l.prizeAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(l.drawDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                    to={`/lottery/${l.id}`}
                    className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded"
                    title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    {l.status === 'active' &&
                  <button
                    onClick={() => setSelectedLottery(l)}
                    className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                    title="Run Draw">

                        <PlayCircle size={16} />
                      </button>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden p-4 space-y-3">
          {lotteries.map((l) =>
          <div key={l.id} className="block p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm">{l.title}</h3>
                <Badge variant={l.status}>{l.status}</Badge>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <span>
                  {l.ticketsSold}/{l.totalTickets} tickets
                </span>
                <span className="font-bold text-amber-600">
                  ${l.prizeAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Link to={`/lottery/${l.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                {l.status === 'active' &&
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedLottery(l)}>

                    Run Draw
                  </Button>
              }
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 text-center">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            ← Back to User View
          </Button>
        </Link>
      </div>

      <Modal
        isOpen={!!selectedLottery}
        onClose={() => setSelectedLottery(null)}
        title="Run Lottery Draw">

        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to run the draw for{' '}
            <strong>{selectedLottery?.title}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            This will generate random winning numbers, determine winners,
            distribute prizes, and mark the lottery as completed. This action
            cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setSelectedLottery(null)}>

              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleRunDraw}>

              Confirm Draw
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        @keyframes page-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-page-in { animation: page-in 0.4s ease-out; }
      `}</style>
    </div>);

}