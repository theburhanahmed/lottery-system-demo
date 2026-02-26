import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Ticket,
  CheckCircle,
  XCircle,
  Calendar,
  Trophy } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import type { AdapterTicket as TicketType, AdapterLottery } from '../types/adapter';
interface CheckNumbersPageProps {
  tickets: TicketType[];
  lotteries?: AdapterLottery[];
}
export function CheckNumbersPage({
  tickets,
  lotteries = []
}: CheckNumbersPageProps) {
  const [ticketNumber, setTicketNumber] = useState('');
  const [result, setResult] = useState<TicketType | null>(null);
  const [searched, setSearched] = useState(false);
  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const found = tickets.find(
      (t) => t.ticketNumber.toLowerCase() === ticketNumber.toLowerCase()
    );
    setResult(found || null);
    setSearched(true);
  };
  const recentDraws = lotteries.
  filter((l) => l.status === 'completed' && l.winningNumbers).
  sort(
    (a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()
  ).
  slice(0, 3);
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          Check Your Numbers
        </h1>
        <p className="text-gray-500">
          Enter your ticket number to see if you've won!
        </p>
      </div>

      <Card className="mb-8">
        <form onSubmit={handleCheck} className="flex gap-3">
          <div className="flex-1">
            <Input
              value={ticketNumber}
              onChange={setTicketNumber}
              placeholder="e.g. MJ-0472"
              icon={<Ticket size={18} />} />

          </div>
          <Button type="submit" variant="primary">
            Check Now
          </Button>
        </form>
      </Card>

      {searched &&
      <div className="animate-fade-in mb-12">
          {result ?
        <Card
          className={`text-center border-2 ${result.status === 'won' ? 'border-amber-400 bg-amber-50' : result.status === 'lost' ? 'border-gray-200' : 'border-blue-200 bg-blue-50'}`}>

              <div className="mb-4">
                {result.status === 'won' ?
            <CheckCircle
              size={64}
              className="mx-auto text-amber-500 mb-2" /> :

            result.status === 'lost' ?
            <XCircle size={64} className="mx-auto text-gray-400 mb-2" /> :

            <Ticket size={64} className="mx-auto text-blue-500 mb-2" />
            }
                <h2 className="text-2xl font-bold text-gray-900">
                  {result.status === 'won' ?
              'Congratulations! You Won!' :
              result.status === 'lost' ?
              'Better Luck Next Time' :
              'Draw Pending'}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto bg-white/50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Lottery</p>
                  <p className="font-bold">{result.lotteryTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Draw Date</p>
                  <p className="font-bold">
                    {new Date(result.drawDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Ticket Number
                  </p>
                  <p className="font-mono font-bold">{result.ticketNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <p className="font-bold capitalize">{result.status}</p>
                </div>
              </div>
            </Card> :

        <Card className="text-center py-8">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">
                Ticket Not Found
              </h3>
              <p className="text-gray-500">
                Please check the number and try again.
              </p>
            </Card>
        }
        </div>
      }

      {recentDraws.length > 0 &&
      <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Draw Results
          </h2>
          <div className="space-y-4">
            {recentDraws.map((lottery) =>
          <Link
            key={lottery.id}
            to={`/lottery/${lottery.id}`}
            className="block">

                <Card hover className="transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">
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
                          <Trophy size={14} className="text-amber-500" />$
                          {lottery.prizeAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {lottery.winningNumbers?.map((num, i) =>
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-sm text-white font-bold text-xs">

                          {num}
                        </div>
                  )}
                    </div>
                  </div>
                </Card>
              </Link>
          )}
          </div>
        </div>
      }
    </div>);

}