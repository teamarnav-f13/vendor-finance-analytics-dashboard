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
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // ✅ New state

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]); // ✅ Reload when period changes

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);

      console.log('🔐 Getting authentication session...');

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const vendorId = session.tokens?.idToken?.payload?.sub;

      setJwtToken(token);

      console.log('✅ JWT Token obtained');
      console.log('👤 Vendor ID:', vendorId);
      console.log('📡 Fetching dashboard data for period:', selectedPeriod);

      const [dashboard, analytics] = await Promise.all([
        vendorAPI.getDashboard(selectedPeriod), // ✅ Pass period
        vendorAPI.getAnalytics(selectedPeriod)   // ✅ Pass period
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
            fontWeight: '600'
          }}
        >
          🔄 Retry
        </button>
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

      {/* Welcome Card with Date Filter */}
      <div className="card vendor-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Welcome, {dashboardData.vendorName}! 👋</h2>
            <p className="vendor-id">Vendor ID: {dashboardData.vendorId}</p>
          </div>
          
          {/* ✅ Date Range Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSelectedPeriod('week')}
              style={{
                padding: '0.5rem 1rem',
                background: selectedPeriod === 'week' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: selectedPeriod === 'week' ? '#667eea' : '#fff',
                border: selectedPeriod === 'week' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedPeriod === 'week' ? '600' : '500',
                transition: 'all 0.2s'
              }}
            >
              📅 Last 7 Days
            </button>
            <button 
              onClick={() => setSelectedPeriod('month')}
              style={{
                padding: '0.5rem 1rem',
                background: selectedPeriod === 'month' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: selectedPeriod === 'month' ? '#667eea' : '#fff',
                border: selectedPeriod === 'month' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedPeriod === 'month' ? '600' : '500',
                transition: 'all 0.2s'
              }}
            >
              📅 Last 30 Days
            </button>
            <button 
              onClick={() => setSelectedPeriod('quarter')}
              style={{
                padding: '0.5rem 1rem',
                background: selectedPeriod === 'quarter' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: selectedPeriod === 'quarter' ? '#667eea' : '#fff',
                border: selectedPeriod === 'quarter' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedPeriod === 'quarter' ? '600' : '500',
                transition: 'all 0.2s'
              }}
            >
              📅 Last 90 Days
            </button>
            <button 
              onClick={() => setSelectedPeriod('all')}
              style={{
                padding: '0.5rem 1rem',
                background: selectedPeriod === 'all' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: selectedPeriod === 'all' ? '#667eea' : '#fff',
                border: selectedPeriod === 'all' ? '2px solid #fff' : '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: selectedPeriod === 'all' ? '600' : '500',
                transition: 'all 0.2s'
              }}
            >
              📅 All Time
            </button>
          </div>
        </div>
        <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '0.5rem' }}>
          📊 {getPeriodLabel(selectedPeriod)} • Updated in real-time
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>💵 Gross Revenue</h3>
          <p className="metric-value">
            ${dashboardData.totalSales?.toLocaleString() || 0}
          </p>
          <span>Gross Revenue</span>
        </div>

        <div className="metric-card">
          <h3>💰 Net Revenue</h3>
          <p className="metric-value">
            ${dashboardData.monthlyRevenue?.toLocaleString() || 0}
          </p>
          <span style={{ fontSize: '0.85rem', color: '#28a745' }}>
            After Commission
          </span>
        </div>

        <div className="metric-card">
          <h3>✅ Completed Orders</h3>
          <p className="metric-value">{dashboardData.completedOrders || 0}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Successfully processed
          </span>
        </div>

        <div className="metric-card">
          <h3>⏳ Pending Orders</h3>
          <p className="metric-value">
            {dashboardData.pendingOrders || 0}
          </p>
          <span>Awaiting processing</span>
        </div>

        <div className="metric-card">
          <h3>💸 Commission Paid</h3>
          <p className="metric-value">
            ${dashboardData.totalCommissionPaid?.toLocaleString() || 0}
          </p>
          <span>Platform fees (10%)</span>
        </div>

        <div className="metric-card">
          <h3>↩️ Refunds</h3>
          <p className="metric-value">
            {dashboardData.refundedOrders || 0}
          </p>
          <span>
            {dashboardData.refundRate || 0}% refund rate
          </span>
        </div>

        <div className="metric-card">
          <h3>📊 Avg Order Value</h3>
          <p className="metric-value">
            ${Number(dashboardData.averageOrderValue || 0).toFixed(2)}
          </p>
          <span>Per transaction</span>
        </div>

        <div className="metric-card">
          <h3>💵 Total Refunded</h3>
          <p className="metric-value">
            ${dashboardData.totalRefunds?.toLocaleString() || 0}
          </p>
          <span>Amount refunded</span>
        </div>
      </div>

      {/* Charts */}
      {analyticsData && (
        <>
          <RevenueChart data={analyticsData.salesTrend} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
            <TopProducts products={analyticsData.topProducts} />
            <CommissionChart data={analyticsData.commissionTrend} />
          </div>
        </>
      )}

      {/* Recent Orders */}
      <div className="card">
        <h2>📋 Recent Orders</h2>
        {dashboardData.recentOrders?.length > 0 ? (
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
                    <td style={{ fontFamily: 'monospace' }}>{order.id}</td>
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
            No orders in this period
          </p>
        )}
      </div>

      <ExportReport
        dashboardData={dashboardData}
        analyticsData={analyticsData}
      />
    </div>
  );
}

// ✅ Helper function for period labels
function getPeriodLabel(period) {
  const labels = {
    'week': 'Last 7 days overview',
    'month': 'Last 30 days overview',
    'quarter': 'Last 90 days overview',
    'all': 'All-time overview'
  };
  return labels[period] || 'Last 30 days overview';
}

export default VendorDashboard;
