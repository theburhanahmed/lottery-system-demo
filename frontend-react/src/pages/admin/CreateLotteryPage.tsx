import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Image, Trophy } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import type { AdapterLottery } from '../../types/adapter';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export type CreateLotteryData = Omit<AdapterLottery, 'id' | 'ticketsSold'> & { coverImage?: File | null };

interface CreateLotteryPageProps {
  onCreate: (data: CreateLotteryData) => void | Promise<void>;
}
export function CreateLotteryPage({ onCreate }: CreateLotteryPageProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [prizeAmount, setPrizeAmount] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [status, setStatus] = useState<'active' | 'upcoming'>('active');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!ticketPrice || parseFloat(ticketPrice) <= 0)
      errs.ticketPrice = 'Valid price required';
    if (!totalTickets || parseInt(totalTickets) <= 0)
      errs.totalTickets = 'Valid number required';
    if (!prizeAmount || parseFloat(prizeAmount) <= 0)
      errs.prizeAmount = 'Valid amount required';
    if (!drawDate) errs.drawDate = 'Draw date is required';
    if (coverImage) {
      if (coverImage.size > MAX_IMAGE_SIZE) errs.coverImage = 'Image must be 5MB or less';
      if (!ALLOWED_IMAGE_TYPES.includes(coverImage.type))
        errs.coverImage = errs.coverImage || 'Use PNG, JPG or WebP';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrors((prev) => ({ ...prev, coverImage: undefined }));
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, coverImage: 'Image must be 5MB or less' }));
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, coverImage: 'Use PNG, JPG or WebP' }));
      return;
    }
    setCoverImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onCreate({
        title,
        description,
        ticketPrice: parseFloat(ticketPrice),
        totalTickets: parseInt(totalTickets),
        prizeAmount: parseFloat(prizeAmount),
        drawDate: new Date(drawDate).toISOString(),
        status,
        coverImage: coverImage || undefined,
      });
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium mb-6 transition-colors">

        <ChevronLeft size={18} /> Back to Admin Dashboard
      </Link>

      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
        Create New Lottery
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Lottery Title"
                value={title}
                onChange={setTitle}
                placeholder="e.g. Mega Jackpot"
                error={errors.title} />


              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the lottery..."
                  rows={4}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${errors.description ? 'border-red-300' : 'border-gray-200'}`} />

                {errors.description &&
                <p className="text-xs text-red-500 font-medium">
                    {errors.description}
                  </p>
                }
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ticket Price ($)"
                  type="number"
                  value={ticketPrice}
                  onChange={setTicketPrice}
                  placeholder="25"
                  error={errors.ticketPrice} />

                <Input
                  label="Total Tickets"
                  type="number"
                  value={totalTickets}
                  onChange={setTotalTickets}
                  placeholder="1000"
                  error={errors.totalTickets} />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Prize Amount ($)"
                  type="number"
                  value={prizeAmount}
                  onChange={setPrizeAmount}
                  placeholder="50000"
                  error={errors.prizeAmount} />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Draw Date
                  </label>
                  <input
                    type="datetime-local"
                    value={drawDate}
                    onChange={(e) => setDrawDate(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.drawDate ? 'border-red-300' : 'border-gray-200'}`} />

                  {errors.drawDate &&
                  <p className="text-xs text-red-500 font-medium">
                      {errors.drawDate}
                    </p>
                  }
                </div>
              </div>

              {/* Cover image upload */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${errors.coverImage ? 'border-red-300' : 'border-gray-200 hover:border-emerald-300'}`}
                >
                  {coverImage ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{coverImage.name}</p>
                      <p className="text-xs text-gray-500">{(coverImage.size / 1024).toFixed(1)} KB</p>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCoverImage(null); }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Image size={32} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP up to 5MB</p>
                    </>
                  )}
                </div>
                {errors.coverImage && (
                  <p className="text-xs text-red-500 font-medium">{errors.coverImage}</p>
                )}
              </div>

              {/* Status toggle */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex gap-2">
                  {(['active', 'upcoming'] as const).map((s) =>
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${status === s ? s === 'active' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>

                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}>

                Create Lottery
              </Button>
            </form>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3">Preview</h3>
            <Card padding={false} className="overflow-hidden">
              <div
                className={`h-32 bg-gradient-to-br ${status === 'active' ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-indigo-600'} flex items-center justify-center relative`}>

                <Trophy size={40} className="text-white/30" />
                <div className="absolute top-3 right-3">
                  <Badge variant={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
                {prizeAmount &&
                <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-amber-300 font-extrabold">
                      ${parseFloat(prizeAmount || '0').toLocaleString()}
                    </span>
                  </div>
                }
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-gray-900">
                  {title || 'Lottery Title'}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {description || 'Lottery description will appear here...'}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${ticketPrice || '0'} / ticket</span>
                  <span>{totalTickets || '0'} total</span>
                </div>
                <Button variant="primary" size="sm" className="w-full" disabled>
                  Buy Ticket
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes page-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-page-in { animation: page-in 0.4s ease-out; }
      `}</style>
    </div>);

}