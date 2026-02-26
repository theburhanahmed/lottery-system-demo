import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Tag } from 'lucide-react';
import { LotteryCard } from '../components/LotteryCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { AdapterLottery } from '../types/adapter';
interface LotteriesPageProps {
  lotteries: AdapterLottery[];
}
export function LotteriesPage({ lotteries }: LotteriesPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('prize');
  const filtered = useMemo(() => {
    let result = lotteries.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((l) => l.category === categoryFilter);
    }
    result.sort((a, b) => {
      if (sortBy === 'prize') return b.prizeAmount - a.prizeAmount;
      if (sortBy === 'date')
      return new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime();
      if (sortBy === 'tickets')
      return a.totalTickets - a.ticketsSold - (b.totalTickets - b.ticketsSold);
      return 0;
    });
    return result;
  }, [lotteries, search, statusFilter, categoryFilter, sortBy]);
  const filters = [
  {
    value: 'all',
    label: 'All Status'
  },
  {
    value: 'active',
    label: 'Active'
  },
  {
    value: 'upcoming',
    label: 'Upcoming'
  },
  {
    value: 'completed',
    label: 'Completed'
  }];

  const categories = [
  {
    value: 'all',
    label: 'All Categories'
  },
  {
    value: 'jackpot',
    label: 'Jackpot'
  },
  {
    value: 'weekly',
    label: 'Weekly'
  },
  {
    value: 'flash',
    label: 'Flash'
  },
  {
    value: 'special',
    label: 'Special'
  }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
          Browse Lotteries
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Find your next big win
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lotteries..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white" />

        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 dark:text-white">

            <option value="prize">Prize: High to Low</option>
            <option value="date">Draw Date: Soonest</option>
            <option value="tickets">Tickets Left</option>
          </select>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="space-y-4 mb-8">
        {/* Status */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) =>
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${statusFilter === f.value ? 'bg-emerald-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'}`}>

              {f.label}
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 items-center">
          <Tag size={16} className="text-gray-400 mr-2" />
          {categories.map((c) =>
          <button
            key={c.value}
            onClick={() => setCategoryFilter(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${categoryFilter === c.value ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-transparent'}`}>

              {c.label}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lottery) =>
        <LotteryCard key={lottery.id} lottery={lottery} />
        )}
        </div> :

      <Card className="text-center py-16">
          <Search size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            No lotteries found
          </h3>
          <p className="text-gray-500 dark:text-slate-400 mb-4">
            Try adjusting your search or filters.
          </p>
          <div className="flex justify-center gap-2">
            <Button
            variant="secondary"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}>

              Clear Filters
            </Button>
          </div>
        </Card>
      }
    </div>);

}