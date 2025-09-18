import { useState, useEffect } from 'react';

export default function CookieNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (!cookieAccepted) {
      setShowNotice(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div className="cookie-notice">
      <div className="cookie-content">
        <div className="cookie-text">
          <h4>🍪 Cookie Notice</h4>
          <p>
            This app uses cookies to save your golf club distances and player profiles locally on your device. 
            No tracking or analytics cookies are used. Your data stays private and secure.
          </p>
        </div>
        <div className="cookie-actions">
          <button onClick={acceptCookies} className="btn btn-primary btn-small">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

