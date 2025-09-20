import { useState } from 'react';
import Head from 'next/head';
import Login from '../components/Login';
import GolfCalculator from '../components/GolfCalculator';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Head>
        <title>Golf Distance Calculator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ padding: '20px' }}>
        <h1>⛳ Golf Distance Calculator</h1>
        <button onClick={() => setIsAuthenticated(false)} style={{ marginBottom: '20px' }}>Logout</button>
        
        <GolfCalculator playerData={{}} />
      </div>
    </>
  );
}

