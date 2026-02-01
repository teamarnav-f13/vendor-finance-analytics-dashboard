function ExportReport({ dashboardData, analyticsData }) {
  
  const exportToCSV = () => {
    if (!dashboardData || !dashboardData.recentOrders) {
      alert('No data to export');
      return;
    }

    // Create CSV header
    const headers = ['Order ID', 'Date', 'Product', 'Gross Amount', 'Commission (10%)', 'Net Amount', 'Status'];
    
    // Create CSV rows
    const rows = dashboardData.recentOrders.map(order => {
      const commission = (order.amount * 0.10).toFixed(2);
      const netAmount = (order.amount * 0.90).toFixed(2);
      
      return [
        order.id,
        order.date,
        `"${order.product}"`,  // Wrap in quotes in case of commas
        order.amount.toFixed(2),
        commission,
        netAmount,
        order.status
      ].join(',');
    });

    // Combine header and rows
    let csvContent = headers.join(',') + '\n' + rows.join('\n');

    // Add summary at the top
    const summary = [
      `Vendor Finance Report - Generated ${new Date().toLocaleString()}`,
      '',
      `Total Sales,${dashboardData.totalSales}`,
      `Net Revenue,${dashboardData.monthlyRevenue}`,
      `Commission Paid,${dashboardData.totalCommissionPaid}`,
      `Completed Orders,${dashboardData.completedOrders}`,
      `Pending Orders,${dashboardData.pendingOrders}`,
      `Refunded Orders,${dashboardData.refundedOrders}`,
      '',
      'Order Details:'
    ].join('\n');

    csvContent = summary + '\n' + csvContent;

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('✅ CSV exported successfully');
  };

  const exportToJSON = () => {
    if (!dashboardData) {
      alert('No data to export');
      return;
    }

    const exportData = {
      generatedAt: new Date().toISOString(),
      period: '30days',
      summary: {
        vendorId: dashboardData.vendorId,
        vendorName: dashboardData.vendorName,
        totalSales: dashboardData.totalSales,
        netRevenue: dashboardData.monthlyRevenue,
        commissionPaid: dashboardData.totalCommissionPaid,
        completedOrders: dashboardData.completedOrders,
        pendingOrders: dashboardData.pendingOrders,
        refundedOrders: dashboardData.refundedOrders,
        refundRate: dashboardData.refundRate,
        averageOrderValue: dashboardData.averageOrderValue
      },
      recentOrders: dashboardData.recentOrders,
      analytics: analyticsData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('✅ JSON exported successfully');
  };

  return (
    <div className="card">
      <h2>📥 Export Reports</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>
        Download your financial data for record keeping and analysis
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={exportToCSV}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>📊</span>
          <span>Export to CSV</span>
        </button>
        <button 
          onClick={exportToJSON}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>📄</span>
          <span>Export to JSON</span>
        </button>
      </div>
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: '#e3f2fd', 
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#1976d2'
      }}>
        💡 <strong>Tip:</strong> CSV files can be opened in Excel or Google Sheets. JSON files are ideal for developers and data analysis tools.
      </div>
    </div>
  );
}

export default ExportReport;