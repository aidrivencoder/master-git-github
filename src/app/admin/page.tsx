'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, QueryDocumentSnapshot } from 'firebase/firestore';
import { FirebaseUser } from '@/lib/firebase/schema/users';
import { Tutorial } from '@/lib/firebase/schema/tutorials';
import { Subscription } from '@/lib/firebase/schema/subscriptions';

interface AdminStats {
  totalUsers: number;
  premiumUsers: number;
  totalTutorials: number;
  premiumTutorials: number;
  activeSubscriptions: number;
  recentUsers: FirebaseUser[];
}

async function getAdminStats(): Promise<AdminStats> {
  try {
    // Fetch users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as FirebaseUser;
    });
    
    // Fetch tutorials
    const tutorialsSnapshot = await getDocs(collection(db, 'tutorials'));
    const tutorials = tutorialsSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as Tutorial;
    });
    
    // Fetch active subscriptions
    const subscriptionsQuery = query(
      collection(db, 'subscriptions'),
      where('status', '==', 'active')
    );
    const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
    const subscriptions = subscriptionsSnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as unknown as Subscription;
    });

    return {
      totalUsers: usersSnapshot.size,
      premiumUsers: users.filter(user => user.subscription?.tier === 'premium').length,
      totalTutorials: tutorials.length,
      premiumTutorials: tutorials.filter(tutorial => tutorial.isPremium).length,
      activeSubscriptions: subscriptions.length,
      recentUsers: users
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .slice(0, 5)
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalUsers: 0,
      premiumUsers: 0,
      totalTutorials: 0,
      premiumTutorials: 0,
      activeSubscriptions: 0,
      recentUsers: []
    };
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    premiumUsers: 0,
    totalTutorials: 0,
    premiumTutorials: 0,
    activeSubscriptions: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminStats = await getAdminStats();
        setStats(adminStats);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Premium Users</h3>
          <p className="text-3xl font-bold">{stats.premiumUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Tutorials</h3>
          <div>
            <p className="text-3xl font-bold">{stats.totalTutorials}</p>
            <p className="text-sm text-gray-500">
              {stats.premiumTutorials} Premium
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Subscriptions</h3>
          <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Subscription</th>
                <th className="text-left py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.displayName}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.subscription.tier}</td>
                  <td className="py-2">
                    {new Date(user.createdAt.toMillis()).toLocaleDateString()}
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
