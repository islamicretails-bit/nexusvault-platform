// src/components/admin/SalesAnalyticsChart.ts
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSalesData } from '../api/analytics';
import { Currency } from '../types';
import { formatCurrency } from '../utils/format';

interface SalesData {
  date: string;
  usd: number;
  gbp: number;
  pkr: number;
}

interface SalesAnalyticsChartProps {
  currency: Currency;
}

const SalesAnalyticsChart: React.FC<SalesAnalyticsChartProps> = ({ currency }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(
    ['salesData', currency],
    async () => {
      const response = await getSalesData(currency);
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  useEffect(() => {
    if (data) {
      setSalesData(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const formattedSalesData = salesData.map((item) => ({
    date: item.date,
    [currency]: formatCurrency(item[currency], currency),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedSalesData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={currency} stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesAnalyticsChart;

// src/api/analytics.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/analytics',
});

export const getSalesData = async (currency: Currency) => {
  const response = await api.get(`/sales-data?currency=${currency}`);
  return response.data;
};

// src/utils/format.ts
const formatCurrency = (value: number, currency: Currency) => {
  switch (currency) {
    case 'USD':
      return `$${value.toFixed(2)}`;
    case 'GBP':
      return `£${value.toFixed(2)}`;
    case 'PKR':
      return `₨${value.toFixed(2)}`;
    default:
      return value.toFixed(2);
  }
};

export { formatCurrency };

// src/types/index.ts
export enum Currency {
  USD = 'USD',
  GBP = 'GBP',
  PKR = 'PKR',
}

// src/app/api/analytics/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSalesData } from '../../api/analytics';

const salesDataRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { currency } = req.query;

  if (!currency) {
    return res.status(400).json({ error: 'Currency is required' });
  }

  try {
    const data = await getSalesData(currency as Currency);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch sales data' });
  }
};

export default salesDataRoute;