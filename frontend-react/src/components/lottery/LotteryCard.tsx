import React from 'react';
import { Link } from 'react-router-dom';
import { Lottery } from '../../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DrawCountdown } from './DrawCountdown';
import { Users, Trophy } from 'lucide-react';

interface LotteryCardProps {
  lottery: Lottery;
}

export function LotteryCard({ lottery }: LotteryCardProps) {
  const isEnded = new Date(lottery.drawDate) < new Date();
  const percentSold = Math.round(lottery.ticketsSold / lottery.totalTickets * 100);

  return <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="h-40 w-full overflow-hidden relative bg-slate-100">
        {lottery.imageUrl ? (
          <img src={lottery.imageUrl} alt={lottery.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gold-100 to-brand-gold-200 text-brand-gold-400">
            <Trophy className="h-16 w-16" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={isEnded ? 'secondary' : 'default'}>
            {isEnded ? 'Ended' : 'Active'}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{lottery.name}</CardTitle>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
          {lottery.description}
        </p>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Prize Pool</span>
          <span className="font-bold text-lg text-gradient-gold tabular-nums">
            ${lottery.prizePool.toLocaleString()}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Tickets Sold</span>
            <span className="tabular-nums">
              {lottery.ticketsSold} / {lottery.totalTickets}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentSold}%` }} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-500">
            <Users className="h-3 w-3 mr-1" />
            {lottery.ticketsSold} players
          </div>
          {!isEnded && <DrawCountdown targetDate={lottery.drawDate} />}
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/50 border-t border-slate-100">
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-xs text-slate-500 block">Price per ticket</span>
            <span className="font-bold text-slate-900 tabular-nums">
              ${lottery.ticketPrice.toFixed(2)}
            </span>
          </div>
          <Link to={`/lottery/${lottery.id}`}>
            <Button disabled={isEnded}>
              {isEnded ? 'View Results' : 'Play Now'}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>;
}

