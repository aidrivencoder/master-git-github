'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { Subscription } from '@/lib/firebase/schema/subscriptions';

// Extend the Subscription type to include Firestore document id
interface SubscriptionWithId extends Subscription {
  id: string;
}

export default function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'canceled' | 'past_due'>('all');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const subscriptionsQuery = query(
          collection(db, 'subscriptions'),
          orderBy('currentPeriod.end', 'desc')
        );
        const snapshot = await getDocs(subscriptionsQuery);
        const fetchedSubscriptions = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          } as SubscriptionWithId;
        });
        setSubscriptions(fetchedSubscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (filter === 'all') return true;
    return subscription.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    if (timestamp instanceof Timestamp) {
      return new Date(timestamp.toMillis()).toLocaleDateString();
    }
    // Handle if the timestamp is already a number
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleDateString();
    }
    // Handle if the timestamp is a Date object
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    // Handle if the timestamp has seconds and nanoseconds
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return 'Invalid Date';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <div className="flex items-center space-x-4">
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'canceled' | 'past_due')}
          >
            <option value="all">All Subscriptions</option>
            <option value="active">Active</option>
            <option value="canceled">Canceled</option>
            <option value="past_due">Past Due</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscription.stripeCustomerId}</div>
                    <div className="text-sm text-gray-500">{subscription.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscription.plan?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${subscription.plan?.price || 0}/{subscription.plan?.interval || 'month'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                    {subscription.cancelAtPeriodEnd && (
                      <span className="ml-2 text-xs text-gray-500">
                        (Cancels at period end)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      Start: {formatDate(subscription.currentPeriod?.start)}
                    </div>
                    <div>
                      End: {formatDate(subscription.currentPeriod?.end)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      Tutorials: {subscription.usage?.premiumTutorialsAccessed || 0}
                    </div>
                    <div>
                      Time: {Math.round((subscription.usage?.totalTimeSpent || 0) / 60)}h
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => {
                        // TODO: Implement view details functionality
                        console.log('View details for:', subscription.stripeCustomerId);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
