import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLottery } from '../contexts/LotteryContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export function CreateLottery() {
  const navigate = useNavigate();
  const { createLottery } = useLottery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ticketPrice: '',
    totalTickets: '',
    prizePool: '',
    drawDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createLottery({
        name: formData.name,
        description: formData.description,
        ticketPrice: Number(formData.ticketPrice),
        totalTickets: Number(formData.totalTickets),
        prizePool: Number(formData.prizePool),
        drawDate: new Date(formData.drawDate).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1518688248740-75e20e738c53?auto=format&fit=crop&q=80&w=800'
      });
      navigate('/org/dashboard');
    } catch (error) {
      console.error('Failed to create lottery', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Lottery</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Lottery Name" name="name" placeholder="e.g. Summer Grand Draw" value={formData.name} onChange={handleChange} required />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea name="description" rows={3} className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe the prizes and rules..." value={formData.description} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Ticket Price ($)" name="ticketPrice" type="number" min="0.01" step="0.01" value={formData.ticketPrice} onChange={handleChange} required />
              <Input label="Total Tickets Available" name="totalTickets" type="number" min="1" value={formData.totalTickets} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Prize Pool ($)" name="prizePool" type="number" min="1" value={formData.prizePool} onChange={handleChange} required />
              <Input label="Draw Date" name="drawDate" type="datetime-local" value={formData.drawDate} onChange={handleChange} required />
            </div>

            <div className="pt-4 flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create Lottery
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
}

