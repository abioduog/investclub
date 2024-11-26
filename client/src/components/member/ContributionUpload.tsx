import React, { useState } from 'react';
import { FileUpload } from '../common/FileUpload';
import { uploadFile } from '../../services/fileUploadService';
import { useToast } from '../../contexts/ToastContext';

interface ContributionDetails {
  amount: number;
  date: string;
  proofUrl?: string;
}

export const ContributionUpload: React.FC = () => {
  const [contribution, setContribution] = useState<ContributionDetails>({
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const toast = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      const response = await uploadFile(file, 'contribution');
      setContribution(prev => ({
        ...prev,
        proofUrl: response.url
      }));
      toast.success('Proof of payment uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload proof of payment');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribution.proofUrl) {
      toast.error('Please upload proof of payment');
      return;
    }
    try {
      // API call to submit contribution
      toast.success('Contribution submitted successfully');
    } catch (error) {
      toast.error('Failed to submit contribution');
    }
  };

  return (
    <div className="contribution-upload">
      <h2>Submit Contribution</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (₦)</label>
          <input
            type="number"
            id="amount"
            value={contribution.amount}
            onChange={(e) => setContribution(prev => ({
              ...prev,
              amount: parseFloat(e.target.value)
            }))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={contribution.date}
            onChange={(e) => setContribution(prev => ({
              ...prev,
              date: e.target.value
            }))}
            required
          />
        </div>
        <div className="form-group">
          <label>Proof of Payment</label>
          <FileUpload
            acceptedTypes={['image/*', 'application/pdf']}
            maxSizeMB={2}
            onFileSelect={handleFileUpload}
            label="Upload Proof of Payment"
          />
          {contribution.proofUrl && (
            <a href={contribution.proofUrl} target="_blank" rel="noopener noreferrer">
              View uploaded proof
            </a>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Submit Contribution
        </button>
      </form>
    </div>
  );
}; 