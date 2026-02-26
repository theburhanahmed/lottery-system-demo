import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Trophy,
  Users,
  Ticket,
  Clock,
  Minus,
  Plus,
  Wallet,
  AlertTriangle,
  Dices } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import type { AdapterLottery, AdapterUser, AdapterTicket as TicketType } from '../types/adapter';
interface LotteryDetailPageProps {
  lottery: AdapterLottery;
  user: AdapterUser | null;
  userTickets: TicketType[];
  onBuyTicket: (
    lotteryId: string,
    qty: number,
    pickedNumbers?: number[][]
  ) => boolean | Promise<boolean>;
}
export function LotteryDetailPage({
  lottery,
  user,
  userTickets,
  onBuyTicket
}: LotteryDetailPageProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<'results' | 'mytickets'>('mytickets');
  const [purchasing, setPurchasing] = useState(false);
  const [pickedNumbers, setPickedNumbers] = useState<number[][]>([]);
  const [showNumberPicker, setShowNumberPicker] = useState(false);
  const ticketsLeft = lottery.totalTickets - lottery.ticketsSold;
  const totalCost = lottery.ticketPrice * quantity;
  const canAfford = user ? user.walletBalance >= totalCost : false;
  const progress = lottery.ticketsSold / lottery.totalTickets * 100;
  const myTicketsForThis = userTickets.filter((t) => t.lotteryId === lottery.id);
  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const result = onBuyTicket(
        lottery.id,
        quantity,
        pickedNumbers.length > 0 ? pickedNumbers : undefined
      );
      const success = result instanceof Promise ? await result : result;
      if (success) {
        setShowModal(false);
        setQuantity(1);
        setPickedNumbers([]);
        setShowNumberPicker(false);
      }
    } finally {
      setPurchasing(false);
    }
  };
  const generateRandomNumbers = () => {
    const newPicks: number[][] = [];
    for (let i = 0; i < quantity; i++) {
      const nums = new Set<number>();
      while (nums.size < 6) {
        nums.add(Math.floor(Math.random() * 49) + 1);
      }
      newPicks.push(Array.from(nums).sort((a, b) => a - b));
    }
    setPickedNumbers(newPicks);
  };
  const toggleNumber = (ticketIndex: number, num: number) => {
    const currentPicks = [...pickedNumbers];
    // Initialize if empty
    while (currentPicks.length < quantity) {
      currentPicks.push([]);
    }
    const ticketNumbers = currentPicks[ticketIndex] || [];
    if (ticketNumbers.includes(num)) {
      // Remove number
      currentPicks[ticketIndex] = ticketNumbers.
      filter((n) => n !== num).
      sort((a, b) => a - b);
    } else {
      // Add number if less than 6
      if (ticketNumbers.length < 6) {
        currentPicks[ticketIndex] = [...ticketNumbers, num].sort(
          (a, b) => a - b
        );
      }
    }
    setPickedNumbers(currentPicks);
  };
  const gradients: Record<string, string> = {
    active: 'from-emerald-500 via-green-600 to-teal-700',
    upcoming: 'from-blue-500 via-indigo-600 to-purple-700',
    completed: 'from-gray-400 via-gray-500 to-gray-600'
  };
  return (
    <div className="animate-page-in">
      {/* Hero */}
      <div
        className={`bg-gradient-to-br ${gradients[lottery.status]} relative`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <Link
            to="/lotteries"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors">

            <ChevronLeft size={18} /> Back to Lotteries
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Badge variant={lottery.status} className="mb-3">
                {lottery.status.charAt(0).toUpperCase() +
                lottery.status.slice(1)}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                {lottery.title}
              </h1>
              <p className="text-white/80 max-w-lg">{lottery.description}</p>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[200px]">
              <p className="text-white/70 text-sm mb-1">Prize Pool</p>
              <p className="text-3xl md:text-4xl font-extrabold text-amber-300">
                ${lottery.prizeAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
              {
                icon: Ticket,
                label: 'Ticket Price',
                value: `$${lottery.ticketPrice}`
              },
              {
                icon: Users,
                label: 'Tickets Sold',
                value: `${lottery.ticketsSold}/${lottery.totalTickets}`
              },
              {
                icon: Trophy,
                label: 'Tickets Left',
                value: ticketsLeft.toString()
              },
              {
                icon: Clock,
                label: 'Draw Date',
                value: new Date(lottery.drawDate).toLocaleDateString()
              }].
              map((stat) =>
              <Card key={stat.label}>
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{stat.label}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </p>
                </Card>
              )}
            </div>

            {/* Progress */}
            <Card>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Tickets Sold</span>
                <span className="font-bold text-gray-900">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${progress}%`
                  }} />

              </div>
            </Card>

            {/* Countdown */}
            {lottery.status !== 'completed' &&
            <Card>
                <p className="text-sm text-gray-500 mb-3 font-medium">
                  Time Until Draw
                </p>
                <CountdownTimer targetDate={lottery.drawDate} />
              </Card>
            }

            {/* Tabs */}
            <Card>
              <div className="flex border-b border-gray-100 mb-4">
                {[
                {
                  key: 'mytickets',
                  label: `My Tickets (${myTicketsForThis.length})`
                },
                {
                  key: 'results',
                  label: 'Results'
                }].
                map((t) =>
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as typeof tab)}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

                    {t.label}
                  </button>
                )}
              </div>

              {tab === 'mytickets' && (
              myTicketsForThis.length > 0 ?
              <div className="space-y-2">
                    {myTicketsForThis.map((ticket) =>
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">

                        <div className="flex items-center gap-3">
                          <Ticket size={16} className="text-emerald-600" />
                          <div>
                            <span className="font-mono font-semibold text-sm">
                              {ticket.ticketNumber}
                            </span>
                            <p className="text-xs text-gray-500">
                              Purchased {ticket.purchaseDate}
                            </p>
                            {ticket.pickedNumbers &&
                      <div className="flex gap-1 mt-1">
                                {ticket.pickedNumbers.map((n) =>
                        <span
                          key={n}
                          className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center font-bold">

                                    {n}
                                  </span>
                        )}
                              </div>
                      }
                          </div>
                        </div>
                        <Badge variant={ticket.status}>
                          {ticket.status.charAt(0).toUpperCase() +
                    ticket.status.slice(1)}
                        </Badge>
                      </div>
                )}
                  </div> :

              <p className="text-center text-gray-400 py-6">
                    You haven't purchased tickets for this lottery yet.
                  </p>)
              }

              {tab === 'results' && (
              lottery.status === 'completed' && lottery.winningNumbers ?
              <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">
                      Winning Numbers
                    </p>
                    <div className="flex justify-center gap-3">
                      {lottery.winningNumbers.map((num, i) =>
                  <div
                    key={i}
                    className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">

                          <span className="text-lg font-extrabold text-white">
                            {num}
                          </span>
                        </div>
                  )}
                    </div>
                  </div> :

              <p className="text-center text-gray-400 py-6">
                    Results will be available after the draw.
                  </p>)
              }
            </Card>
          </div>

          {/* Buy Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                Purchase Tickets
              </h3>

              {lottery.status === 'active' ?
              <>
                  {/* Quantity */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-500 mb-2 block">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 1));
                        setPickedNumbers([]); // Reset picks on qty change
                      }}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">

                        <Minus size={16} />
                      </button>
                      <span className="text-2xl font-extrabold text-gray-900 w-12 text-center">
                        {quantity}
                      </span>
                      <button
                      onClick={() => {
                        setQuantity(Math.min(ticketsLeft, quantity + 1));
                        setPickedNumbers([]); // Reset picks on qty change
                      }}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">

                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Number Picker Toggle */}
                  <div className="mb-4">
                    <button
                    onClick={() => {
                      setShowNumberPicker(!showNumberPicker);
                      if (!showNumberPicker && pickedNumbers.length === 0) {
                        // Initialize empty arrays for manual picking
                        const initial = Array(quantity).fill([]);
                        setPickedNumbers(initial);
                      }
                    }}
                    className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:underline">

                      <Dices size={16} />
                      {showNumberPicker ? 'Hide Numbers' : 'Pick Your Numbers'}
                    </button>

                    {showNumberPicker &&
                  <div className="mt-3 space-y-4 bg-gray-50 p-4 rounded-xl">
                        {Array.from({
                      length: quantity
                    }).map((_, ticketIdx) =>
                    <div key={ticketIdx} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-500 uppercase">
                                Ticket #{ticketIdx + 1}
                              </span>
                              <span className="text-xs text-emerald-600 font-medium">
                                {(pickedNumbers[ticketIdx] || []).length}/6
                                selected
                              </span>
                            </div>

                            <div className="grid grid-cols-7 gap-1.5">
                              {Array.from({
                          length: 49
                        }).map((_, i) => {
                          const num = i + 1;
                          const isSelected = (
                          pickedNumbers[ticketIdx] || []).
                          includes(num);
                          return (
                            <button
                              key={num}
                              onClick={() => toggleNumber(ticketIdx, num)}
                              className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-600 text-white shadow-sm scale-110' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'}`}>

                                    {num}
                                  </button>);

                        })}
                            </div>
                          </div>
                    )}

                        <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={generateRandomNumbers}>

                          Randomize All
                        </Button>
                      </div>
                  }
                  </div>

                  {/* Price calc */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price per ticket</span>
                      <span className="font-medium">
                        ${lottery.ticketPrice}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Quantity</span>
                      <span className="font-medium">×{quantity}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-extrabold text-lg text-gray-900">
                        ${totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Wallet balance */}
                  {user &&
                <div
                  className={`flex items-center gap-2 text-sm mb-4 p-3 rounded-xl ${canAfford ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>

                      <Wallet size={16} />
                      <span>
                        Balance: ${user.walletBalance.toLocaleString()}
                      </span>
                    </div>
                }

                  {!canAfford && user &&
                <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl mb-4">
                      <AlertTriangle
                    size={16}
                    className="flex-shrink-0 mt-0.5" />

                      <div>
                        <p className="font-medium">Insufficient balance</p>
                        <Link
                      to="/wallet"
                      className="text-emerald-600 font-semibold hover:underline">

                          Add funds →
                        </Link>
                      </div>
                    </div>
                }

                  <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    if (user) {
                      // If picker wasn't shown or empty, generate randoms
                      if (
                      !showNumberPicker ||
                      pickedNumbers.length === 0 ||
                      pickedNumbers.some((p) => p.length < 6))
                      {
                        generateRandomNumbers();
                      }
                      setShowModal(true);
                    } else {
                      navigate('/login');
                    }
                  }}
                  disabled={!canAfford || ticketsLeft === 0}>

                    {!user ?
                  'Login to Purchase' :
                  ticketsLeft === 0 ?
                  'Sold Out' :
                  'Purchase Tickets'}
                  </Button>
                </> :
              lottery.status === 'upcoming' ?
              <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">
                    This lottery hasn't started yet.
                  </p>
                  <CountdownTimer targetDate={lottery.drawDate} />
                </div> :

              <div className="text-center py-4">
                  <p className="text-gray-500">This lottery has ended.</p>
                </div>
              }
            </Card>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Purchase">

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900 mb-1">{lottery.title}</p>
            <p className="text-sm text-gray-500">
              {quantity} ticket{quantity > 1 ? 's' : ''} × $
              {lottery.ticketPrice} each
            </p>
            {pickedNumbers.length > 0 &&
            <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Your Numbers
                </p>
                <div className="space-y-2">
                  {pickedNumbers.map((nums, i) =>
                <div key={i} className="flex gap-1">
                      {nums.map((n) =>
                  <span
                    key={n}
                    className="w-6 h-6 rounded-full bg-white border border-gray-200 text-xs flex items-center justify-center font-bold text-gray-700">

                          {n}
                        </span>
                  )}
                    </div>
                )}
                </div>
              </div>
            }
          </div>
          <div className="flex justify-between items-center py-3 border-t border-b border-gray-100">
            <span className="font-medium text-gray-700">Total Deduction</span>
            <span className="text-xl font-extrabold text-gray-900">
              ${totalCost.toLocaleString()}
            </span>
          </div>
          {user &&
          <div className="text-sm text-gray-500">
              Wallet balance after purchase:{' '}
              <span className="font-semibold text-gray-700">
                ${(user.walletBalance - totalCost).toLocaleString()}
              </span>
            </div>
          }
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowModal(false)}>

              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handlePurchase}
              loading={purchasing}>

              Confirm Purchase
            </Button>
          </div>
        </div>
      </Modal>

      <style>{`
        @keyframes page-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-page-in { animation: page-in 0.4s ease-out; }
      `}</style>
    </div>);

}