import React from 'react';
import { Shield, FileText, Scale, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
export function TermsPage() {
  const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content:
    'By accessing or using the 49flashmoney platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.'
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content:
    'You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you meet all eligibility requirements. The Service is void where prohibited by law.'
  },
  {
    id: 'account',
    title: '3. Account Registration',
    content:
    'To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.'
  },
  {
    id: 'lottery',
    title: '4. Lottery Participation',
    content:
    'Participation in lotteries is subject to specific rules for each draw. Tickets purchased are final and non-refundable unless a draw is cancelled. We reserve the right to cancel or reschedule draws at our discretion.'
  },
  {
    id: 'purchases',
    title: '5. Ticket Purchases & Refunds',
    content:
    'All ticket purchases are final. Refunds are only issued in the event of a technical error or cancelled draw. You are responsible for ensuring you have sufficient funds in your wallet before purchasing tickets.'
  },
  {
    id: 'prizes',
    title: '6. Prize Claims',
    content:
    'Winnings are automatically credited to your platform wallet. Large prizes may require additional verification. You are responsible for any taxes applicable to your winnings in your jurisdiction.'
  },
  {
    id: 'wallet',
    title: '7. Wallet & Payments',
    content:
    'Funds in your wallet can be used for ticket purchases or withdrawn to your linked payment method. We may impose limits on deposits and withdrawals for security purposes.'
  },
  {
    id: 'prohibited',
    title: '8. Prohibited Conduct',
    content:
    'You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the Service. Cheating, fraud, or manipulation of lottery results will result in immediate account termination and legal action.'
  },
  {
    id: 'ip',
    title: '9. Intellectual Property',
    content:
    'The Service and its original content, features, and functionality are and will remain the exclusive property of 49flashmoney and its licensors.'
  },
  {
    id: 'liability',
    title: '10. Limitation of Liability',
    content:
    'In no event shall 49flashmoney, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.'
  },
  {
    id: 'termination',
    title: '11. Termination',
    content:
    'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.'
  },
  {
    id: 'governing',
    title: '12. Governing Law',
    content:
    'These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which 49flashmoney is registered, without regard to its conflict of law provisions.'
  },
  {
    id: 'contact',
    title: '13. Contact Us',
    content:
    'If you have any questions about these Terms, please contact us at support@49flashmoney.com.'
  }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Scale size={24} className="text-white" />
            </div>
            <span className="font-semibold text-emerald-100 tracking-wider uppercase text-sm">
              Legal
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Terms of Service
          </h1>
          <p className="text-emerald-100 max-w-2xl text-lg">
            Please read these terms carefully before using our platform. They
            outline your rights and responsibilities when playing with
            49flashmoney.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <FileText size={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-4 px-2">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) =>
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block px-2 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors truncate">

                    {section.title}
                  </a>
                )}
              </nav>
            </Card>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Last Updated
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    February 12, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="lg:hidden mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertCircle size={16} />
              <span>Last Updated: February 12, 2026</span>
            </div>
          </Card>

          {sections.map((section) =>
          <div key={section.id} id={section.id} className="scroll-mt-24">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-emerald-600" />
                  {section.title}
                </h2>
                <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed">
                  <p>{section.content}</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>);

}