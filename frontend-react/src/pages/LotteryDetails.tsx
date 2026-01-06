import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLottery } from '../contexts/LotteryContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DrawCountdown } from '../components/lottery/DrawCountdown';
import { TicketPurchaseModal } from '../components/lottery/TicketPurchaseModal';
import { ArrowLeft, Calendar, Trophy, Users, AlertCircle } from 'lucide-react';

export function LotteryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLottery } = useLottery();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const lottery = getLottery(id || '');

  if (!lottery) {
    return <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900">
          Lottery not found
        </h2>
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>;
  }

  const isEnded = new Date(lottery.drawDate) < new Date();
  const percentSold = Math.round(lottery.ticketsSold / lottery.totalTickets * 100);

  return <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-900">
            {lottery.imageUrl && <img src={lottery.imageUrl} alt={lottery.name} className="w-full h-full object-cover opacity-80" />}
            <div className="absolute top-4 right-4">
              <Badge variant={isEnded ? 'secondary' : 'default'} className="text-sm px-3 py-1">
                {isEnded ? 'Ended' : 'Active'}
              </Badge>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {lottery.name}
            </h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">{lottery.description}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Trophy className="h-6 w-6 text-brand-gold-500 mb-2" />
                <span className="text-sm text-slate-500">Prize Pool</span>
                <span className="text-lg font-bold text-gradient-gold tabular-nums">
                  ${lottery.prizePool.toLocaleString()}
                </span>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Users className="h-6 w-6 text-brand-slate-600 mb-2" />
                <span className="text-sm text-slate-500">Participants</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {lottery.ticketsSold}
                </span>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Calendar className="h-6 w-6 text-emerald-500 mb-2" />
                <span className="text-sm text-slate-500">Draw Date</span>
                <span className="text-lg font-bold text-slate-900">
                  {new Date(lottery.drawDate).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar / Action Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Ticket Price</p>
                <p className="text-4xl font-bold text-slate-900 tabular-nums">
                  ${lottery.ticketPrice.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tickets Remaining</span>
                  <span className="font-medium tabular-nums">
                    {lottery.totalTickets - lottery.ticketsSold}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 h-2 rounded-full transition-all duration-500" style={{ width: `${percentSold}%` }} />
                </div>
              </div>

              {!isEnded && (
                <div className="bg-gradient-to-br from-brand-gold-50 to-brand-gold-100 rounded-lg p-4 text-center border border-brand-gold-200">
                  <p className="text-sm text-brand-gold-900 mb-1 font-semibold">
                    Draw starts in
                  </p>
                  <div className="justify-center flex">
                    <DrawCountdown targetDate={lottery.drawDate} />
                  </div>
                </div>
              )}

              <Button className="w-full h-12 text-lg" disabled={isEnded} onClick={() => setIsPurchaseModalOpen(true)}>
                {isEnded ? 'Draw Ended' : 'Buy Tickets'}
              </Button>

              <p className="text-xs text-center text-slate-400">
                By purchasing, you agree to our terms of service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <TicketPurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} lottery={lottery} />
    </div>;
}

