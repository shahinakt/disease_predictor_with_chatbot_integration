import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to Disease Predictor
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
          Early detection and health monitoring system powered by AI
        </p>
        {isLoggedIn ? (
          <Link to="/dashboard">
            <button style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Go to Dashboard{user.name ? `, ${user.name}` : ''}
            </button>
          </Link>
        ) : (
          <Link to="/register">
            <button style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Get Started
            </button>
          </Link>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <FeatureCard 
          title="🔍 Symptom Checker" 
          description="Get AI-powered disease predictions based on your symptoms"
        />
        <FeatureCard 
          title="📄 Medical Reports" 
          description="Upload and analyze your medical reports with OCR"
        />
        <FeatureCard 
          title="💬 Health Chat" 
          description="Chat with our AI assistant about your health concerns"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: '#666', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

export default Home;