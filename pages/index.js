import { useState, useEffect } from 'react';
import GolfCalculator from '../components/GolfCalculator';
import PlayerSettings from '../components/PlayerSettings';
import PuttingDrills from '../components/PuttingDrills';
import RoundTracker from '../components/RoundTracker';
import Login from '../components/Login';
import { getActivePlayer, getPlayerData } from '../lib/playerStorage';

export default function Home() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const token = localStorage.getItem('golfAppToken');
      const authStatus = localStorage.getItem('golfAppAuthenticated');
      
      if (token && authStatus === 'true') {
        // Verify token with server
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });
          
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear auth data
            localStorage.removeItem('golfAppToken');
            localStorage.removeItem('golfAppUser');
            localStorage.removeItem('golfAppAuthenticated');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      // Load active player and their data on component mount
      const activePlayer = getActivePlayer();
      if (activePlayer) {
        setCurrentPlayer(activePlayer);
        const data = getPlayerData(activePlayer);
        setPlayerData(data);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handlePlayerChange = (playerName) => {
    const data = getPlayerData(playerName);
    setCurrentPlayer(playerName);
    setPlayerData(data);
    setActivePlayer(playerName);
  };

  const handlePlayerSave = (playerName, data) => {
    savePlayerData(playerName, data);
    setCurrentPlayer(playerName);
    setPlayerData(data);
    setActivePlayer(playerName);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('golfAppToken');
    localStorage.removeItem('golfAppUser');
    localStorage.removeItem('golfAppAuthenticated');
    setIsAuthenticated(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Head>
        <title>Golf Distance Calculator</title>
        <meta name="description" content="Professional golf distance calculator with weather conditions and player profiles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>⛳ Golf Distance Calculator</h1>
          <div className="header-actions">
            <p>Calculate distances for all clubs based on weather conditions</p>
            <button onClick={handleLogout} className="btn btn-secondary btn-small logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Player Info */}
        {currentPlayer && (
          <div className="player-info">
            <p>Current Player: <strong>{currentPlayer}</strong></p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
          >
            📊 Calculator
          </button>
          <button
            onClick={() => setActiveTab('putting')}
            className={`tab-button ${activeTab === 'putting' ? 'active' : ''}`}
          >
            🏌️‍♂️ Putting Drills
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`tab-button ${activeTab === 'tracker' ? 'active' : ''}`}
          >
            🎯 Round Tracker
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          >
            ⚙️ Player Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'calculator' ? (
            <GolfCalculator playerData={playerData} />
          ) : activeTab === 'putting' ? (
            <PuttingDrills />
          ) : activeTab === 'tracker' ? (
            <RoundTracker />
          ) : (
            <PlayerSettings
              currentPlayer={currentPlayer}
              playerData={playerData}
              onPlayerChange={handlePlayerChange}
              onPlayerSave={handlePlayerSave}
            />
          )}
        </div>
      </div>
    </>
  );
}

