import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastProvider } from './contexts/ToastContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);