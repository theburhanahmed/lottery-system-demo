import React, { useEffect, useState } from 'react';
import { useLottery } from '../contexts/LotteryContext';
import { useAuth } from '../contexts/AuthContext';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Ticket, DollarSign, TrendingUp, Award, Wallet } from 'lucide-react';
import { analyticsService, UserDashboardSummary } from '../services/analytics.service';

export function UserDashboard() {
  const { lotteries, getUserTickets } = useLottery();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeLotteries = lotteries.filter(l => l.status === 'active' || l.status === 'upcoming' || l.status === 'ended');
  const myTickets = getUserTickets();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getUserDashboardSummary();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num || 0);
  };

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

      {/* Analytics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : dashboardData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Wallet Balance</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {formatCurrency(dashboardData.wallet_balance)}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Tickets Bought</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {dashboardData.stats.tickets_bought}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Spent</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {formatCurrency(dashboardData.stats.total_spent)}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Won</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {formatCurrency(dashboardData.stats.total_won)}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            My Recent Tickets
          </h2>
          {dashboardData && dashboardData.recent_tickets.length > 0 ? (
            <Card>
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
                    {dashboardData.recent_tickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {ticket.lottery_name}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {ticket.ticket_number}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(ticket.purchased_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {ticket.is_winner ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Winner
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {ticket.lottery_status === 'DRAWN' ? 'Completed' : 'Active'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <p className="text-slate-500">
                You haven't purchased any tickets yet.
              </p>
            </Card>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Recent Transactions
          </h2>
          {dashboardData && dashboardData.recent_transactions.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dashboardData.recent_transactions.map(transaction => (
                      <tr key={transaction.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {transaction.lottery_name ? (
                            <div>
                              <div className="font-medium">{transaction.type.replace('_', ' ')}</div>
                              <div className="text-xs text-slate-500">{transaction.lottery_name}</div>
                            </div>
                          ) : (
                            transaction.type.replace('_', ' ')
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <p className="text-slate-500">
                No recent transactions.
              </p>
            </Card>
          )}
        </section>
      </div>

      {/* Additional Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Wins</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {dashboardData.stats.total_wins}
                  </h3>
                </div>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Lotteries Participated</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {dashboardData.stats.total_lotteries_participated}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Ticket className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {parseFloat(dashboardData.referral_bonus_balance) > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Referral Bonus</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {formatCurrency(dashboardData.referral_bonus_balance)}
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>;
}

