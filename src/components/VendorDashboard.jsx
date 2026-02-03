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

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const vendorId = session.tokens?.idToken?.payload?.sub;

      setJwtToken(token);

      console.log('✅ JWT Token obtained');
      console.log('👤 Vendor ID:', vendorId);
      console.log('📡 Fetching dashboard data from real backend...');

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
        <button onClick={loadDashboardData}>🔄 Retry</button>
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

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>💵 Total Sales</h3>
          <p className="metric-value">
            ${dashboardData.totalSales?.toLocaleString() || 0}
          </p>
          <span>Gross Revenue</span>
        </div>

        <div className="metric-card">
          <h3>💰 Net Revenue</h3>
          <p className="metric-value">
            ${dashboardData.netRevenue?.toLocaleString() || 0} {/* ✅ FIX */}
          </p>
          <span>After Commission</span>
        </div>

        <div className="metric-card">
          <h3>✅ Completed Orders</h3>
          <p className="metric-value">
            {dashboardData.completedOrders || 0}
          </p>
          <span>
            {dashboardData.totalTransactions || 0} total orders {/* ✅ FIX */}
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
          <span>Platform fees</span>
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
            ${Number(dashboardData.averageOrderValue || 0).toFixed(2)} {/* ✅ FIX */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <TopProducts products={analyticsData.topProducts} />
            <CommissionChart data={analyticsData.commissionTrend} />
          </div>
        </>
      )}

      {/* Recent Orders */}
      <div className="card">
        <h2>📋 Recent Orders</h2>
        {dashboardData.recentOrders?.length > 0 ? (
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
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.product}</td>
                  <td>${order.amount?.toLocaleString()}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            No recent orders
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

export default VendorDashboard;
