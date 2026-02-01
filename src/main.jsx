import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App.jsx';
import awsConfig from './aws-config.js';
import './styles/App.css';

/**
 * Configure Amplify BEFORE rendering the app
 * This is critical - Amplify must be configured before any components mount
 */
Amplify.configure(awsConfig);

/**
 * Render the React application
 * StrictMode helps catch potential issues during development
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * WHY THIS ORDER MATTERS:
 * - Amplify.configure() must run before App renders
 * - If App tries to use Amplify before configuration, you get errors
 * - This is a common cause of "blank screen" issues
 */