import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Ticket as TicketIcon, TrendingUp } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { CountdownTimer } from './ui/CountdownTimer';
import type { AdapterLottery } from '../types/adapter';
interface LotteryCardProps {
  lottery: AdapterLottery;
}
export function LotteryCard({ lottery }: LotteryCardProps) {
  const ticketsLeft = lottery.totalTickets - lottery.ticketsSold;
  const progress = lottery.ticketsSold / lottery.totalTickets * 100;
  const gradients: Record<string, string> = {
    active: 'from-emerald-500 to-teal-600',
    upcoming: 'from-blue-500 to-indigo-600',
    completed: 'from-gray-400 to-gray-500'
  };
  // Generate a random "recent buyers" count for social proof
  const recentBuyers = useMemo(() => Math.floor(Math.random() * 12) + 3, []);
  return (
    <Card hover padding={false} className="overflow-hidden group relative">
      <Link to={`/lottery/${lottery.id}`} className="block">
        {/* Image header */}
        <div
          className={`h-36 bg-gradient-to-br ${gradients[lottery.status]} relative flex items-center justify-center`}>

          <Trophy size={48} className="text-white/30" />
          <div className="absolute top-3 right-3">
            <Badge variant={lottery.status}>
              {lottery.status.charAt(0).toUpperCase() + lottery.status.slice(1)}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-amber-300 font-extrabold text-lg">
                ${lottery.prizeAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {lottery.title}
            </h3>
            {lottery.status === 'active' &&
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full animate-pulse">
                <TrendingUp size={12} />
                HOT
              </div>
            }
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <TicketIcon size={14} />
              <span>${lottery.ticketPrice} / ticket</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} />
              <span>{lottery.ticketsSold} sold</span>
            </div>
          </div>

          {/* Social Proof */}
          {lottery.status === 'active' &&
          <div className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) =>
              <div
                key={i}
                className={`w-4 h-4 rounded-full border border-white dark:border-slate-800 bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-slate-300`}>

                    {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                  </div>
              )}
              </div>
              <span>+{recentBuyers} bought tickets recently</span>
            </div>
          }

          {/* Progress bar */}
          {lottery.status !== 'upcoming' &&
          <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
                <span>{ticketsLeft} tickets left</span>
                <span>{Math.round(progress)}% sold</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                <div
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`
                }} />

              </div>
            </div>
          }

          {/* Countdown */}
          {lottery.status !== 'completed' &&
          <CountdownTimer
            targetDate={lottery.drawDate}
            compact
            className="dark:text-slate-300" />

          }

          {/* CTA */}
          <div className="pt-1">
            {lottery.status === 'active' &&
            <Button variant="primary" size="sm" className="w-full">
                Buy Ticket
              </Button>
            }
            {lottery.status === 'upcoming' &&
            <Button variant="outline" size="sm" className="w-full">
                Coming Soon
              </Button>
            }
            {lottery.status === 'completed' &&
            <Button variant="secondary" size="sm" className="w-full">
                View Results
              </Button>
            }
          </div>
        </div>
      </Link>
    </Card>);

}