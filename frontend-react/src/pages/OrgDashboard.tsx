import React from 'react';
import { Link } from 'react-router-dom';
import { useLottery } from '../contexts/LotteryContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { PlusCircle, Users, DollarSign, Trophy } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export function OrgDashboard() {
  const { lotteries } = useLottery();

  // Mock metrics
  const totalSales = lotteries.reduce((acc, l) => acc + l.ticketsSold * l.ticketPrice, 0);
  const totalParticipants = lotteries.reduce((acc, l) => acc + l.ticketsSold, 0);
  const activeDraws = lotteries.filter(l => l.status === 'active').length;

  return <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Organization Dashboard
        </h1>
        <Link to="/org/lottery/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Lottery
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-brand-gold-100 text-brand-gold-600 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sales</p>
              <h3 className="text-2xl font-bold text-slate-900">
                ${totalSales.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Tickets Sold
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                {totalParticipants.toLocaleString()}
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
              <p className="text-sm font-medium text-slate-500">Active Draws</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {activeDraws}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

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

