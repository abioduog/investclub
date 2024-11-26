import React, { useState, useEffect } from 'react';
import { fileUploadService } from '../../services/fileUploadService';
import { useToast } from '../../contexts/ToastContext';

interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  transferDate: string;
  bankName: string;
  accountNumber: string;
  proofFileId: string;
  status: 'pending' | 'validated' | 'rejected';
}

export const ContributionValidation: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // TODO: Fetch pending contributions
    setLoading(false);
  }, []);

  const handleValidate = async (contributionId: string) => {
    try {
      // TODO: Implement validation API call
      setContributions(prev => 
        prev.map(c => 
          c.id === contributionId 
            ? { ...c, status: 'validated' } 
            : c
        )
      );
      toast.success('Contribution validated successfully');
    } catch (error) {
      toast.error('Failed to validate contribution');
    }
  };

  const handleReject = async (contributionId: string) => {
    try {
      // TODO: Implement rejection API call
      setContributions(prev => 
        prev.map(c => 
          c.id === contributionId 
            ? { ...c, status: 'rejected' } 
            : c
        )
      );
      toast.success('Contribution rejected successfully');
    } catch (error) {
      toast.error('Failed to reject contribution');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="contribution-validation">
      <h2>Pending Contributions</h2>
      <div className="contributions-list">
        {contributions.map(contribution => (
          <div key={contribution.id} className="contribution-item">
            <div className="contribution-details">
              <h3>{contribution.memberName}</h3>
              <p>Amount: ₦{contribution.amount}</p>
              <p>Date: {new Date(contribution.transferDate).toLocaleDateString()}</p>
              <p>Bank: {contribution.bankName}</p>
              <p>Account: {contribution.accountNumber}</p>
              <a 
                href={`/api/files/${contribution.proofFileId}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Proof
              </a>
            </div>
            <div className="contribution-actions">
              <button 
                onClick={() => handleValidate(contribution.id)}
                className="validate-button"
              >
                Validate
              </button>
              <button 
                onClick={() => handleReject(contribution.id)}
                className="reject-button"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 