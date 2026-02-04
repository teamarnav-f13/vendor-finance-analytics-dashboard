import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h2>📈 Revenue Trend</h2>
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No revenue data available
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📈 Revenue Trend</h2>
      <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
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
              formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#667eea" 
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#667eea', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        background: '#f8f9fa', 
        borderRadius: '6px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        💡 Shows your net revenue (after commission) over the selected period
      </div>
    </div>
  );
}

export default RevenueChart;
