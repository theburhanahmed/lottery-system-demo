import React, { useState } from 'react';
import {
  HeartHandshake,
  Clock,
  Ban,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Shield,
  Activity,
  Save } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
interface ResponsibleGamingPageProps {
  onSetLimit?: (limits: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  }) => void;
  onSelfExclude?: (until: string) => void;
}
export function ResponsibleGamingPage({
  onSetLimit,
  onSelfExclude
}: ResponsibleGamingPageProps) {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showExcludeModal, setShowExcludeModal] = useState(false);
  const [dailyLimit, setDailyLimit] = useState('');
  const [excludeDuration, setExcludeDuration] = useState('24h');
  const handleSetLimit = () => {
    if (onSetLimit) {
      onSetLimit({
        daily: parseInt(dailyLimit) || undefined
      });
      setShowLimitModal(false);
    }
  };
  const handleSelfExclude = () => {
    if (onSelfExclude) {
      const date = new Date();
      if (excludeDuration === '24h') date.setDate(date.getDate() + 1);
      if (excludeDuration === '7d') date.setDate(date.getDate() + 7);
      if (excludeDuration === '30d') date.setDate(date.getDate() + 30);
      onSelfExclude(date.toISOString());
      setShowExcludeModal(false);
    }
  };
  const features = [
  {
    icon: Clock,
    title: 'Reality Checks',
    desc: 'Set reminders to keep track of how long you have been playing.',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    icon: Ban,
    title: 'Self-Exclusion',
    desc: 'Take a break from playing for a set period of time.',
    color: 'text-red-600 bg-red-50',
    action: () => setShowExcludeModal(true)
  },
  {
    icon: Activity,
    title: 'Deposit Limits',
    desc: 'Set daily, weekly, or monthly limits on how much you can deposit.',
    color: 'text-emerald-600 bg-emerald-50',
    action: () => setShowLimitModal(true)
  },
  {
    icon: Shield,
    title: 'Account History',
    desc: 'Access your full transaction and game history to monitor your spending.',
    color: 'text-purple-600 bg-purple-50'
  }];

  const signs = [
  'Spending more money than you can afford',
  'Chasing losses to try and win back money',
  'Borrowing money to gamble',
  'Lying about how much time or money you spend gambling',
  'Neglecting work, school, or family responsibilities',
  'Feeling anxious or stressed about gambling'];

  const tips = [
  'Treat gambling as a form of entertainment, not a way to make money.',
  'Only gamble with money you can afford to lose.',
  'Set a money limit in advance and stick to it.',
  'Set a time limit in advance.',
  'Never chase your losses.',
  'Take frequent breaks.'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white mb-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <HeartHandshake size={24} className="text-white" />
            </div>
            <span className="font-semibold text-amber-100 tracking-wider uppercase text-sm">
              Player Protection
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Responsible Gaming
          </h1>
          <p className="text-amber-100 max-w-2xl text-lg">
            We are committed to providing a safe and responsible gaming
            environment. Gambling should be entertaining and fun, not a problem.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <HeartHandshake size={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tools to Help You Stay in Control
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) =>
              <Card
                key={feature.title}
                className={`h-full ${feature.action ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                onClick={feature.action}>

                  <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>

                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{feature.desc}</p>
                  {feature.action &&
                <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                }
                </Card>
              )}
            </div>
          </section>

          <section>
            <Card className="bg-gray-50 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle size={24} className="text-emerald-600" />
                Tips for Safer Gambling
              </h2>
              <ul className="space-y-3">
                {tips.map((tip, i) =>
                <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                )}
              </ul>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={24} className="text-amber-500" />
              Warning Signs
            </h2>
            <Card>
              <p className="text-gray-600 mb-4">
                If you find yourself doing any of the following, it may be time
                to take a break or seek help:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {signs.map((sign, i) =>
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg text-amber-900 text-sm font-medium">

                    <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {sign}
                  </div>
                )}
              </div>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-4">
              If you or someone you know has a gambling problem, help is
              available.
            </p>
            <div className="space-y-3">
              <a
                href="https://www.gamcare.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group">

                <span className="font-medium text-gray-700">GamCare</span>
                <ExternalLink
                  size={16}
                  className="text-gray-400 group-hover:text-blue-600" />

              </a>
              <a
                href="https://www.gamblersanonymous.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group">

                <span className="font-medium text-gray-700">
                  Gamblers Anonymous
                </span>
                <ExternalLink
                  size={16}
                  className="text-gray-400 group-hover:text-blue-600" />

              </a>
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group">

                <span className="font-medium text-gray-700">BeGambleAware</span>
                <ExternalLink
                  size={16}
                  className="text-gray-400 group-hover:text-blue-600" />

              </a>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-gray-900 mb-3">Underage Gambling</h3>
            <p className="text-sm text-gray-600 mb-4">
              It is illegal for anyone under the age of 18 to open an account or
              to gamble on our platform. We perform age verification checks on
              all accounts.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500">
                18+
              </span>
              Strictly Enforced
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        title="Set Deposit Limits">

        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Limits help you manage your spending. Increases to limits take 24
            hours to come into effect.
          </p>
          <Input
            label="Daily Limit ($)"
            type="number"
            value={dailyLimit}
            onChange={setDailyLimit}
            placeholder="e.g. 100" />

          <Button variant="primary" className="w-full" onClick={handleSetLimit}>
            Save Limit
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showExcludeModal}
        onClose={() => setShowExcludeModal(false)}
        title="Self-Exclusion">

        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-xl flex gap-3 text-red-800 text-sm">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <p>
              During self-exclusion, you will not be able to log in, deposit, or
              play. This action cannot be undone.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={excludeDuration}
              onChange={(e) => setExcludeDuration(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">

              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
          </div>
          <Button
            variant="primary"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleSelfExclude}>

            Confirm Self-Exclusion
          </Button>
        </div>
      </Modal>

      <style>{`
        @keyframes page-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-page-in { animation: page-in 0.4s ease-out; }
      `}</style>
    </div>);

}