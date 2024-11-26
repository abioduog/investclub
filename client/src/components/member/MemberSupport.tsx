import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/AdminPages.css';
import '../../styles/MemberSupport.css';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'contributions' | 'investments';
}

interface Inquiry {
  id: number;
  subject: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  date: string;
  response?: string;
}

const MemberSupport: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'inquiries'>('faq');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newInquiry, setNewInquiry] = useState({ subject: '', message: '' });
  
  // Dummy data - will be replaced with API calls
  const faqs: FAQ[] = [
    {
      id: 1,
      category: 'general',
      question: 'What is CMS OGS 88 Investment Club?',
      answer: 'CMS OGS 88 Investment Club is an exclusive investment group for CMS Grammar School Old Grammarian Society 1988 Set members. The club pools resources for strategic investments and wealth creation.',
    },
    {
      id: 2,
      category: 'contributions',
      question: 'What is the minimum monthly contribution?',
      answer: 'The minimum monthly contribution is ₦5,000. Members can contribute more if they wish to increase their investment portfolio.',
    },
    {
      id: 3,
      category: 'investments',
      question: 'How are investment decisions made?',
      answer: 'Investment decisions are made collectively by the club\'s investment committee after thorough research and analysis. Members are informed of opportunities and can choose to participate.',
    },
    // Add more FAQs...
  ];

  const [inquiries] = useState<Inquiry[]>([
    {
      id: 1,
      subject: 'Investment Query',
      message: 'I would like to know more about the current real estate investment opportunity.',
      status: 'answered',
      date: '2024-03-15',
      response: 'Thank you for your inquiry. The real estate investment details have been sent to your email.',
    },
    {
      id: 2,
      subject: 'Contribution Confirmation',
      message: 'I made a contribution yesterday but haven\'t received a confirmation.',
      status: 'pending',
      date: '2024-03-16',
    },
  ]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiry.subject.trim() || !newInquiry.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    // In a real app, this would be an API call
    toast.success('Your inquiry has been submitted successfully');
    setNewInquiry({ subject: '', message: '' });
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderFAQSection = () => (
    <div className="support-section">
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          aria-label="Search FAQs"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
          aria-label="Filter FAQ by category"
        >
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="contributions">Contributions</option>
          <option value="investments">Investments</option>
        </select>
      </div>

      <div className="faq-list">
        {filteredFaqs.map(faq => (
          <details key={faq.id} className="faq-item">
            <summary className="faq-question">
              {faq.question}
              <span className="category-badge">{faq.category}</span>
            </summary>
            <div className="faq-answer">{faq.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="support-section">
      <div className="contact-form-container">
        <h3>Submit an Inquiry</h3>
        <form onSubmit={handleInquirySubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={newInquiry.subject}
              onChange={(e) => setNewInquiry({ ...newInquiry, subject: e.target.value })}
              placeholder="Enter the subject of your inquiry"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={newInquiry.message}
              onChange={(e) => setNewInquiry({ ...newInquiry, message: e.target.value })}
              placeholder="Describe your inquiry in detail"
              rows={6}
              required
            />
          </div>
          <button type="submit" className="submit-button">Submit Inquiry</button>
        </form>

        <div className="contact-info">
          <h3>Other Ways to Contact Us</h3>
          <div className="contact-methods">
            <div className="contact-method">
              <h4>Email</h4>
              <p>support@cmsogs88.com</p>
            </div>
            <div className="contact-method">
              <h4>Phone</h4>
              <p>+234 XXX XXX XXXX</p>
            </div>
            <div className="contact-method">
              <h4>Office Hours</h4>
              <p>Monday - Friday: 9:00 AM - 5:00 PM WAT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInquiriesSection = () => (
    <div className="support-section">
      <div className="inquiries-list">
        {inquiries.map(inquiry => (
          <div key={inquiry.id} className="inquiry-card">
            <div className="inquiry-header">
              <h3>{inquiry.subject}</h3>
              <span className={`status-badge ${inquiry.status}`}>
                {inquiry.status}
              </span>
            </div>
            <div className="inquiry-content">
              <p className="inquiry-message">{inquiry.message}</p>
              {inquiry.response && (
                <div className="inquiry-response">
                  <h4>Response:</h4>
                  <p>{inquiry.response}</p>
                </div>
              )}
            </div>
            <div className="inquiry-footer">
              <span className="inquiry-date">Submitted on {inquiry.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="member">
      <div className="admin-page">
        <div className="page-header">
          <h2>Support</h2>
        </div>

        <div className="support-container">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </button>
            <button
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Admin
            </button>
            <button
              className={`tab-button ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('inquiries')}
            >
              My Inquiries
            </button>
          </div>

          <div className="support-content">
            {activeTab === 'faq' && renderFAQSection()}
            {activeTab === 'contact' && renderContactSection()}
            {activeTab === 'inquiries' && renderInquiriesSection()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberSupport; 