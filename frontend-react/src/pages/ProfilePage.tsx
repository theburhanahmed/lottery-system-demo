import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Shield,
  Save,
  Bell,
  Activity,
  AlertTriangle,
  Lock,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { userService } from '../services/user.service';
import type { AdapterUser as UserType } from '../types/adapter';

interface ProfilePageProps {
  user: UserType;
  onUpdateProfile: (data: { name?: string; email?: string }) => void;
  onSetDepositLimit: (limits: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  }) => void;
  onSelfExclude: (until: string) => void;
}
export function ProfilePage({
  user,
  onUpdateProfile,
  onSetDepositLimit,
  onSelfExclude,
}: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [show2FASetupModal, setShow2FASetupModal] = useState(false);
  const [show2FABackupModal, setShow2FABackupModal] = useState(false);
  const [show2FADisableModal, setShow2FADisableModal] = useState(false);
  const [twoFAQrCode, setTwoFAQrCode] = useState<string | null>(null);
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [twoFAToken, setTwoFAToken] = useState('');
  const [twoFABackupCodes, setTwoFABackupCodes] = useState<string[]>([]);
  const [twoFAError, setTwoFAError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    userService.getProfile().then((p) => setIs2FAEnabled(p.is_2fa_enabled ?? false)).catch(() => {});
  }, []);

  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [kycIdFile, setKycIdFile] = useState<File | null>(null);
  const [kycAddressFile, setKycAddressFile] = useState<File | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  useEffect(() => {
    userService.getKycStatus().then((r) => setKycStatus(r.kyc_status)).catch(() => setKycStatus('NOT_STARTED'));
  }, []);
  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycIdFile && !kycAddressFile) {
      setKycError('Upload at least one document (ID or address proof).');
      return;
    }
    setKycError(null);
    setKycLoading(true);
    try {
      const res = await userService.submitKyc({
        id_document: kycIdFile || undefined,
        address_proof: kycAddressFile || undefined,
      });
      setKycStatus(res.kyc_status);
      setKycIdFile(null);
      setKycAddressFile(null);
    } catch (err: any) {
      setKycError(err?.message || 'Submission failed');
    } finally {
      setKycLoading(false);
    }
  };

  const handleEnable2FAClick = async () => {
    setTwoFAError(null);
    setTwoFALoading(true);
    try {
      const res = await userService.setup2FA();
      setTwoFAQrCode(res.qr_code);
      setTwoFASecret(res.secret);
      setShow2FASetupModal(true);
    } catch (err: any) {
      setTwoFAError(err?.message || 'Failed to start 2FA setup');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFAToken.trim()) return;
    setTwoFAError(null);
    setTwoFALoading(true);
    try {
      const res = await userService.verify2FASetup(twoFAToken.trim());
      setTwoFABackupCodes(res.backup_codes || []);
      setShow2FASetupModal(false);
      setTwoFAToken('');
      setTwoFAQrCode(null);
      setTwoFASecret(null);
      setShow2FABackupModal(true);
      setIs2FAEnabled(true);
    } catch (err: any) {
      setTwoFAError(err?.message || 'Invalid code');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setTwoFAError(null);
    setTwoFALoading(true);
    try {
      await userService.disable2FA();
      setIs2FAEnabled(false);
      setShow2FADisableModal(false);
    } catch (err: any) {
      setTwoFAError(err?.message || 'Failed to disable 2FA');
    } finally {
      setTwoFALoading(false);
    }
  };

  const copySecret = () => {
    if (twoFASecret) {
      navigator.clipboard.writeText(twoFASecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  // Notification preferences state
  const [notifDraw, setNotifDraw] = useState(true);
  const [notifNew, setNotifNew] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  // Deposit limits state
  const [dailyLimit, setDailyLimit] = useState(
    user.depositLimit?.daily?.toString() || ''
  );
  const [weeklyLimit, setWeeklyLimit] = useState(
    user.depositLimit?.weekly?.toString() || ''
  );
  const [monthlyLimit, setMonthlyLimit] = useState(
    user.depositLimit?.monthly?.toString() || ''
  );
  const [limitsLoading, setLimitsLoading] = useState(false);
  // Self exclusion state
  const [showExcludeModal, setShowExcludeModal] = useState(false);
  const [excludeDuration, setExcludeDuration] = useState('24h');
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onUpdateProfile({
        name,
        email
      });
      setLoading(false);
    }, 600);
  };
  const handleLimitsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLimitsLoading(true);
    setTimeout(() => {
      onSetDepositLimit({
        daily: dailyLimit ? parseInt(dailyLimit) : undefined,
        weekly: weeklyLimit ? parseInt(weeklyLimit) : undefined,
        monthly: monthlyLimit ? parseInt(monthlyLimit) : undefined
      });
      setLimitsLoading(false);
    }, 600);
  };
  const handleSelfExclude = () => {
    const date = new Date();
    if (excludeDuration === '24h') date.setDate(date.getDate() + 1);
    if (excludeDuration === '7d') date.setDate(date.getDate() + 7);
    if (excludeDuration === '30d') date.setDate(date.getDate() + 30);
    if (excludeDuration === 'indefinite')
    date.setFullYear(date.getFullYear() + 100);
    onSelfExclude(date.toISOString());
    setShowExcludeModal(false);
  };
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Profile Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <User size={40} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">
                  {user.role === 'admin' ? 'Administrator' : 'Player'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={name}
                onChange={setName}
                icon={<User size={18} />} />

              <Input
                label="Email Address"
                value={email}
                onChange={setEmail}
                icon={<Mail size={18} />}
                type="email" />

            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-emerald-600" />
                Security
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <Smartphone size={16} />
                    Two-factor authentication (2FA): {is2FAEnabled ? (
                      <span className="font-medium text-emerald-600">Enabled</span>
                    ) : (
                      <span className="text-gray-500">Not enabled</span>
                    )}
                  </span>
                  {is2FAEnabled ? (
                    <Button
                      variant="outline"
                      type="button"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => { setShow2FADisableModal(true); setTwoFAError(null); }}
                    >
                      Disable 2FA
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      type="button"
                      size="sm"
                      loading={twoFALoading}
                      onClick={handleEnable2FAClick}
                    >
                      Enable 2FA
                    </Button>
                  )}
                </div>
                {twoFAError && (
                  <p className="text-sm text-red-600">{twoFAError}</p>
                )}
                <Button
                  variant="outline"
                  type="button"
                  className="w-full sm:w-auto"
                >
                  Change Password
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="primary" type="submit" loading={loading}>
                <Save size={18} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Verification (KYC) */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-emerald-600" />
            Verification (KYC)
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Optional identity verification. Status: <strong>{kycStatus === null ? '…' : kycStatus.replace('_', ' ')}</strong>
          </p>
          {(kycStatus === 'NOT_STARTED' || kycStatus === 'REJECTED') && (
            <form onSubmit={handleKycSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID document</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700"
                  onChange={(e) => setKycIdFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address proof</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="block w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700"
                  onChange={(e) => setKycAddressFile(e.target.files?.[0] || null)}
                />
              </div>
              {kycError && <p className="text-sm text-red-600">{kycError}</p>}
              <Button type="submit" variant="primary" size="sm" loading={kycLoading}>
                Submit for review
              </Button>
            </form>
          )}
        </Card>

        {/* Notification Preferences */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-emerald-600" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="text-gray-700 font-medium">Draw Results</span>
              <input
                type="checkbox"
                checked={notifDraw}
                onChange={(e) => setNotifDraw(e.target.checked)}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" />

            </label>
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="text-gray-700 font-medium">
                New Lottery Alerts
              </span>
              <input
                type="checkbox"
                checked={notifNew}
                onChange={(e) => setNotifNew(e.target.checked)}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" />

            </label>
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="text-gray-700 font-medium">
                Promotional Offers
              </span>
              <input
                type="checkbox"
                checked={notifPromo}
                onChange={(e) => setNotifPromo(e.target.checked)}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" />

            </label>
          </div>
        </Card>

        {/* Deposit Limits */}
        <Card>
          <form onSubmit={handleLimitsSubmit}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" />
              Deposit Limits
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Set limits on how much you can deposit to help manage your
              spending.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Input
                label="Daily Limit ($)"
                type="number"
                value={dailyLimit}
                onChange={setDailyLimit}
                placeholder="No limit" />

              <Input
                label="Weekly Limit ($)"
                type="number"
                value={weeklyLimit}
                onChange={setWeeklyLimit}
                placeholder="No limit" />

              <Input
                label="Monthly Limit ($)"
                type="number"
                value={monthlyLimit}
                onChange={setMonthlyLimit}
                placeholder="No limit" />

            </div>
            <div className="flex justify-end">
              <Button variant="primary" type="submit" loading={limitsLoading}>
                Save Limits
              </Button>
            </div>
          </form>
        </Card>

        {/* Self Exclusion */}
        <Card className="border-red-100">
          <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
            <Lock size={18} className="text-red-600" />
            Self-Exclusion
          </h3>
          <div className="bg-red-50 p-4 rounded-xl flex gap-3 text-red-800 text-sm mb-6">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <p>
              If you feel you need a break, you can self-exclude from our
              platform. During this period, you will not be able to log in,
              deposit, or play. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-full bg-red-600 hover:bg-red-700 border-red-600"
            onClick={() => setShowExcludeModal(true)}>

            Configure Self-Exclusion
          </Button>
        </Card>
      </div>

      <Modal
        isOpen={showExcludeModal}
        onClose={() => setShowExcludeModal(false)}
        title="Confirm Self-Exclusion"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please select how long you would like to be excluded from the
            platform:
          </p>
          <div className="space-y-2">
            {[
              { label: '24 Hours', value: '24h' },
              { label: '7 Days', value: '7d' },
              { label: '30 Days', value: '30d' },
              { label: 'Indefinite', value: 'indefinite' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${excludeDuration === option.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
              >
                <span className="font-medium text-gray-900">{option.label}</span>
                <input
                  type="radio"
                  name="duration"
                  value={option.value}
                  checked={excludeDuration === option.value}
                  onChange={(e) => setExcludeDuration(e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowExcludeModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700 border-red-600"
              onClick={handleSelfExclude}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2FA Setup modal: QR code + token */}
      <Modal
        isOpen={show2FASetupModal}
        onClose={() => {
          setShow2FASetupModal(false);
          setTwoFAQrCode(null);
          setTwoFASecret(null);
          setTwoFAToken('');
          setTwoFAError(null);
        }}
        title="Set up two-factor authentication"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.), then enter the 6-digit code below.
          </p>
          {twoFAQrCode && (
            <div className="flex justify-center bg-white p-4 rounded-xl">
              <img src={twoFAQrCode} alt="2FA QR code" className="w-48 h-48" />
            </div>
          )}
          {twoFASecret && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Manual entry:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">{twoFASecret}</code>
              <button
                type="button"
                onClick={copySecret}
                className="p-1.5 rounded hover:bg-gray-100"
                title="Copy"
              >
                {copiedSecret ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          )}
          <Input
            label="Verification code"
            value={twoFAToken}
            onChange={setTwoFAToken}
            placeholder="000000"
            maxLength={6}
          />
          {twoFAError && <p className="text-sm text-red-600">{twoFAError}</p>}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShow2FASetupModal(false);
                setTwoFAQrCode(null);
                setTwoFASecret(null);
                setTwoFAToken('');
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleVerify2FA} loading={twoFALoading}>
              Verify and enable
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2FA Backup codes modal */}
      <Modal
        isOpen={show2FABackupModal}
        onClose={() => setShow2FABackupModal(false)}
        title="Save your backup codes"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Store these backup codes in a safe place. Each code can be used once if you lose access to your authenticator app.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm grid grid-cols-2 gap-2">
            {twoFABackupCodes.map((code, i) => (
              <span key={i}>{code}</span>
            ))}
          </div>
          <Button variant="primary" className="w-full" onClick={() => setShow2FABackupModal(false)}>
            I have saved these codes
          </Button>
        </div>
      </Modal>

      {/* 2FA Disable confirmation */}
      <Modal
        isOpen={show2FADisableModal}
        onClose={() => { setShow2FADisableModal(false); setTwoFAError(null); }}
        title="Disable two-factor authentication"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Your account will be less secure. You can re-enable 2FA anytime from Security settings.
          </p>
          {twoFAError && <p className="text-sm text-red-600">{twoFAError}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShow2FADisableModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-red-600 hover:bg-red-700 border-red-600"
              onClick={handleDisable2FA}
              loading={twoFALoading}
            >
              Disable 2FA
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );

}