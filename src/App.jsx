import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import VendorDashboard from './components/VendorDashboard';

/**
 * Main Application Component
 * 
 * The Authenticator component handles:
 * - Sign up form with email verification
 * - Login form
 * - Forgot password flow
 * - Email verification code input
 * - Session management
 */
function App() {
  return (
    <Authenticator
      // Customize which fields appear during sign-up
      signUpAttributes={['email']}
      
      // Optional: Customize the UI components
      components={{
        Header() {
          return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h1>🏪 Vendor Sales & Finance Dashboard</h1>
              <p>Sign in to access your analytics</p>
            </div>
          );
        }
      }}
      
      // Optional: Customize form fields
      formFields={{
        signUp: {
          email: {
            label: 'Email Address',
            placeholder: 'vendor@example.com',
            isRequired: true,
            order: 1
          },
          password: {
            label: 'Password',
            placeholder: 'Enter a strong password',
            isRequired: true,
            order: 2
          },
          confirm_password: {
            label: 'Confirm Password',
            order: 3
          }
        }
      }}
    >
      {/* This component only renders when user is authenticated */}
      <AuthenticatedApp />
    </Authenticator>
  );
}

/**
 * Component that renders only after successful authentication
 * Uses the useAuthenticator hook to access user data and sign out function
 */
function AuthenticatedApp() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <div className="app-container">
      {/* Header with user info and sign out button */}
      <header className="app-header">
        <div className="header-content">
          <h1>Vendor Dashboard</h1>
          <div className="user-info">
            <span className="user-email">
              👤 {user?.signInDetails?.loginId || user?.username}
            </span>
            <button onClick={signOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="app-main">
        <VendorDashboard user={user} />
      </main>
    </div>
  );
}

export default App;

/**
 * UNDERSTANDING THE FLOW:
 * 
 * 1. User visits app → Sees Authenticator (login/signup forms)
 * 2. User signs up → Receives verification email
 * 3. User enters code → Account verified
 * 4. User logs in → JWT tokens generated and stored
 * 5. <AuthenticatedApp> renders → Dashboard visible
 * 6. User clicks "Sign Out" → Returns to login screen
 * 
 * The Authenticator handles ALL authentication UI automatically:
 * - No need to build login forms
 * - No need to handle verification codes manually
 * - Session tokens are managed automatically
 */