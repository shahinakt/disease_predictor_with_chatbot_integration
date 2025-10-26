import { useState } from 'react';

function ReportPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/ocr/', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
      // save report to history for dashboard counts
      try {
        const raw = localStorage.getItem('reports_history');
        const arr = raw ? JSON.parse(raw) : [];
        arr.unshift({ taken_at: new Date().toISOString(), extracted_text: data.extracted_text || '' });
        localStorage.setItem('reports_history', JSON.stringify(arr.slice(0, 200)));
      } catch (e) { console.warn('save report history failed', e); }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Medical Report Scanner</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Upload your medical reports to extract text using OCR
      </p>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Upload Image
        </label>
        <input 
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: 'block', marginBottom: '1rem' }}
        />

        {file && (
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Selected: {file.name}
          </p>
        )}

        <button 
          onClick={handleUpload}
          disabled={loading || !file}
          style={{ 
            padding: '0.75rem 2rem', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            opacity: loading || !file ? 0.6 : 1
          }}
        >
          {loading ? 'Processing...' : 'Extract Text'}
        </button>

        {result && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Extracted Text:</h3>
            <p style={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6'
            }}>
              {result.extracted_text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;