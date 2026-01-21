import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLottery } from '../contexts/LotteryContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { PlusCircle, Users, DollarSign, Trophy, TrendingUp, UserPlus } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { analyticsService, DashboardAnalytics } from '../services/analytics.service';

export function OrgDashboard() {
  const { lotteries } = useLottery();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getDashboard(30);
      setAnalytics(data);
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      setError(error.message || 'Failed to load analytics data');
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

  return <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Organization Dashboard
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalytics} disabled={isLoading}>
            Refresh
          </Button>
          <Link to="/org/lottery/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Lottery
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
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
      ) : analytics ? (
        <>
          {/* Financial Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Financial Overview (Last 30 Days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-brand-gold-100 text-brand-gold-600 rounded-lg">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {formatCurrency(analytics.financial.revenue)}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Net Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {formatCurrency(analytics.financial.net_revenue)}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Deposits</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {formatCurrency(analytics.financial.deposits)}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Withdrawals</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {formatCurrency(analytics.financial.withdrawals)}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* User & Lottery Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4">User & Lottery Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {analytics.users.total_users.toLocaleString()}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Active Users</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {analytics.users.active_users.toLocaleString()}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Active Lotteries</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {analytics.lotteries.active_lotteries}
                    </h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Tickets Sold</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {analytics.lotteries.tickets_sold.toLocaleString()}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}

      {/* Lotteries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Lotteries</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sold / Total</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Draw Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lotteries.map(lottery => (
                <tr key={lottery.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {lottery.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={lottery.status === 'active' ? 'default' : 'secondary'}>
                      {lottery.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {lottery.ticketsSold} / {lottery.totalTickets}
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${lottery.ticketsSold / lottery.totalTickets * 100}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${(lottery.ticketsSold * lottery.ticketPrice).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(lottery.drawDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;
}

