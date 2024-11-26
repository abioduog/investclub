import React, { useState, useEffect } from 'react';
import { uploadFile } from '../../services/fileUploadService';
import { useToast } from '../../contexts/ToastContext';

interface Contribution {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'validated' | 'rejected';
  proofUrl?: string;
}

export const ContributionValidation: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const toast = useToast();

  const handleValidateContribution = async (id: string) => {
    try {
      // API call to validate contribution
      toast.success('Contribution validated successfully');
    } catch (error) {
      toast.error('Failed to validate contribution');
    }
  };

  const handleRejectContribution = async (id: string) => {
    try {
      // API call to reject contribution
      toast.success('Contribution rejected');
    } catch (error) {
      toast.error('Failed to reject contribution');
    }
  };

  return (
    <div className="contribution-validation">
      <h2>Validate Contributions</h2>
      <div className="contributions-list">
        {contributions.map((contribution) => (
          <div key={contribution.id} className="contribution-item">
            <div className="contribution-details">
              <p>Amount: ₦{contribution.amount}</p>
              <p>Date: {contribution.date}</p>
              <p>Status: {contribution.status}</p>
              {contribution.proofUrl && (
                <a href={contribution.proofUrl} target="_blank" rel="noopener noreferrer">
                  View Proof
                </a>
              )}
            </div>
            <div className="validation-actions">
              {contribution.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleValidateContribution(contribution.id)}
                    className="validate-btn"
                  >
                    Validate
                  </button>
                  <button
                    onClick={() => handleRejectContribution(contribution.id)}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 