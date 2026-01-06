import { Lottery, Transaction, User, Ticket } from '../types'

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    walletBalance: 150.0,
    referralCode: 'JOHN123',
  },
  {
    id: 'org1',
    email: 'admin@lottery.org',
    name: 'Admin User',
    role: 'org_admin',
    organizationId: 'org_1',
    walletBalance: 0,
    referralCode: 'ADMIN001',
  },
]

export const MOCK_LOTTERIES: Lottery[] = [
  {
    id: 'l1',
    organizationId: 'org_1',
    name: 'Weekly Grand Draw',
    description:
      'Win big with our weekly grand prize draw! Guaranteed winner every Friday.',
    ticketPrice: 5.0,
    totalTickets: 1000,
    ticketsSold: 450,
    drawDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    prizePool: 5000,
    status: 'active',
    imageUrl:
      'https://images.unsplash.com/photo-1518688248740-75e20e738c53?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'l2',
    organizationId: 'org_1',
    name: 'Daily Quick Pick',
    description:
      'Fast draws, instant results. Try your luck with the daily draw.',
    ticketPrice: 2.0,
    totalTickets: 500,
    ticketsSold: 120,
    drawDate: new Date(Date.now() + 3600000 * 5).toISOString(), // 5 hours from now
    prizePool: 1000,
    status: 'active',
    imageUrl:
      'https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'l3',
    organizationId: 'org_1',
    name: 'Mega Monthly Jackpot',
    description: "Our biggest prize pool of the month. Don't miss out!",
    ticketPrice: 10.0,
    totalTickets: 5000,
    ticketsSold: 0,
    drawDate: new Date(Date.now() + 86400000 * 20).toISOString(), // 20 days from now
    prizePool: 50000,
    status: 'upcoming',
    imageUrl:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'l4',
    organizationId: 'org_1',
    name: "Last Week's Winner",
    description: "Congratulations to the winners of last week's draw.",
    ticketPrice: 5.0,
    totalTickets: 1000,
    ticketsSold: 1000,
    drawDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    prizePool: 5000,
    status: 'ended',
    imageUrl:
      'https://images.unsplash.com/photo-1533422902779-aff35862e462?auto=format&fit=crop&q=80&w=800',
  },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    userId: 'u1',
    type: 'deposit',
    amount: 100.0,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Initial Deposit',
    status: 'completed',
  },
  {
    id: 't2',
    userId: 'u1',
    type: 'purchase',
    amount: -10.0,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Ticket Purchase - Weekly Grand Draw',
    status: 'completed',
  },
]

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tk1',
    lotteryId: 'l1',
    userId: 'u1',
    purchaseDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    ticketNumber: 'A-1001',
  },
  {
    id: 'tk2',
    lotteryId: 'l1',
    userId: 'u1',
    purchaseDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    ticketNumber: 'A-1002',
  },
]

