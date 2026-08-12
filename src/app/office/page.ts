import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { AiOutlineLock } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'react-toastify';
import { getAnalytics, getSales, getLiveTraffic } from '../lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '../components/admin/AdminLayout';
import { LiveTrafficMap } from '../components/admin/LiveTrafficMap';
import { AIOperationsHub } from '../components/admin/AIOperationsHub';
import { SalesAnalyticsChart } from '../components/admin/SalesAnalyticsChart';
import { CustomRequestsTable } from '../components/admin/CustomRequestsTable';
import { PaymentVerificationModal } from '../components/admin/PaymentVerificationModal';

const OfficePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  const [salesData, setSalesData] = useState({});
  const [liveTrafficData, setLiveTrafficData] = useState({});

  const queryClient = useQueryClient();

  const { data: analytics } = useQuery(
    ['analytics'],
    getAnalytics,
    {
      enabled: showAdminPanel,
      onSuccess: (data) => {
        setAnalyticsData(data);
      },
    }
  );

  const { data: sales } = useQuery(
    ['sales'],
    getSales,
    {
      enabled: showAdminPanel,
      onSuccess: (data) => {
        setSalesData(data);
      },
    }
  );

  const { data: liveTraffic } = useQuery(
    ['liveTraffic'],
    getLiveTraffic,
    {
      enabled: showAdminPanel,
      onSuccess: (data) => {
        setLiveTrafficData(data);
      },
    }
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleAdminPasscodeSubmit = (event) => {
    event.preventDefault();
    if (adminPasscode === process.env.ADMIN_OFFICE_PASSCODE) {
      setShowAdminPanel(true);
    } else {
      toast.error('Invalid admin passcode');
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <AdminLayout>
      {showAdminPanel ? (
        <div className="flex flex-col h-screen">
          <header className="bg-gray-900 py-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">NexaVault Enterprise</h1>
              <button
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4">
              <LiveTrafficMap liveTrafficData={liveTrafficData} />
              <AIOperationsHub />
              <SalesAnalyticsChart salesData={salesData} />
              <CustomRequestsTable />
              <PaymentVerificationModal />
            </div>
          </main>
        </div>
      ) : (
        <div className="flex flex-col h-screen justify-center items-center">
          <form onSubmit={handleAdminPasscodeSubmit} className="bg-gray-900 p-4 rounded">
            <h2 className="text-2xl font-bold text-white mb-4">Enter Admin Passcode</h2>
            <input
              type="password"
              value={adminPasscode}
              onChange={(event) => setAdminPasscode(event.target.value)}
              className="bg-gray-800 text-white font-bold py-2 px-4 rounded"
            />
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default OfficePage;