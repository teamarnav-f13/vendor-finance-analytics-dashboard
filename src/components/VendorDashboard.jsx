import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { vendorAPI } from '../services/api';
import RevenueChart from './dashboard/RevenueChart';
import TopProducts from './dashboard/TopProducts';
import CommissionChart from './dashboard/CommissionChart';
import ExportReport from './dashboard/ExportReport';

function VendorDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);

      console.log('🔐 Getting authentication session...');

      // Get JWT token for display
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const vendorId = session.tokens?.idToken?.payload?.sub;
      
      setJwtToken(token);

      console.log('✅ JWT Token obtained');
      console.log('👤 Vendor ID:', vendorId);
      console.log('📡 Fetching dashboard data from real backend...');

      // Fetch dashboard and analytics data in parallel
      const [dashboard, analytics] = await Promise.all([
        vendorAPI.getDashboard(),
        vendorAPI.getAnalytics('month')
      ]);

      console.log('✅ Dashboard data received:', dashboard);
      console.log('✅ Analytics data received:', analytics);

      setDashboardData(dashboard);
      setAnalyticsData(analytics);
      setLoading(false);

    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
      setError(error.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard from AWS...</p>
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
          Fetching data from DynamoDB...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Unable to load dashboard</h2>
        <p style={{ color: '#dc3545', marginTop: '1rem' }}>{error}</p>
        <button 
          onClick={loadDashboardData}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          🔄 Retry
        </button>
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <strong>Troubleshooting:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Check if API Gateway is deployed</li>
            <li>Verify Cognito authorizer is configured</li>
            <li>Check browser console (F12) for detailed errors</li>
            <li>Ensure Lambda functions have correct permissions</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="error-container">
        <h2>⚠️ No data available</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Card */}
      <div className="card vendor-info">
        <h2>Welcome, {dashboardData.vendorName}! 👋</h2>
        <p className="vendor-id">Vendor ID: {dashboardData.vendorId}</p>
        <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '0.5rem' }}>
          📊 Last 30 days overview • Updated in real-time
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>💵 Total Sales</h3>
          <p className="metric-value">${dashboardData.totalSales?.toLocaleString() || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Gross Revenue
          </span>
        </div>
        
        <div className="metric-card">
          <h3>💰 Net Revenue</h3>
          <p className="metric-value">${dashboardData.monthlyRevenue?.toLocaleString() || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#28a745' }}>
            After Commission
          </span>
        </div>
        
        <div className="metric-card">
          <h3>✅ Completed Orders</h3>
          <p className="metric-value">{dashboardData.completedOrders || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            {dashboardData.totalTransactions || 0} total orders
          </span>
        </div>
        
        <div className="metric-card">
          <h3>⏳ Pending Orders</h3>
          <p className="metric-value">{dashboardData.pendingOrders || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
            Awaiting processing
          </span>
        </div>

        <div className="metric-card">
          <h3>💸 Commission Paid</h3>
          <p className="metric-value">${dashboardData.totalCommissionPaid?.toLocaleString() || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#dc3545' }}>
            Platform fees (10%)
          </span>
        </div>

        <div className="metric-card">
          <h3>↩️ Refunds</h3>
          <p className="metric-value">{dashboardData.refundedOrders || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            {dashboardData.refundRate || 0}% refund rate
          </span>
        </div>

        <div className="metric-card">
          <h3>📊 Avg Order Value</h3>
          <p className="metric-value">${dashboardData.averageOrderValue?.toFixed(2) || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Per transaction
          </span>
        </div>

        <div className="metric-card">
          <h3>💵 Total Refunded</h3>
          <p className="metric-value">${dashboardData.totalRefunds?.toLocaleString() || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#dc3545' }}>
            Amount refunded
          </span>
        </div>
      </div>

      {/* Charts Section */}
      {analyticsData && (
        <>
          <RevenueChart data={analyticsData.salesTrend} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
            <TopProducts products={analyticsData.topProducts} />
            <CommissionChart data={analyticsData.commissionTrend} />
          </div>
        </>
      )}

      {/* Recent Orders Table */}
      <div className="card">
        <h2>📋 Recent Orders</h2>
        {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.product}</td>
                    <td style={{ fontWeight: '600' }}>${order.amount?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No recent orders
          </p>
        )}
      </div>

      {/* Export Reports */}
      <ExportReport dashboardData={dashboardData} analyticsData={analyticsData} />

      {/* Developer Info */}
      <details className="dev-info">
        <summary>🔧 Developer Info (Click to expand)</summary>
        <div className="dev-content">
          <h3 style={{ color: '#28a745', marginBottom: '1rem' }}>✅ Connected to Real AWS Backend!</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Vendor ID:</strong> 
            <code style={{ 
              marginLeft: '0.5rem', 
              padding: '0.25rem 0.5rem', 
              background: '#f1f3f5',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}>
              {dashboardData.vendorId}
            </code>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>JWT Token:</strong> 
            <span style={{ marginLeft: '0.5rem', color: jwtToken ? '#28a745' : '#dc3545' }}>
              {jwtToken ? '✅ Available' : '❌ Not found'}
            </span>
          </div>
          
          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>📡 API Endpoints Used:</h3>
          <ul style={{ marginLeft: '1.5rem', fontSize: '0.9rem' }}>
            <li><code>GET /dashboard</code> - Main dashboard metrics</li>
            <li><code>GET /analytics?period=month</code> - Charts and trends</li>
            <li><code>GET /orders</code> - Order history</li>
          </ul>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>🏗️ Architecture Flow:</h3>
          <pre style={{ fontSize: '0.75rem', lineHeight: '1.6' }}>
{`1. User logs in → Cognito generates JWT with sub claim
2. Frontend extracts vendor_id from JWT sub claim  
3. API call includes JWT in Authorization header
4. API Gateway validates JWT against Cognito
5. Lambda extracts vendor_id from JWT sub claim
6. DynamoDB queried with vendor_id as partition key
7. Only THIS vendor's data returned
8. Frontend renders charts and metrics`}
          </pre>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>🔐 Security Features:</h3>
          <ul style={{ marginLeft: '1.5rem', fontSize: '0.9rem' }}>
            <li>✅ Cognito JWT authentication</li>
            <li>✅ Vendor data isolation via sub claim</li>
            <li>✅ API Gateway authorizer validation</li>
            <li>✅ No vendor can access other vendor's data</li>
          </ul>
        </div>
      </details>
    </div>
  );
}

export default VendorDashboard;