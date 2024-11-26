import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MetricsData {
  totalInvestment: number;
  totalReturns: number;
  roi: number;
  riskScore: number;
  performanceHistory: PerformancePoint[];
}

interface PerformancePoint {
  date: string;
  value: number;
  returns: number;
}

export const InvestmentMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  useEffect(() => {
    fetchMetricsData();
  }, [timeframe]);

  const fetchMetricsData = async () => {
    try {
      // TODO: Implement API call to fetch metrics
      // Mock data for now
      const mockData: MetricsData = {
        totalInvestment: 1000000,
        totalReturns: 150000,
        roi: 15,
        riskScore: 3.5,
        performanceHistory: generateMockPerformanceData()
      };
      setMetrics(mockData);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPerformanceData = () => {
    // Generate mock performance data based on timeframe
    const points: PerformancePoint[] = [];
    const now = new Date();
    const months = timeframe === '1M' ? 1 : 
                  timeframe === '3M' ? 3 : 
                  timeframe === '6M' ? 6 : 12;

    for (let i = 0; i < months; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      points.unshift({
        date: date.toISOString().split('T')[0],
        value: 1000000 + Math.random() * 200000,
        returns: 5 + Math.random() * 10
      });
    }
    return points;
  };

  if (loading) return <div>Loading metrics...</div>;
  if (!metrics) return <div>Failed to load metrics</div>;

  return (
    <div className="investment-metrics">
      <div className="metrics-header">
        <h2>Investment Performance</h2>
        <div className="timeframe-selector">
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(t => (
            <button
              key={t}
              className={`timeframe-button ${timeframe === t ? 'active' : ''}`}
              onClick={() => setTimeframe(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-summary">
        <div className="metric-card">
          <h3>Total Investment</h3>
          <p className="metric-value">₦{metrics.totalInvestment.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <h3>Total Returns</h3>
          <p className="metric-value">₦{metrics.totalReturns.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <h3>ROI</h3>
          <p className="metric-value">{metrics.roi.toFixed(2)}%</p>
        </div>
        <div className="metric-card">
          <h3>Risk Score</h3>
          <p className="metric-value">{metrics.riskScore.toFixed(1)}/5</p>
        </div>
      </div>

      <div className="performance-chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={metrics.performanceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => `₦${(value/1000000).toFixed(1)}M`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke="#2196f3"
              name="Portfolio Value"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="returns"
              stroke="#4caf50"
              name="Returns %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 