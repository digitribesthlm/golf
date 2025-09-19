import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('golfAppToken', data.token);
        localStorage.setItem('golfAppUser', JSON.stringify(data.user));
        localStorage.setItem('golfAppAuthenticated', 'true');
        onLogin();
      } else {
        setError(data.message || 'Authentication failed');
        setPassword(''); // Clear password on error
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🏌️‍♂️ Golf Distance Calculator</h1>
          <p>{isRegisterMode ? 'Create Account' : 'Private Access Required'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password {isRegisterMode && '(min 6 characters)'}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              disabled={isLoading}
              minLength={isRegisterMode ? 6 : undefined}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (isRegisterMode ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
              setPassword('');
            }}
            className="btn btn-secondary btn-small"
            disabled={isLoading}
          >
            {isRegisterMode ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
          <p>Calculate golf distances with weather conditions</p>
        </div>
      </div>
    </div>
  );
}

