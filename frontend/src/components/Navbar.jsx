import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav style={{ 
      backgroundColor: '#1e40af', 
      padding: '1rem 2rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link to="/" style={{ 
        color: 'white', 
        textDecoration: 'none', 
        fontSize: '1.5rem', 
        fontWeight: 'bold' 
      }}>
        Disease Predictor
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/symptom-checker" style={{ color: 'white', textDecoration: 'none' }}>
              Predict Disease
            </Link>
            <Link to="/mental-tests" style={{ color: 'white', textDecoration: 'none' }}>
              Mental Tests
            </Link>
            <Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>
              OCR Scanner
            </Link>
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: 'white', 
                color: '#1e40af', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ 
              backgroundColor: 'white', 
              color: '#1e40af', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: '500'
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;