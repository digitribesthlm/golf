import { useState, useEffect } from 'react';
import { defaultClubData, getPlayersList, deletePlayer } from '../lib/playerStorage';

export default function PlayerSettings({ currentPlayer, playerData, onPlayerChange, onPlayerSave }) {
  const [playerName, setPlayerName] = useState(currentPlayer || '');
  const [clubData, setClubData] = useState(playerData || defaultClubData);
  const [playersList, setPlayersList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPlayersList(getPlayersList());
  }, []);

  useEffect(() => {
    if (currentPlayer) {
      setPlayerName(currentPlayer);
      setClubData(playerData || defaultClubData);
    }
  }, [currentPlayer, playerData]);

  const handlePlayerSelect = (selectedPlayer) => {
    onPlayerChange(selectedPlayer);
    setIsEditing(false);
  };

  const handleSavePlayer = () => {
    if (!playerName.trim()) {
      alert('Please enter a player name');
      return;
    }

    onPlayerSave(playerName.trim(), clubData);
    setPlayersList(prev => {
      if (!prev.includes(playerName.trim())) {
        return [...prev, playerName.trim()];
      }
      return prev;
    });
    setIsEditing(false);
    alert('Player data saved successfully!');
  };

  const handleDeletePlayer = (playerToDelete) => {
    if (confirm(`Are you sure you want to delete player "${playerToDelete}"?`)) {
      deletePlayer(playerToDelete);
      setPlayersList(prev => prev.filter(p => p !== playerToDelete));
      
      if (currentPlayer === playerToDelete) {
        setPlayerName('');
        setClubData(defaultClubData);
        onPlayerChange(null);
      }
    }
  };

  const handleClubDataChange = (clubKey, field, subfield, value) => {
    setClubData(prev => ({
      ...prev,
      [clubKey]: {
        ...prev[clubKey],
        [field]: {
          ...prev[clubKey][field],
          [subfield]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleRolloutFactorChange = (clubKey, value) => {
    setClubData(prev => ({
      ...prev,
      [clubKey]: {
        ...prev[clubKey],
        rolloutFactor: parseFloat(value) || 0
      }
    }));
  };

  const resetToDefault = () => {
    if (confirm('Reset all distances to default values?')) {
      setClubData(defaultClubData);
    }
  };

  const clubOrder = ['SW', 'PW', '9i', '8i', '7i', '6i', '5i', '4i', '3i', 'U3', 'W3', 'M1'];

  return (
    <div>
      {/* Player Management */}
      <div className="player-management">
        <h2>Player Management</h2>
        
        {/* Current Player Input */}
        <div className="player-input-row">
          <div className="form-group">
            <label htmlFor="playerName" className="form-label">
              Player Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>
          <div className="player-buttons">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Distances'}
            </button>
            <button
              onClick={handleSavePlayer}
              className="btn btn-primary"
            >
              Save Player
            </button>
          </div>
        </div>

        {/* Existing Players */}
        {playersList.length > 0 && (
          <div className="players-list">
            <h3>Saved Players</h3>
            <div className="players-grid">
              {playersList.map((player) => (
                <div key={player} className="player-item">
                  <span className={`player-name ${currentPlayer === player ? 'active' : ''}`}>
                    {player} {currentPlayer === player && '(Active)'}
                  </span>
                  <div className="player-actions">
                    <button
                      onClick={() => handlePlayerSelect(player)}
                      className="btn btn-secondary btn-small"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Distance Editing */}
      {isEditing && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Edit Club Distances</h2>
            <button
              onClick={resetToDefault}
              className="btn btn-secondary"
            >
              Reset to Default
            </button>
          </div>

          <div className="info-box warning">
            <p>
              <strong>Simple Setup:</strong> Just enter your carry distance and rollout factor for each club. 
              The app will automatically calculate all wind and weather variations for you!
            </p>
          </div>

          {/* Desktop Settings Table */}
          <div className="table-container settings-desktop">
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Club</th>
                  <th>Carry Distance (m)</th>
                  <th>Rollout Factor</th>
                </tr>
              </thead>
              <tbody>
                {clubOrder.map((clubKey, index) => {
                  const club = clubData[clubKey];
                  return (
                    <tr key={clubKey}>
                      <td style={{ fontWeight: '600', textAlign: 'left' }}>{club.name}</td>
                      <td>
                        <input
                          type="number"
                          value={club.baseline.carry}
                          onChange={(e) => handleClubDataChange(clubKey, 'baseline', 'carry', e.target.value)}
                          className="settings-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={club.rolloutFactor}
                          onChange={(e) => handleRolloutFactorChange(clubKey, e.target.value)}
                          className="settings-input"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Settings Cards */}
          <div className="settings-mobile">
            {clubOrder.map((clubKey, index) => {
              const club = clubData[clubKey];
              return (
                <div key={clubKey} className="mobile-settings-card">
                  <div className="mobile-club-header">
                    {club.name}
                  </div>
                  
                  <div className="mobile-input-row">
                    <label>Carry Distance (m):</label>
                    <input
                      type="number"
                      value={club.baseline.carry}
                      onChange={(e) => handleClubDataChange(clubKey, 'baseline', 'carry', e.target.value)}
                      className="settings-input-mobile"
                    />
                  </div>
                  
                  <div className="mobile-input-row">
                    <label>Rollout Factor:</label>
                    <input
                      type="number"
                      step="0.1"
                      value={club.rolloutFactor}
                      onChange={(e) => handleRolloutFactorChange(clubKey, e.target.value)}
                      className="settings-input-mobile"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={handleSavePlayer}
              className="btn btn-primary"
            >
              Save All Changes
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isEditing && (
        <div className="info-box info">
          <h3>How to Use Player Settings</h3>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li><strong>Create a Profile:</strong> Enter your name and click "Save Player" to create your profile with default distances</li>
            <li><strong>Customize Distances:</strong> Click "Edit Distances" to input your personal yardages for each club</li>
            <li><strong>Load Existing Profile:</strong> Select a saved player from the list to load their distances</li>
            <li><strong>Multiple Players:</strong> Create profiles for different players - each saves their own custom distances</li>
            <li><strong>Data Persistence:</strong> All data is saved in browser cookies and will persist between sessions</li>
          </ul>
        </div>
      )}
    </div>
  );
}

