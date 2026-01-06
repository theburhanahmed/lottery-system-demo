import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ReferralCodeCard } from '../components/referral/ReferralCodeCard';
import { ReferralStats } from '../components/referral/ReferralStats';
import { ReferralHistoryTable } from '../components/referral/ReferralHistoryTable';
import { QRCodeModal } from '../components/referral/QRCodeModal';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { referralService, ReferralLink, ReferralStats as Stats, Referral, ReferralWithdrawal } from '../services/referral.service';
import { ArrowDownToLine, Gift, AlertCircle } from 'lucide-react';

export function ReferralDashboard() {
  const [referralLink, setReferralLink] = useState<ReferralLink | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [withdrawals, setWithdrawals] = useState<ReferralWithdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    setIsLoading(true);
    try {
      const [linkData, statsData, referralsData, withdrawalsData] = await Promise.all([
        referralService.getMyReferralLink(),
        referralService.getStats(),
        referralService.getMyReferrals(),
        referralService.getMyWithdrawals()
      ]);
      setReferralLink(linkData);
      setStats(statsData);
      setReferrals(referralsData);
      setWithdrawals(withdrawalsData);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!stats || amount <= 0 || amount > stats.availableBalance) {
      return;
    }
    setIsProcessing(true);
    try {
      await referralService.requestWithdrawal({
        amount,
        withdrawalMethod: 'bank_transfer'
      });
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      fetchReferralData();
    } catch (error: any) {
      alert(error.message || 'Failed to request withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading referral dashboard...</p>
        </div>
      </div>;
  }

  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Referral Program
          </h1>
          <p className="text-slate-500 mt-1">
            Invite friends and earn rewards together
          </p>
        </div>
        {stats && stats.availableBalance > 0 && (
          <Button onClick={() => setShowWithdrawalModal(true)}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Withdraw Bonus
          </Button>
        )}
      </div>

      {/* Referral Code Card */}
      {referralLink && (
        <ReferralCodeCard code={referralLink.code} url={referralLink.url} onShowQR={() => setShowQRModal(true)} />
      )}

      {/* Statistics */}
      {stats && <ReferralStats stats={stats} />}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-brand-gold-500" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-gold-600 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Share Your Code
              </h3>
              <p className="text-sm text-slate-600">
                Share your unique referral code or link with friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-gold-600 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                They Sign Up
              </h3>
              <p className="text-sm text-slate-600">
                Your friend creates an account and makes their first deposit
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-gold-600 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                You Both Earn
              </h3>
              <p className="text-sm text-slate-600">
                You both receive bonus credits to your accounts automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <ReferralHistoryTable referrals={referrals} />

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {withdrawals.map(withdrawal => (
                    <tr key={withdrawal.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(withdrawal.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 tabular-nums">
                          ${withdrawal.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-slate-700">
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {withdrawal.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code Modal */}
      {referralLink && (
        <QRCodeModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} code={referralLink.code} url={referralLink.url} />
      )}

      {/* Withdrawal Modal */}
      <Modal isOpen={showWithdrawalModal} onClose={() => setShowWithdrawalModal(false)} title="Withdraw Referral Bonus">
        <form onSubmit={handleWithdrawal} className="space-y-6">
          {stats && (
            <>
              <div className="bg-brand-gold-50 p-4 rounded-lg border border-brand-gold-200">
                <p className="text-sm text-brand-gold-900 mb-1">
                  Available Balance
                </p>
                <p className="text-3xl font-bold text-brand-gold-900 tabular-nums">
                  ${stats.availableBalance.toFixed(2)}
                </p>
              </div>

              <Input label="Withdrawal Amount" type="number" min="0" max={stats.availableBalance} step="0.01" placeholder="0.00" value={withdrawalAmount} onChange={e => setWithdrawalAmount(e.target.value)} required autoFocus />

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Withdrawal requests are reviewed by our team and typically processed within 1-3 business days.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowWithdrawalModal(false)} className="flex-1" disabled={isProcessing}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={isProcessing}>
                  Request Withdrawal
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>;
}

