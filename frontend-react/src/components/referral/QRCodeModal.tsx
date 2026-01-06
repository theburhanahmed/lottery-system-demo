import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Download } from 'lucide-react';
import { QRCodeSVG } from 'react-qr-code';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  url: string;
}

export function QRCodeModal({ isOpen, onClose, code, url }: QRCodeModalProps) {
  const downloadQR = () => {
    // Implementation would download the QR code as PNG
    // For now, just log
    console.log('Download QR code');
  };

  return <Modal isOpen={isOpen} onClose={onClose} title="Your Referral QR Code">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-lg border-2 border-slate-200 flex items-center justify-center">
          <QRCodeSVG value={url} size={256} level="H" />
        </div>

        <div className="bg-slate-50 p-4 rounded-lg text-center">
          <p className="text-sm text-slate-600 mb-1">Referral Code</p>
          <p className="text-2xl font-bold text-slate-900 tracking-wider">
            {code}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button onClick={downloadQR} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download QR
          </Button>
        </div>

        <p className="text-xs text-center text-slate-500">
          Users can scan this QR code to sign up with your referral code
        </p>
      </div>
    </Modal>;
}

