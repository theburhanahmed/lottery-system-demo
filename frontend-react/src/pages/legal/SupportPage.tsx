import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  ChevronDown,
  ChevronUp,
  Send } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const faqs = [
  {
    q: 'How do I purchase a lottery ticket?',
    a: 'To purchase a ticket, navigate to the "Lotteries" page, select a lottery you wish to enter, choose the number of tickets you want to buy, and click "Purchase Tickets". You must have sufficient funds in your wallet.'
  },
  {
    q: 'How do I deposit funds into my wallet?',
    a: 'Go to the "Wallet" page, click on "Add Funds", select your preferred payment method (Credit Card, Bank Transfer, or Crypto), enter the amount, and follow the instructions to complete the transaction.'
  },
  {
    q: 'When are the lottery draws held?',
    a: 'Draw times vary by lottery. You can see the countdown to the next draw on each lottery card and on the lottery detail page. Results are posted immediately after the draw is completed.'
  },
  {
    q: 'How do I claim my winnings?',
    a: 'Winnings are automatically credited to your platform wallet immediately after the draw results are verified. You can withdraw these funds or use them to purchase more tickets.'
  },
  {
    q: 'Is my personal information secure?',
    a: 'Yes, we use industry-standard SSL encryption to protect your personal and financial information. We do not share your data with third parties without your consent. See our Privacy Policy for more details.'
  },
  {
    q: 'Can I cancel a ticket purchase?',
    a: 'All ticket purchases are final and cannot be cancelled or refunded once confirmed, unless the lottery draw itself is cancelled by the platform.'
  },
  {
    q: 'What happens if a draw is cancelled?',
    a: 'If a draw is cancelled, all tickets purchased for that draw will be fully refunded to your wallet automatically.'
  },
  {
    q: 'How do I verify my account?',
    a: 'Account verification may be required for large withdrawals. If verification is needed, you will be prompted to upload identification documents in your account settings.'
  }];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setFormState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
          <HelpCircle size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          How can we help you?
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support
          team. We're here to help 24/7.
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-500 mb-4">
            Get a response within 24 hours
          </p>
          <a
            href="mailto:support@49flashmoney.com"
            className="text-blue-600 font-semibold hover:underline">

            support@49flashmoney.com
          </a>
        </Card>

        <Card className="text-center p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-emerald-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-500 mb-4">
            Chat with our support team
          </p>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full uppercase tracking-wide">
            Coming Soon
          </span>
        </Card>

        <Card className="text-center p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone size={24} className="text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-sm text-gray-500 mb-4">Mon-Fri, 9am - 5pm EST</p>
          <a
            href="tel:+15551234567"
            className="text-purple-600 font-semibold hover:underline">

            +1 (555) 123-4567
          </a>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) =>
            <Card
              key={index}
              className={`cursor-pointer transition-all ${openFaq === index ? 'ring-2 ring-emerald-500' : ''}`}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}>

                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                  {openFaq === index ?
                <ChevronUp size={20} className="text-gray-400" /> :

                <ChevronDown size={20} className="text-gray-400" />
                }
                </div>
                {openFaq === index &&
              <div className="mt-3 text-gray-600 text-sm leading-relaxed animate-fade-in border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
              }
              </Card>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a Message
          </h2>
          <Card>
            {sent ?
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                  <Send size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500">
                  Thank you for contacting us. We'll get back to you shortly.
                </p>
              </div> :

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                  label="Your Name"
                  value={formState.name}
                  onChange={(val) =>
                  setFormState({
                    ...formState,
                    name: val
                  })
                  }
                  placeholder="John Doe" />

                  <Input
                  label="Email Address"
                  type="email"
                  value={formState.email}
                  onChange={(val) =>
                  setFormState({
                    ...formState,
                    email: val
                  })
                  }
                  placeholder="john@example.com" />

                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <select
                  value={formState.subject}
                  onChange={(e) =>
                  setFormState({
                    ...formState,
                    subject: e.target.value
                  })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">

                    <option>General Inquiry</option>
                    <option>Account Issue</option>
                    <option>Payment / Withdrawal</option>
                    <option>Technical Support</option>
                    <option>Report a Bug</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                  value={formState.message}
                  onChange={(e) =>
                  setFormState({
                    ...formState,
                    message: e.target.value
                  })
                  }
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  required />

                </div>

                <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={sending}>

                  Send Message
                </Button>

                <p className="text-xs text-center text-gray-400 mt-4">
                  We typically respond within 24 hours.
                </p>
              </form>
            }
          </Card>
        </div>
      </div>
    </div>);

}