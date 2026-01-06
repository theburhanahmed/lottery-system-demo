import React from 'react';
import { useLottery } from '../contexts/LotteryContext';
import { useAuth } from '../contexts/AuthContext';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Ticket } from 'lucide-react';

export function UserDashboard() {
  const { lotteries, getUserTickets } = useLottery();
  const { user } = useAuth();

  const activeLotteries = lotteries.filter(l => l.status === 'active' || l.status === 'upcoming');
  const myTickets = getUserTickets();

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-500">Here's what's happening today.</p>
        </div>
        <Card className="bg-gradient-to-br from-brand-gold-500 to-brand-gold-600 text-white border-none w-full md:w-auto shadow-glow-gold">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-white/30 rounded-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">
                My Active Tickets
              </p>
              <p className="text-2xl font-bold">{myTickets.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Lotteries Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Featured Lotteries
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeLotteries.map(lottery => (
            <LotteryCard key={lottery.id} lottery={lottery} />
          ))}
        </div>
      </section>

      {/* Recent Activity / My Tickets Preview */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          My Recent Tickets
        </h2>
        {myTickets.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Lottery</th>
                    <th className="px-6 py-4">Ticket Number</th>
                    <th className="px-6 py-4">Purchase Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myTickets.slice(0, 5).map(ticket => {
                    const lottery = lotteries.find(l => l.id === ticket.lotteryId);
                    return (
                      <tr key={ticket.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {lottery?.name}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {ticket.ticketNumber}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(ticket.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-500">
              You haven't purchased any tickets yet.
            </p>
          </Card>
        )}
      </section>
    </div>;
}

