import React, { useState } from 'react';

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptoms || !symptoms.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch(`http://127.0.0.1:8000/predict/predict?locale=${encodeURIComponent(symptoms)}`, {
        method: 'POST'
      });
      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(err || 'Prediction failed');
      }
      const data = await resp.json();
      setResult(data || {});
      // persist last prediction for dashboard
          try {
            localStorage.setItem('last_prediction', JSON.stringify(data || {}));
            // also append to predictions history
            const raw = localStorage.getItem('predictions_history');
            const arr = raw ? JSON.parse(raw) : [];
            arr.unshift({ taken_at: new Date().toISOString(), result: data || {} });
            localStorage.setItem('predictions_history', JSON.stringify(arr.slice(0, 200)));
          } catch (e) { console.warn('save prediction history failed', e); }
    } catch (err) {
      console.error('Predict failed', err);
      alert('Prediction error: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const formatList = (val) => {
    if (!val) return '—';
    if (Array.isArray(val)) return val.length ? val.join(', ') : '—';
    return String(val);
  };

  const capitalize = (s) => {
    if (!s) return '';
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Symptom Checker</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Enter your symptoms to get AI-powered health predictions
      </p>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Symptoms
        </label>
        <textarea 
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="E.g., fever, headache, cough, fatigue"
          style={{ 
            width: '100%', 
            padding: '1rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            fontSize: '16px',
            minHeight: '120px',
            resize: 'vertical'
          }}
        />

        <div style={{ display: 'flex', gap: 12, marginTop: '1rem' }}>
          <button 
            onClick={handleCheck}
            disabled={loading || !symptoms}
            style={{ 
              padding: '0.75rem 2rem', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: loading || !symptoms ? 0.6 : 1
            }}
          >
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </button>

          {result && (
            <button onClick={() => { setResult(null); }} style={{ padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}>Go back</button>
          )}
        </div>

        {result && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ marginBottom: '1rem' }}>Results:</h3>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Confidence: {(result.confidence || result.prediction_confidence || 0).toFixed(2)}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px', border: '1px solid #e6f2ff' }}>
                <div style={{ fontSize: '13px', color: '#444', fontWeight: '600' }}>Input Symptoms</div>
                <div style={{ marginTop: '6px', color: '#333' }}>{formatList(result.input_symptoms || result.input || result.symptoms)}</div>
              </div>

              <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px', border: '1px solid #e6f2ff' }}>
                <div style={{ fontSize: '13px', color: '#444', fontWeight: '600' }}>Filtered Symptoms</div>
                <div style={{ marginTop: '6px', color: '#333' }}>{formatList(result.filtered_symptoms || result.filtered)}</div>
              </div>

              <div style={{ padding: '0.75rem', background: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5' }}>
                <div style={{ fontSize: '13px', color: '#92400e', fontWeight: '700' }}>Predicted Disease</div>
                <div style={{ marginTop: '6px', color: '#7c2d12', fontSize: '18px', fontWeight: '700' }}>{capitalize(result.predicted_disease || result.prediction || result.disease || 'Unknown')}</div>
                {result.probabilities && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#444', fontWeight: '600' }}>Probabilities</div>
                    <ul style={{ marginTop: '6px' }}>
                      {Object.entries(result.probabilities).sort((a,b) => b[1] - a[1]).map(([disease, p]) => (
                        <li key={disease} style={{ fontSize: '13px', color: '#333' }}>{disease}: {(p*100).toFixed(1)}%</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Fallback raw view for debugging */}
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: '#2563eb' }}>Raw response</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', marginTop: '0.5rem' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomChecker;