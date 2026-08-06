import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Grid, Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ANALYTICS_DATA, GET_VENDOR_ANALYTICS_DATA } from '../../graphql/queries';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { TwoFactorAuth } from '../../components/Auth/TwoFactorAuth';
import { MetaHead } from '../../components/SEO/MetaHead';
import { RevenueChart } from '../../components/Dashboard/RevenueChart';

const AnalyticsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [vendorAnalyticsData, setVendorAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, error, loading: analyticsLoading } = useQuery(GET_ANALYTICS_DATA, {
    variables: { userId: session?.user?.id },
    fetchPolicy: 'cache-and-network',
  });

  const { data: vendorData, error: vendorError, loading: vendorLoading } = useQuery(GET_VENDOR_ANALYTICS_DATA, {
    variables: { userId: session?.user?.id },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data) {
      setAnalyticsData(data.getAnalyticsData);
    }
  }, [data]);

  useEffect(() => {
    if (vendorData) {
      setVendorAnalyticsData(vendorData.getVendorAnalyticsData);
    }
  }, [vendorData]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'revenue', headerName: 'Revenue', width: 150 },
    { field: 'expenses', headerName: 'Expenses', width: 150 },
    { field: 'profit', headerName: 'Profit', width: 150 },
  ];

  const vendorColumns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'sales', headerName: 'Sales', width: 150 },
    { field: 'revenue', headerName: 'Revenue', width: 150 },
    { field: 'expenses', headerName: 'Expenses', width: 150 },
  ];

  if (status === 'unauthenticated') {
    router.push('/admin/login');
  }

  if (loading || analyticsLoading || vendorLoading) {
    return <div>Loading...</div>;
  }

  if (error || vendorError) {
    return <div>Error: {error?.message || vendorError?.message}</div>;
  }

  return (
    <ErrorBoundary>
      <MetaHead title="Analytics" />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={analyticsData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={vendorAnalyticsData} columns={vendorColumns} pageSize={5} rowsPerPageOptions={[5]} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <RevenueChart />
        </Grid>
      </Grid>
    </ErrorBoundary>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {},
  };
};

export default AnalyticsPage;