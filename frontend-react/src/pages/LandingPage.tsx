import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, Zap, Users, ArrowRight, Trophy, TrendingUp } from 'lucide-react';
import { lotteryService } from '../services/lottery.service';
import { Lottery } from '../types';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { AdUnit } from '../components/AdUnit';
import { MainAppNavbar } from '../components/layout/MainAppNavbar';

export function LandingPage() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const data = await lotteryService.getLotteries();
        setLotteries(data);
      } catch (error) {
        console.error('Failed to fetch lotteries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLotteries();
  }, []);

  const displayLotteries = lotteries.slice(0, 6);

  return <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-slate-950 via-brand-slate-900 to-brand-slate-800">
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <img src="https://cdn.magicpatterns.com/uploads/aRWamKBusTbYaXC3PiunuC/1000115406.jpg" alt="49FLASHMONEY" className="h-24 w-auto" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl mb-6">
              Win Big with{' '}
              <span className="text-gradient-gold">Lightning-Fast</span> Draws
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
              The most exciting lottery platform with instant draws, transparent results, and massive prizes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8 h-14">
                  Start Winning Now
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 h-14 border-brand-gold-500 text-brand-gold-400 hover:bg-brand-gold-500/10">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Lotteries Section */}
      <div className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Featured Lotteries
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose from our exciting lottery draws and start winning today!
            </p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-40 bg-slate-200 rounded mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : displayLotteries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayLotteries.map(lottery => (
                <LotteryCard key={lottery.id} lottery={lottery} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No lotteries available at the moment.</p>
            </div>
          )}
          {lotteries.length > 6 && (
            <div className="text-center mt-8">
              <Link to="/signup">
                <Button variant="outline" size="lg">
                  View All Lotteries
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ad Unit after featured lotteries */}
      <div className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AdUnit slot="1234567890" />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 py-16 mb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Change Your Life?
          </h2>
          <p className="text-xl text-brand-gold-50 mb-8 max-w-2xl mx-auto">
            Join thousands of winners who've already claimed their prizes.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 h-14 bg-white text-brand-gold-600 hover:bg-slate-50">
              Get Started Free
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      <MainAppNavbar />
    </div>;
}
