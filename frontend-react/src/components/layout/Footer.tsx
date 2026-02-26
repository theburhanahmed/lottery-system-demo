import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Shield, Zap, Award } from 'lucide-react';

interface FooterProps {
  user?: { id: string } | null;
}

export function Footer({ user }: FooterProps = {}) {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Lotteries', href: '/lotteries' },
    { label: 'Draw Results', href: '/results' },
    { label: 'Check Numbers', href: '/check-numbers' },
    ...(user ? [
      { label: 'My Tickets', href: '/my-tickets' },
      { label: 'Wallet', href: '/wallet' },
    ] : []),
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center">
                <Ticket size={18} className="text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">
                49<span className="text-emerald-400">flash</span>money
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your trusted lottery platform. Fair draws, instant payouts, and
              secure transactions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="space-y-2.5">
              {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <div className="space-y-2.5">
              {[
              {
                label: 'Terms of Service',
                href: '/terms'
              },
              {
                label: 'Privacy Policy',
                href: '/privacy'
              },
              {
                label: 'Responsible Gaming',
                href: '/responsible-gaming'
              },
              {
                label: 'Support',
                href: '/support'
              }].
              map((link) =>
              <Link
                key={link.label}
                to={link.href}
                className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </Link>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Trust & Security
            </h4>
            <div className="space-y-3">
              {[
              {
                icon: Shield,
                text: 'SSL Encrypted'
              },
              {
                icon: Zap,
                text: 'Instant Payouts'
              },
              {
                icon: Award,
                text: 'Licensed & Regulated'
              }].
              map(({ icon: Icon, text }) =>
              <div
                key={text}
                className="flex items-center gap-2.5 text-sm text-gray-400">

                  <Icon size={16} className="text-emerald-500 flex-shrink-0" />
                  {text}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
          © 2026 49flashmoney. All rights reserved. Play responsibly.
        </div>
      </div>
    </footer>);

}