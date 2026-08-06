import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRevenueData } from '../../services/analyticsService';
import { CounterCard } from './CounterCard';
import { KPICounter } from './KPICounter';
import styles from './RevenueChart.module.css';

interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  className?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ className }) => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const data = await getRevenueData();
        setRevenueData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const kpiCounters = [
    {
      title: 'Total Revenue',
      value: revenueData.reduce((acc, current) => acc + current.revenue, 0),
    },
    {
      title: 'Monthly Revenue',
      value: revenueData.slice(-30).reduce((acc, current) => acc + current.revenue, 0),
    },
    {
      title: 'Daily Revenue',
      value: revenueData.slice(-1).reduce((acc, current) => acc + current.revenue, 0),
    },
  ];

  return (
    <div className={className}>
      <h2>Revenue Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className={styles.kpiCounters}>
        {kpiCounters.map((kpi, index) => (
          <KPICounter key={index} title={kpi.title} value={kpi.value} />
        ))}
      </div>
      <CounterCard
        title="Revenue Growth"
        value={revenueData.slice(-1).reduce((acc, current) => acc + current.revenue, 0)}
        percentage={revenueData.slice(-30).reduce((acc, current) => acc + current.revenue, 0) / revenueData.slice(-60).reduce((acc, current) => acc + current.revenue, 0)}
      />
    </div>
  );
};

export default RevenueChart;