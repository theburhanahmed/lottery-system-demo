import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Trophy } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import type { AdapterLottery } from '../types/adapter';
interface ResultsPageProps {
  lotteries: AdapterLottery[];
}
export function ResultsPage({ lotteries }: ResultsPageProps) {
  const [search, setSearch] = useState('');
  const completedLotteries = lotteries.
  filter((l) => l.status === 'completed' && l.winningNumbers).
  filter((l) => l.title.toLowerCase().includes(search.toLowerCase())).
  sort(
    (a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Draw Results
        </h1>
        <p className="text-gray-500 mt-1">History of past winning numbers</p>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by lottery name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />

      </div>

      <div className="mb-8">
        <Link
          to="/check-numbers"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">

          Have a ticket? Check your numbers →
        </Link>
      </div>

      <div className="space-y-4">
        {completedLotteries.length > 0 ?
        completedLotteries.map((lottery) =>
        <Card
          key={lottery.id}
          className="hover:shadow-md transition-shadow">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {lottery.title}
                    </h3>
                    <Badge variant="completed">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(lottery.drawDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Trophy size={14} className="text-amber-500" />
                      Prize: ${lottery.prizeAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {lottery.winningNumbers?.map((num: string | number, i: number) =>
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-sm text-white font-bold">

                      {num}
                    </div>
              )}
                </div>
              </div>
            </Card>
        ) :

        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">
              No results found
            </h3>
            <p className="text-gray-500">Try adjusting your search terms.</p>
          </div>
        }
      </div>
    </div>);

}