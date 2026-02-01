import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CommissionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h2>💰 Commission Trend</h2>
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No commission data available
        </p>
      </div>
    );
  }

  // Calculate total commission
  const totalCommission = data.reduce((sum, item) => sum + item.commission, 0);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>💰 Platform Commission Paid</h2>
        <div style={{ 
          padding: '0.5rem 1rem', 
          background: '#fff3cd', 
          borderRadius: '6px',
          fontWeight: 'bold',
          color: '#856404'
        }}>
          Total: ${totalCommission.toFixed(2)}
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Commission']}
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="commission" 
              stroke="#f59e0b" 
              strokeWidth={2}
              fill="url(#colorCommission)"
              name="Platform Commission (10%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: '#fff3cd', 
        borderRadius: '6px',
        fontSize: '0.9rem',
        color: '#856404'
      }}>
        ℹ️ Platform charges 10% commission on all completed sales
      </div>
    </div>
  );
}

export default CommissionChart;