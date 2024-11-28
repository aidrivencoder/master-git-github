import { Timestamp } from 'firebase/firestore';

export interface Subscription {
  userId: string;
  stripeCustomerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  plan: {
    id: string;
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
  };
  currentPeriod: {
    start: Timestamp;
    end: Timestamp;
  };
  cancelAtPeriodEnd: boolean;
  paymentHistory: PaymentRecord[];
  usage: {
    premiumTutorialsAccessed: number;
    totalTimeSpent: number; // in minutes
    lastUsed: Timestamp;
  };
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  createdAt: Timestamp;
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
  };
}