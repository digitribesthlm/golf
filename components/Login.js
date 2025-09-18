import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded credentials
  const VALID_USERNAME = 'digitribesthlm';
  const VALID_PASSWORD = 'golf2024';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem('golfAppAuthenticated', 'true');
      onLogin();
    } else {
      setError('Invalid username or password');
      setPassword(''); // Clear password on error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🏌️‍♂️ Golf Distance Calculator</h1>
          <p>Private Access Required</p>
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>Calculate golf distances with weather conditions</p>
        </div>
      </div>
    </div>
  );
}

