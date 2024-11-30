'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: '📊'
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: '👥'
  },
  {
    label: 'Tutorials',
    href: '/admin/tutorials',
    icon: '📚'
  },
  {
    label: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: '💳'
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        if (!userData || userData.role !== 'admin') {
          router.push('/login');
          setLoading(false);
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 ${
                  typeof window !== 'undefined' && window.location.pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6 border-t">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {auth.currentUser?.email}
                </p>
                <button
                  onClick={() => auth.signOut()}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
