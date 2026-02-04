import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function TopProducts({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="card">
        <h2>🏆 Top Products</h2>
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No product data available
        </p>
      </div>
    );
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  return (
    <div className="card">
      <h2>🏆 Top Products by Revenue</h2>
      <div style={{ width: '100%', height: 350, marginTop: '1rem' }}>
        <ResponsiveContainer>
          <BarChart data={products} margin={{ bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="productName" 
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={100}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value, name, props) => [
                `$${value.toFixed(2)}`,
                'Revenue',
                `${props.payload.orders} orders`
              ]}
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Bar 
              dataKey="revenue" 
              name="Revenue"
              radius={[8, 8, 0, 0]}
            >
              {products.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ 
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.5rem'
      }}>
        {products.map((product, index) => (
          <div 
            key={product.productId}
            style={{
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '6px',
              borderLeft: `4px solid ${COLORS[index % COLORS.length]}`
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>
              {product.productName}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
              ${product.revenue.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
              {product.orders} orders • {product.quantity} units
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopProducts;
