import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Copy, Check, Share2, QrCode as QrCodeIcon } from 'lucide-react';

interface ReferralCodeCardProps {
  code: string;
  url: string;
  onShowQR: () => void;
}

export function ReferralCodeCard({ code, url, onShowQR }: ReferralCodeCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const copyToClipboard = (text: string, type: 'code' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '49FLASHMONEY - Join & Win!',
          text: `Join 49FLASHMONEY using my referral code ${code} and get a welcome bonus!`,
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(url, 'url');
    }
  };

  return <Card className="bg-gradient-to-br from-brand-gold-500 to-brand-gold-600 text-white border-none shadow-glow-gold">
      <CardHeader>
        <CardTitle className="text-white">Your Referral Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Referral Code */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white/80 text-sm mb-2">Referral Code</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black tracking-wider">{code}</span>
            <button onClick={() => copyToClipboard(code, 'code')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              {copiedCode ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Referral URL */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white/80 text-sm mb-2">Referral Link</p>
          <div className="flex items-center gap-2">
            <input type="text" value={url} readOnly className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
            <button onClick={() => copyToClipboard(url, 'url')} className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0">
              {copiedUrl ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="bg-white text-brand-gold-600 hover:bg-white/90" onClick={onShowQR}>
            <QrCodeIcon className="mr-2 h-4 w-4" />
            QR Code
          </Button>
          <Button variant="secondary" className="bg-white text-brand-gold-600 hover:bg-white/90" onClick={shareReferral}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <p className="text-white/80 text-xs text-center">
          Share your code and earn rewards when friends sign up and make their first deposit!
        </p>
      </CardContent>
    </Card>;
}

