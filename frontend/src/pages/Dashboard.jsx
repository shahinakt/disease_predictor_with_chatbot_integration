function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let lastPrediction = null;
  try {
    lastPrediction = JSON.parse(localStorage.getItem('last_prediction') || 'null');
  } catch (e) { void e; }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Welcome, {user.name ? user.name : user.email}!</h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Your health dashboard
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {/* Dynamic counts read from localStorage */}
        {(() => {
          let predCount = 0;
          try {
            const raw = localStorage.getItem('predictions_history');
            const arr = raw ? JSON.parse(raw) : [];
            predCount = arr.length;
            if (predCount === 0 && localStorage.getItem('last_prediction')) predCount = 1;
          } catch { predCount = 0; }
          return <DashboardCard title="Recent Predictions" count={String(predCount)} />;
        })()}

        {(() => {
          let reportsCount = 0;
          try {
            const raw = localStorage.getItem('reports_history');
            const arr = raw ? JSON.parse(raw) : [];
            reportsCount = arr.length;
          } catch { reportsCount = 0; }
          return <DashboardCard title="Uploaded Reports" count={String(reportsCount)} />;
        })()}

        {(() => {
          let sessions = 0;
          try {
            const raw = localStorage.getItem('chat_sessions');
            const arr = raw ? JSON.parse(raw) : [];
            sessions = arr.length;
          } catch { sessions = 0; }
          return <DashboardCard title="Chat Sessions" count={String(sessions)} />;
        })()}

        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>Last prediction</h3>
          {lastPrediction ? (
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111' }}>{(lastPrediction.predicted_disease || lastPrediction.prediction || lastPrediction.disease || 'Unknown')}</div>
              <div style={{ color: '#6b7280', marginTop: 6 }}>Confidence: {(lastPrediction.confidence || lastPrediction.prediction_confidence || 0).toFixed(2)}</div>
              {lastPrediction.probabilities && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Top probabilities</div>
                  <ul style={{ marginTop: 6 }}>
                    {Object.entries(lastPrediction.probabilities).sort((a,b) => b[1]-a[1]).slice(0,5).map(([d,p]) => (
                      <li key={d} style={{ fontSize: 13 }}>{d}: {(p*100).toFixed(1)}%</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#6b7280' }}>No recent prediction</div>
          )}
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>Mental tests</h3>
          {(() => {
            let last = null;
            try { last = JSON.parse(localStorage.getItem('last_mental_tests') || 'null'); } catch (e) { void e; }
            if (!last) return <div style={{ color: '#6b7280' }}>No recent mental tests</div>;
            return (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{last.test}</div>
                <div style={{ color: '#6b7280', marginTop: 6 }}>{last.label} — score {last.score}</div>
                <div style={{ marginTop: 8 }}>
                  <a href="/mental-tests" style={{ color: '#2563eb' }}>View / retake</a>
                </div>
              </div>
            );
          })()}</div>
      </div>
    </div>
  );
}

function DashboardCard({ title, count }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2563eb' }}>{count}</p>
    </div>
  );
}

export default Dashboard;