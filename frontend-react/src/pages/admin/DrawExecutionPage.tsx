import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { lotteryService, DrawResult } from '../../services/lottery.service';
import { Lottery } from '../../types';
import { Zap, Users, Ticket, Trophy, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function DrawExecutionPage() {
  const navigate = useNavigate();
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [selectedLottery, setSelectedLottery] = useState<Lottery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);

  useEffect(() => {
    fetchClosedLotteries();
  }, []);

  const fetchClosedLotteries = async () => {
    setIsLoading(true);
    try {
      const data = await lotteryService.getLotteries({ status: 'closed' });
      setLotteries(data);
    } catch (error) {
      console.error('Failed to fetch lotteries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteDraw = async () => {
    if (!selectedLottery) return;
    setIsExecuting(true);
    try {
      const result = await lotteryService.executeDraw(selectedLottery.id);
      setDrawResult(result);
      setShowConfirmation(false);
      fetchClosedLotteries();
    } catch (error: any) {
      alert(error.message || 'Failed to execute draw');
    } finally {
      setIsExecuting(false);
    }
  };

  const canExecuteDraw = (lottery: Lottery): boolean => {
    return lottery.status === 'closed' && lottery.ticketsSold > 0 && new Date(lottery.drawDate) <= new Date();
  };

  if (drawResult) {
    return <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Draw Executed Successfully!
            </h2>
            <p className="text-slate-600 mb-6">
              Winner has been selected and prize has been credited
            </p>
            <Button onClick={() => navigate(`/org/lottery/${drawResult.lotteryId}/results`)}>
              View Results
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Draw Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Winner</p>
                <p className="font-bold text-slate-900">
                  {drawResult.winnerName}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Winning Ticket</p>
                <p className="font-bold text-brand-gold-600">
                  {drawResult.winnerTicketNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Prize Amount</p>
                <p className="font-bold text-emerald-600 tabular-nums">
                  ${drawResult.prizeAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Participants</p>
                <p className="font-bold text-slate-900">
                  {drawResult.totalParticipants}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>;
  }

  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Execute Draw</h1>
        <p className="text-slate-500 mt-1">
          Select a closed lottery to execute the draw and select a winner
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading lotteries...</p>
        </div>
      ) : lotteries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No closed lotteries ready for draw</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lotteries.map(lottery => {
            const isReady = canExecuteDraw(lottery);
            return (
              <Card key={lottery.id} className={cn('cursor-pointer transition-all hover:shadow-lg', selectedLottery?.id === lottery.id && 'ring-2 ring-brand-gold-500', !isReady && 'opacity-60')} onClick={() => isReady && setSelectedLottery(lottery)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{lottery.name}</CardTitle>
                    <Badge variant={isReady ? 'default' : 'secondary'}>
                      {isReady ? 'Ready' : 'Not Ready'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-brand-gold-500" />
                      <div>
                        <p className="text-slate-500">Prize Pool</p>
                        <p className="font-bold text-slate-900 tabular-nums">
                          ${lottery.prizePool.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-500" />
                      <div>
                        <p className="text-slate-500">Participants</p>
                        <p className="font-bold text-slate-900">
                          {lottery.ticketsSold}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-emerald-500" />
                      <div>
                        <p className="text-slate-500">Tickets Sold</p>
                        <p className="font-bold text-slate-900">
                          {lottery.ticketsSold} / {lottery.totalTickets}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-slate-500">Draw Date</p>
                        <p className="font-bold text-slate-900">
                          {new Date(lottery.drawDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isReady && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {lottery.ticketsSold === 0 ? 'No tickets sold' : 'Draw date not reached yet'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedLottery && (
        <Card className="border-brand-gold-200 bg-brand-gold-50">
          <CardHeader>
            <CardTitle>Execute Draw: {selectedLottery.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-slate-900">
                Pre-Draw Checklist
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-slate-600">
                    Lottery is closed ({selectedLottery.ticketsSold} tickets sold)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-slate-600">
                    Draw date reached ({new Date(selectedLottery.drawDate).toLocaleDateString()})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-slate-600">
                    Prize pool ready (${selectedLottery.prizePool.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Draw Process</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-slate-300">
                <li>Generate cryptographically secure random seed</li>
                <li>Select winning ticket using deterministic algorithm</li>
                <li>Credit prize to winner's wallet</li>
                <li>Send notifications to all participants</li>
                <li>Create audit log for compliance</li>
              </ol>
            </div>

            <Button className="w-full h-12 text-lg" onClick={() => setShowConfirmation(true)}>
              <Zap className="mr-2 h-5 w-5" />
              Execute Draw Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedLottery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirm Draw Execution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">
                      This action cannot be undone
                    </p>
                    <p>
                      Once executed, the draw will select a winner and credit the prize. Make sure all conditions are met before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Lottery</span>
                  <span className="font-medium text-slate-900">
                    {selectedLottery.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Participants</span>
                  <span className="font-medium text-slate-900">
                    {selectedLottery.ticketsSold}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Prize Amount</span>
                  <span className="font-bold text-brand-gold-600 tabular-nums">
                    ${selectedLottery.prizePool.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)} disabled={isExecuting}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleExecuteDraw} isLoading={isExecuting}>
                  <Zap className="mr-2 h-4 w-4" />
                  Confirm & Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>;
}

