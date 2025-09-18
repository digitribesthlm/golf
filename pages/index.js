import { useState, useEffect } from 'react';
import Head from 'next/head';
import GolfCalculator from '../components/GolfCalculator';
import PlayerSettings from '../components/PlayerSettings';
import { getPlayerData, savePlayerData, getActivePlayer, setActivePlayer } from '../lib/playerStorage';

export default function Home() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    // Load active player and their data on component mount
    const activePlayerName = getActivePlayer();
    if (activePlayerName) {
      const data = getPlayerData(activePlayerName);
      setCurrentPlayer(activePlayerName);
      setPlayerData(data);
    }
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
          <p>Calculate distances for all clubs based on weather conditions</p>
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

