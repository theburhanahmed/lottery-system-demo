import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { walletService, WithdrawalResponse } from '../../services/wallet.service';
import { CheckCircle2, XCircle, Clock, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function WithdrawalApprovalPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalResponse | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWithdrawals(activeTab);
  }, [activeTab]);

  const fetchWithdrawals = async (status: string) => {
    setIsLoading(true);
    try {
      const data = await walletService.getAllWithdrawals(status === 'all' ? undefined : status);
      setWithdrawals(data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    setIsProcessing(true);
    try {
      await walletService.approveWithdrawal(withdrawalId, actionNotes);
      setSelectedWithdrawal(null);
      setActionNotes('');
      fetchWithdrawals(activeTab);
    } catch (error: any) {
      alert(error.message || 'Failed to approve withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (withdrawalId: string) => {
    if (!actionNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    try {
      await walletService.rejectWithdrawal(withdrawalId, actionNotes);
      setSelectedWithdrawal(null);
      setActionNotes('');
      fetchWithdrawals(activeTab);
    } catch (error: any) {
      alert(error.message || 'Failed to reject withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'approved', label: 'Approved' },
    { id: 'completed', label: 'Completed' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All' }
  ];

  const statusConfig = {
    pending: { variant: 'warning' as const, icon: Clock },
    processing: { variant: 'default' as const, icon: AlertCircle },
    approved: { variant: 'success' as const, icon: CheckCircle2 },
    completed: { variant: 'success' as const, icon: CheckCircle2 },
    rejected: { variant: 'destructive' as const, icon: XCircle }
  };

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Withdrawal Approvals
          </h1>
          <p className="text-slate-500 mt-1">
            Review and process withdrawal requests
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="warning" className="text-base px-4 py-2">
            {pendingCount} Pending
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Withdrawals Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading withdrawals...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              No {activeTab !== 'all' ? activeTab : ''} withdrawals found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {withdrawals.map(withdrawal => {
            const config = statusConfig[withdrawal.status];
            const Icon = config.icon;
            return (
              <Card key={withdrawal.id} className={cn('cursor-pointer transition-all hover:shadow-lg', selectedWithdrawal?.id === withdrawal.id && 'ring-2 ring-brand-gold-500')} onClick={() => setSelectedWithdrawal(withdrawal)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Withdrawal Request
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        ID: {withdrawal.id.slice(0, 8)}
                      </p>
                    </div>
                    <Badge variant={config.variant} className="flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {withdrawal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Amount</span>
                    <span className="text-2xl font-bold text-brand-gold-600 tabular-nums">
                      ${withdrawal.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>Requested</span>
                      </div>
                      <p className="font-medium text-slate-900">
                        {new Date(withdrawal.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span>Method</span>
                      </div>
                      <p className="font-medium text-slate-900 capitalize">
                        {withdrawal.withdrawalMethod.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {withdrawal.notes && (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Notes</p>
                      <p className="text-sm text-slate-700">
                        {withdrawal.notes}
                      </p>
                    </div>
                  )}

                  {withdrawal.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={e => { e.stopPropagation(); handleApprove(withdrawal.id); }} disabled={isProcessing}>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-red-500 text-red-600 hover:bg-red-50" onClick={e => { e.stopPropagation(); setSelectedWithdrawal(withdrawal); }} disabled={isProcessing}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      {selectedWithdrawal && selectedWithdrawal.status === 'pending' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Review Withdrawal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Amount</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ${selectedWithdrawal.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Method</span>
                  <span className="font-medium text-slate-900 capitalize">
                    {selectedWithdrawal.withdrawalMethod.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Requested</span>
                  <span className="font-medium text-slate-900">
                    {new Date(selectedWithdrawal.requestedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional for approval, Required for rejection)
                </label>
                <textarea className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent" rows={3} placeholder="Add notes or rejection reason..." value={actionNotes} onChange={e => setActionNotes(e.target.value)} />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setSelectedWithdrawal(null); setActionNotes(''); }} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button variant="outline" className="flex-1 border-red-500 text-red-600 hover:bg-red-50" onClick={() => handleReject(selectedWithdrawal.id)} isLoading={isProcessing}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(selectedWithdrawal.id)} isLoading={isProcessing}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>;
}

