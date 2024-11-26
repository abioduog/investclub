import React from 'react';
import Header from './Header';
import '../styles/HomePage.css';
import { useToast } from '../contexts/ToastContext';

const HomePage: React.FC = () => {
  const toast = useToast();

  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to CMS OGS 88 Investment Club</h1>
            <p className="hero-subtitle">
              A platform for CMS Grammar School Old Grammarian Society 1988 Set members 
              to pool resources and grow wealth together through strategic investments.
            </p>
          </div>
        </section>

        <section className="info-section">
          <div className="info-content">
            <h2>About Our Investment Club</h2>
            <p>
              Our investment club allows members to make monthly contributions starting 
              from ₦5,000, which are pooled together for various investment opportunities. 
              Members can track their contributions, view investment opportunities, and 
              monitor their investment growth through our platform.
            </p>
            <div className="key-features">
              <div className="feature">
                <h3>Monthly Contributions</h3>
                <p>Minimum ₦5,000 monthly contribution</p>
              </div>
              <div className="feature">
                <h3>Investment Tracking</h3>
                <p>Monitor your contributions and returns</p>
              </div>
              <div className="feature">
                <h3>Collective Growth</h3>
                <p>Access to pooled investment opportunities</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 CMS OGS 88 Alumni Investment Club. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage; 