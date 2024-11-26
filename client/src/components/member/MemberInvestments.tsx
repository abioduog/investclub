import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';
import InvestmentParticipationModal from '../modals/InvestmentParticipationModal';
import type { ParticipationData } from '../modals/InvestmentParticipationModal';
import '../../styles/AdminPages.css';

interface Investment {
  id: number;
  title: string;
  amount: number;
  joined_at: string;
  status: 'pending' | 'active' | 'completed';
  returns_amount: number | null;
  investment_status: 'open' | 'closed' | 'completed';
  expected_returns: string;
  duration: string;
}

interface InvestmentOpportunity {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  minimum_investment: number;
  expected_returns: string;
  duration: string;
  risk_level: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
}

interface PerformanceMetrics {
  total_participants: number;
  total_invested: number;
  funding_percentage: number;
}

const MemberInvestments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'opportunities'>('current');
  const toast = useToast();
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [metrics, setMetrics] = useState<{ [key: number]: PerformanceMetrics }>({});

  // Fetch user's investments
  const fetchInvestments = async () => {
    try {
      // Replace 1 with actual user ID from auth context
      const response = await fetch('/api/investments/user/1/participations');
      const data = await response.json();
      if (response.ok) {
        setInvestments(data);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to fetch investments');
    }
  };

  // Fetch investment opportunities
  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/investments');
      const data = await response.json();
      if (response.ok) {
        setOpportunities(data);
        // Fetch performance metrics for each opportunity
        data.forEach((opportunity: InvestmentOpportunity) => {
          fetchPerformanceMetrics(opportunity.id);
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to fetch opportunities');
    }
  };

  // Fetch performance metrics for an investment
  const fetchPerformanceMetrics = async (investmentId: number) => {
    try {
      const response = await fetch(`/api/investments/${investmentId}/performance`);
      const data = await response.json();
      if (response.ok) {
        setMetrics(prev => ({ ...prev, [investmentId]: data }));
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchInvestments(), fetchOpportunities()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleInvest = (opportunity: InvestmentOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleParticipationSubmit = async (data: ParticipationData) => {
    try {
      const response = await fetch(`/api/investments/${data.investment_id}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID from auth context
          amount: data.amount,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Investment participation submitted');
        fetchInvestments(); // Refresh investments list
        fetchPerformanceMetrics(data.investment_id); // Refresh metrics
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit investment');
      throw error; // Re-throw to be handled by the modal
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="member">
        <div className="loading-spinner">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>My Investments</h2>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Invested</h3>
            <p className="amount">
              ₦{investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </p>
            <p className="subtitle">Across {investments.length} investments</p>
          </div>
          <div className="summary-card">
            <h3>Active Investments</h3>
            <p className="amount">
              {investments.filter(inv => inv.status === 'active').length}
            </p>
          </div>
          <div className="summary-card">
            <h3>Total Returns</h3>
            <p className="amount">
              ₦{investments
                .reduce((sum, inv) => sum + (inv.returns_amount || 0), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Investments
          </button>
          <button
            className={`tab-button ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => setActiveTab('opportunities')}
          >
            Investment Opportunities
          </button>
        </div>

        {activeTab === 'current' ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Investment</th>
                  <th>Amount</th>
                  <th>Join Date</th>
                  <th>Duration</th>
                  <th>Expected Return</th>
                  <th>Current Returns</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map(investment => (
                  <tr key={investment.id}>
                    <td>{investment.title}</td>
                    <td>₦{investment.amount.toLocaleString()}</td>
                    <td>{new Date(investment.joined_at).toLocaleDateString()}</td>
                    <td>{investment.duration}</td>
                    <td>{investment.expected_returns}</td>
                    <td>
                      {investment.returns_amount
                        ? `₦${investment.returns_amount.toLocaleString()}`
                        : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${investment.status}`}>
                        {investment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="opportunities-grid">
            {opportunities.map(opportunity => (
              <div key={opportunity.id} className="opportunity-card">
                <div className="opportunity-header">
                  <h3>{opportunity.title}</h3>
                  <span className={`risk-badge ${opportunity.risk_level}`}>
                    {opportunity.risk_level} risk
                  </span>
                </div>
                <p className="opportunity-description">{opportunity.description}</p>
                <div className="opportunity-details">
                  <div className="detail-item">
                    <span className="label">Target Amount:</span>
                    <span className="value">₦{opportunity.target_amount.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Minimum Investment:</span>
                    <span className="value">₦{opportunity.minimum_investment.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Expected Returns:</span>
                    <span className="value">{opportunity.expected_returns}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">{opportunity.duration}</span>
                  </div>
                  {metrics[opportunity.id] && (
                    <div className="metrics-bar">
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{ width: `${metrics[opportunity.id].funding_percentage}%` }}
                        />
                      </div>
                      <span className="progress-text">
                        {metrics[opportunity.id].funding_percentage}% funded
                      </span>
                      <span className="participants-count">
                        {metrics[opportunity.id].total_participants} participants
                      </span>
                    </div>
                  )}
                </div>
                <button
                  className="invest-button"
                  onClick={() => handleInvest(opportunity)}
                  disabled={opportunity.status === 'closed'}
                >
                  {opportunity.status === 'open' ? 'Invest Now' : 'Closed'}
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedOpportunity && (
          <InvestmentParticipationModal
            isOpen={true}
            onClose={() => setSelectedOpportunity(null)}
            onSubmit={handleParticipationSubmit}
            investment={{
              id: selectedOpportunity.id,
              title: selectedOpportunity.title,
              minimumInvestment: `₦${selectedOpportunity.minimum_investment.toLocaleString()}`,
              expectedReturns: selectedOpportunity.expected_returns,
              duration: selectedOpportunity.duration,
              riskLevel: selectedOpportunity.risk_level,
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemberInvestments; 