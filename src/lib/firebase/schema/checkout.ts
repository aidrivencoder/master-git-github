import { Timestamp } from 'firebase/firestore';

export interface CheckoutSession {
  id: string;
  userId: string;
  priceId: string;
  status: 'pending' | 'complete' | 'failed';
  sessionId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const checkoutConverter = {
  toFirestore: (checkout: CheckoutSession) => {
    return {
      ...checkout,
    };
  },
  fromFirestore: (snapshot: any, options: any): CheckoutSession => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      priceId: data.priceId,
      status: data.status,
      sessionId: data.sessionId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
