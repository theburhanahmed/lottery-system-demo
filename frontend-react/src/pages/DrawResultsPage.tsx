import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { lotteryService, DrawResult } from '../services/lottery.service';
import { Trophy, Zap, Users, Calendar, Shield, ArrowLeft, Copy, Check } from 'lucide-react';
import { cn } from '../utils/cn';

export function DrawResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDrawResults();
    }
  }, [id]);

  const fetchDrawResults = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await lotteryService.getDrawResults(id);
      setDrawResult(data);
    } catch (error) {
      console.error('Failed to fetch draw results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading results...</p>
        </div>
      </div>;
  }

  if (!drawResult) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Results Not Available
            </h2>
            <p className="text-slate-600 mb-6">
              Draw results could not be found for this lottery.
            </p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Winner Announcement */}
        <div className="text-center space-y-6 py-12">
          {/* Animated Trophy */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-brand-gold-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 rounded-full flex items-center justify-center mx-auto shadow-glow-gold-lg">
              <Trophy className="h-16 w-16 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="default" className="text-base px-4 py-2">
              <Zap className="mr-2 h-4 w-4" />
              Winner Announced
            </Badge>
            <h1 className="text-5xl font-black text-white">Congratulations!</h1>
          </div>

          {/* Winner Card */}
          <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-white/80 text-lg mb-2">Winner</p>
              <h2 className="text-4xl font-bold text-white mb-6">
                {drawResult.winnerName}
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Winning Ticket</p>
                  <p className="text-2xl font-bold text-brand-gold-400 font-mono">
                    {drawResult.winnerTicketNumber}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Prize Amount</p>
                  <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                    ${drawResult.prizeAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-white/60 text-sm">
                Prize has been automatically credited to the winner's wallet
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Draw Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-1">Total Participants</p>
              <p className="text-3xl font-bold text-white">
                {drawResult.totalParticipants}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-brand-gold-400 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-white">
                {drawResult.totalTickets}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-1">Draw Date</p>
              <p className="text-xl font-bold text-white">
                {new Date(drawResult.drawnAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-gold-400" />
                Draw Audit Log
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAuditLog(!showAuditLog)} className="text-white hover:bg-white/10">
                {showAuditLog ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </CardHeader>
          {showAuditLog && (
            <CardContent className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-white/60">Random Seed</span>
                  <div className="flex items-center gap-2">
                    <code className="text-brand-gold-400 font-mono text-xs break-all max-w-xs">
                      {drawResult.randomSeed.slice(0, 32)}...
                    </code>
                    <button onClick={() => copyToClipboard(drawResult.randomSeed)} className="p-1 hover:bg-white/10 rounded transition-colors">
                      {copiedSeed ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/60" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Seed Hash (SHA256)</span>
                  <code className="text-white font-mono text-xs">
                    {drawResult.auditLog.seedHash.slice(0, 16)}...
                  </code>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Selection Method</span>
                  <span className="text-white font-medium">
                    {drawResult.auditLog.selectionMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Ticket Index Selected</span>
                  <span className="text-white font-medium">
                    {drawResult.auditLog.ticketIndex}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Executed By</span>
                  <span className="text-white font-medium">
                    {drawResult.auditLog.executedBy}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Timestamp</span>
                  <span className="text-white font-medium">
                    {new Date(drawResult.auditLog.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-900/30 border border-emerald-500/30 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-emerald-100">
                    <p className="font-semibold mb-1">Provably Fair Draw</p>
                    <p className="text-emerald-200/80">
                      This draw used cryptographically secure randomness and can be independently verified using the seed and hash provided above.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>;
}

