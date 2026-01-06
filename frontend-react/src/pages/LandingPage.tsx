import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, Zap, Users, ArrowRight, Trophy, TrendingUp } from 'lucide-react';

export function LandingPage() {
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 py-16">
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
    </div>;
}

