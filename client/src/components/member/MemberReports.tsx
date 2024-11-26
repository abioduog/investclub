import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';
import '../../styles/MemberReports.css';

interface Report {
  id: number;
  type: 'contribution' | 'investment' | 'return';
  title: string;
  period: string;
  summary: {
    label: string;
    value: string;
    change?: string;
  }[];
  downloadUrl?: string;
}

const MemberReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contribution' | 'investment' | 'return'>('contribution');
  const toast = useToast();

  // Dummy data - will be replaced with API calls
  const reports: Record<string, Report[]> = {
    contribution: [
      {
        id: 1,
        type: 'contribution',
        title: 'Monthly Contribution Report',
        period: 'March 2024',
        summary: [
          { label: 'Total Contributions', value: '₦15,000' },
          { label: 'Contribution Status', value: 'Up to date' },
          { label: 'Next Due Date', value: 'April 1, 2024' },
        ],
        downloadUrl: '#',
      },
      {
        id: 2,
        type: 'contribution',
        title: 'Quarterly Contribution Summary',
        period: 'Q1 2024',
        summary: [
          { label: 'Total Contributions', value: '₦45,000' },
          { label: 'Average Monthly', value: '₦15,000' },
          { label: 'Consistency Rate', value: '100%' },
        ],
        downloadUrl: '#',
      },
    ],
    investment: [
      {
        id: 3,
        type: 'investment',
        title: 'Investment Performance Report',
        period: 'March 2024',
        summary: [
          { label: 'Total Invested', value: '₦150,000' },
          { label: 'Current Value', value: '₦165,000', change: '+10%' },
          { label: 'Active Investments', value: '2' },
        ],
        downloadUrl: '#',
      },
      {
        id: 4,
        type: 'investment',
        title: 'Portfolio Diversity Report',
        period: 'Q1 2024',
        summary: [
          { label: 'Risk Distribution', value: 'Moderate' },
          { label: 'Sector Coverage', value: '3 sectors' },
          { label: 'Portfolio Health', value: 'Good' },
        ],
        downloadUrl: '#',
      },
    ],
    return: [
      {
        id: 5,
        type: 'return',
        title: 'Returns Analysis Report',
        period: 'March 2024',
        summary: [
          { label: 'Total Returns', value: '₦15,000', change: '+10%' },
          { label: 'ROI', value: '10%' },
          { label: 'Projected Annual', value: '15%' },
        ],
        downloadUrl: '#',
      },
      {
        id: 6,
        type: 'return',
        title: 'Historical Returns Summary',
        period: 'Q1 2024',
        summary: [
          { label: 'Cumulative Returns', value: '₦45,000' },
          { label: 'Best Performing', value: 'Real Estate' },
          { label: 'Average ROI', value: '12%' },
        ],
        downloadUrl: '#',
      },
    ],
  };

  const handleDownload = (report: Report) => {
    // In a real app, this would trigger a file download
    toast.info('Downloading report...');
  };

  const renderReportCard = (report: Report) => (
    <div key={report.id} className="report-card">
      <div className="report-header">
        <h3>{report.title}</h3>
        <span className="period-badge">{report.period}</span>
      </div>
      <div className="report-summary">
        {report.summary.map((item, index) => (
          <div key={index} className="summary-item">
            <span className="label">{item.label}</span>
            <div className="value-container">
              <span className="value">{item.value}</span>
              {item.change && (
                <span className={`change ${item.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {item.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        className="download-button"
        onClick={() => handleDownload(report)}
        aria-label={`Download ${report.title} for ${report.period}`}
      >
        Download Report
      </button>
    </div>
  );

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>My Reports</h2>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'contribution' ? 'active' : ''}`}
            onClick={() => setActiveTab('contribution')}
            aria-label="View contribution reports"
          >
            Contribution History
          </button>
          <button
            className={`tab-button ${activeTab === 'investment' ? 'active' : ''}`}
            onClick={() => setActiveTab('investment')}
            aria-label="View investment reports"
          >
            Investment Performance
          </button>
          <button
            className={`tab-button ${activeTab === 'return' ? 'active' : ''}`}
            onClick={() => setActiveTab('return')}
            aria-label="View returns reports"
          >
            Returns Analysis
          </button>
        </div>

        <div className="reports-grid">
          {reports[activeTab].map(report => renderReportCard(report))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberReports; 