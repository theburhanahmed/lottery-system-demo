import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Trophy, Clock, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { AdapterTicket as TicketType } from '../types/adapter';
interface MyTicketsPageProps {
  tickets: TicketType[];
}
export function MyTicketsPage({ tickets }: MyTicketsPageProps) {
  const [filter, setFilter] = useState<string>('all');
  const filtered =
  filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);
  const filters = [
  {
    value: 'all',
    label: 'All',
    count: tickets.length
  },
  {
    value: 'pending',
    label: 'Pending',
    count: tickets.filter((t) => t.status === 'pending').length
  },
  {
    value: 'won',
    label: 'Won',
    count: tickets.filter((t) => t.status === 'won').length
  },
  {
    value: 'lost',
    label: 'Lost',
    count: tickets.filter((t) => t.status === 'lost').length
  }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          My Tickets
        </h1>
        <p className="text-gray-500 mt-1">Track all your lottery tickets</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) =>
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f.value ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>

            {f.label} <span className="ml-1 opacity-70">({f.count})</span>
          </button>
        )}
      </div>

      {filtered.length > 0 ?
      <div className="space-y-3">
          {filtered.map((ticket) =>
        <Card key={ticket.id} hover>
              <Link
            to={`/lottery/${ticket.lotteryId}`}
            className="flex flex-col sm:flex-row sm:items-center gap-4">

                <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${ticket.status === 'won' ? 'bg-amber-100' : ticket.status === 'pending' ? 'bg-emerald-100' : 'bg-gray-100'}`}>

                  {ticket.status === 'won' ?
              <Trophy size={20} className="text-amber-600" /> :
              ticket.status === 'pending' ?
              <Clock size={20} className="text-emerald-600" /> :

              <Ticket size={20} className="text-gray-400" />
              }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">
                      {ticket.lotteryTitle}
                    </h3>
                    <Badge variant={ticket.status}>
                      {ticket.status.charAt(0).toUpperCase() +
                  ticket.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="font-mono">{ticket.ticketNumber}</span>
                    <span>Purchased: {ticket.purchaseDate}</span>
                    <span>
                      Draw: {new Date(ticket.drawDate).toLocaleDateString()}
                    </span>
                  </div>
                  {ticket.pickedNumbers &&
              <div className="flex gap-1 mt-1.5">
                      {ticket.pickedNumbers.map((n) =>
                <span
                  key={n}
                  className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 text-[10px] flex items-center justify-center font-bold">

                          {n}
                        </span>
                )}
                    </div>
              }
                </div>
                {ticket.status === 'won' &&
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex-shrink-0 shadow-sm">
                    🎉 Winner!
                  </div>
            }
              </Link>
            </Card>
        )}
        </div> :

      <Card className="text-center py-16">
          <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't purchased any tickets yet.
          </p>
          <Link to="/lotteries">
            <Button variant="primary">Browse Lotteries</Button>
          </Link>
        </Card>
      }
    </div>);

}