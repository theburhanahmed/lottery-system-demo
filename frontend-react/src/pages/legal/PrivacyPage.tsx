import React from 'react';
import {
  Lock,
  Eye,
  Database,
  Globe,
  ShieldCheck,
  UserCheck,
  Cookie,
  Server } from
'lucide-react';
import { Card } from '../../components/ui/Card';
export function PrivacyPage() {
  const highlights = [
  {
    icon: Database,
    title: 'Data Collection',
    desc: 'We collect only essential information to provide our services.'
  },
  {
    icon: Lock,
    title: 'Security',
    desc: 'Your data is encrypted and stored on secure servers.'
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    desc: 'You have full control over your personal data.'
  }];

  const sections = [
  {
    id: 'collection',
    icon: Database,
    title: '1. Information We Collect',
    content:
    'We collect information you provide directly to us, such as when you create or modify your account, request customer support, or communicate with us. This may include: Name, Email address, Phone number, Payment information, and Transaction history.'
  },
  {
    id: 'usage',
    icon: Eye,
    title: '2. How We Use Information',
    content:
    'We use the information we collect to: Provide, maintain, and improve our services; Process transactions and send related information; Send you technical notices, updates, security alerts, and support messages; Respond to your comments, questions, and requests.'
  },
  {
    id: 'sharing',
    icon: Globe,
    title: '3. Data Sharing',
    content:
    'We do not share your personal information with third parties except as described in this policy. We may share information with: Vendors, consultants, and other service providers who need access to such information to carry out work on our behalf; In response to a request for information if we believe disclosure is in accordance with any applicable law.'
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: '4. Cookies & Tracking',
    content:
    'We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.'
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: '5. Data Security',
    content:
    'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your Personal Data.'
  },
  {
    id: 'retention',
    icon: Server,
    title: '6. Data Retention',
    content:
    'We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations.'
  }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Lock size={24} className="text-white" />
            </div>
            <span className="font-semibold text-blue-100 tracking-wider uppercase text-sm">
              Legal
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Privacy Policy
          </h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            We value your privacy and are committed to protecting your personal
            data. Learn how we collect, use, and safeguard your information.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <ShieldCheck size={400} />
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {highlights.map((item) =>
        <Card key={item.title} className="text-center p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <item.icon size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <Card className="p-4">
              <h3 className="font-bold text-gray-900 mb-4 px-2">Contents</h3>
              <nav className="space-y-1">
                {sections.map((section) =>
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors truncate">

                    {section.title}
                  </a>
                )}
              </nav>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {sections.map((section) =>
          <div key={section.id} id={section.id} className="scroll-mt-24">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <section.icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {section.title}
                    </h2>
                    <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                      <p>{section.content}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Card className="bg-gray-50 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              Questions about your privacy?
            </h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please
              contact us.
            </p>
            <a
              href="mailto:privacy@49flashmoney.com"
              className="text-blue-600 font-semibold hover:underline">

              privacy@49flashmoney.com
            </a>
          </Card>
        </div>
      </div>
    </div>);

}