import { useState, useEffect } from 'react';
import { defaultClubData } from '../lib/playerStorage';

// Green condition multipliers
const greenConditions = {
  'soft': 0.3,    // 30% of normal rollout.
  'medium': 1.0,  // 100% normal rollout
  'firm': 1.8     // 180% of normal rollout
};

// Rain condition effects
const rainConditions = {
  'dry': { carryMultiplier: 1.0, rolloutMultiplier: 1.0 },
  'light': { carryMultiplier: 0.98, rolloutMultiplier: 0.7 },      // 2% carry loss, 30% rollout reduction
  'moderate': { carryMultiplier: 0.95, rolloutMultiplier: 0.4 },   // 5% carry loss, 60% rollout reduction
  'heavy': { carryMultiplier: 0.92, rolloutMultiplier: 0.2 }       // 8% carry loss, 80% rollout reduction
};

const defaultClubKeys = Object.keys(defaultClubData);

export default function GolfCalculator({ playerData, onClubDataChange }) {
  const [temperature, setTemperature] = useState(17);
  const [windDirection, setWindDirection] = useState('calm');
  const [windSpeed, setWindSpeed] = useState(0);
  const [greenCondition, setGreenCondition] = useState('medium');
  const [rainCondition, setRainCondition] = useState('dry');
  const [results, setResults] = useState(null);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [windOnlyMode, setWindOnlyMode] = useState(false);
  const [clubData, setClubData] = useState(playerData || defaultClubData);
  const [showAddClubForm, setShowAddClubForm] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', carry: 50, rollout: 2.0 });

  useEffect(() => {
    if (playerData) {
      setClubData(playerData);
    }
  }, [playerData]);

  const getClubOrder = () => {
    return Object.entries(clubData)
      .sort(([, a], [, b]) => a.baseline.carry - b.baseline.carry)
      .map(([key]) => key);
  };

  const handleAddClub = () => {
    if (!newClub.name.trim()) return;
    const clubKey = `custom_${Date.now()}`;
    const club = {
      name: newClub.name.trim(),
      baseline: { carry: parseInt(newClub.carry) || 50, total: (parseInt(newClub.carry) || 50) + 2 },
      calm17: { carry: (parseInt(newClub.carry) || 50) - 1, total: (parseInt(newClub.carry) || 50) + 1 },
      headwind18: { carry: Math.round((parseInt(newClub.carry) || 50) * 0.9), total: Math.round(((parseInt(newClub.carry) || 50) + 2) * 0.9) },
      tailwind18: { carry: Math.round((parseInt(newClub.carry) || 50) * 1.05), total: Math.round(((parseInt(newClub.carry) || 50) + 2) * 1.05) },
      rolloutFactor: parseFloat(newClub.rollout) || 2.0
    };
    const updated = { ...clubData, [clubKey]: club };
    setClubData(updated);
    if (onClubDataChange) onClubDataChange(updated);
    setNewClub({ name: '', carry: 50, rollout: 2.0 });
    setShowAddClubForm(false);
    setResults(null);
  };

  const handleRemoveClub = (clubKey) => {
    if (!confirm(`Remove "${clubData[clubKey].name}" from your bag?`)) return;
    const updated = { ...clubData };
    delete updated[clubKey];
    setClubData(updated);
    if (onClubDataChange) onClubDataChange(updated);
    if (results) {
      setResults({
        ...results,
        clubs: results.clubs.filter(c => c.clubKey !== clubKey)
      });
    }
  };

  const calculateRollout = (club, greenCondition, rainCondition) => {
    const data = clubData[club];
    if (!data) return 0;
    
    const baseRollout = data.rolloutFactor;
    const greenMultiplier = greenConditions[greenCondition];
    const rainMultiplier = rainConditions[rainCondition].rolloutMultiplier;
    
    return Math.round(baseRollout * greenMultiplier * rainMultiplier);
  };

  const calculateDistance = (club, temperature, windDirection, windSpeed, rainCondition) => {
    const data = clubData[club];
    if (!data) return null;

    let carry = data.baseline.carry;
    let total = data.baseline.total;

    // Temperature adjustment (baseline is assumed to be around 20°C)
    const tempDiff = temperature - 20;
    const tempAdjustment = tempDiff * 0.3; // Approximately 0.3 yards per degree
    
    carry += tempAdjustment;
    total += tempAdjustment;

    // Wind adjustments using percentage-based system
    // Convert km/h to mph for percentage calculation (1 km/h = 0.621371 mph)
    const windSpeedMph = windSpeed * 0.621371;
    
    if (windDirection === 'calm') {
      // No additional wind adjustment for calm conditions
    } else if (windDirection === 'headwind') {
      // Full headwind: larger adjustment (approximately 1% per mph)
      const windPercentage = windSpeedMph * 1.0; // 1% per mph
      const carryAdjustment = carry * (windPercentage / 100);
      const totalAdjustment = total * (windPercentage / 100);
      
      carry -= carryAdjustment;
      total -= totalAdjustment;
    } else if (windDirection === 'tailwind') {
      // Downwind: roughly add about half the wind speed as percent
      const windPercentage = windSpeedMph * 0.5; // 0.5% per mph
      const carryAdjustment = carry * (windPercentage / 100);
      const totalAdjustment = total * (windPercentage / 100);
      
      carry += carryAdjustment;
      total += totalAdjustment;
    } else if (windDirection === 'crosswind') {
      // Quartering wind: use ~25% of the wind number
      const windPercentage = windSpeedMph * 0.25; // 0.25% per mph
      const carryAdjustment = carry * (windPercentage / 100);
      const totalAdjustment = total * (windPercentage / 100);
      
      carry -= carryAdjustment; // Crosswind typically hurts distance slightly
      total -= totalAdjustment;
    }

    // Rain adjustments (affects carry distance due to air density)
    const rainMultiplier = rainConditions[rainCondition].carryMultiplier;
    carry *= rainMultiplier;
    total *= rainMultiplier;

    return {
      carry: Math.round(carry),
      total: Math.round(total)
    };
  };

  const formatConditions = (temperature, windDirection, windSpeed, greenCondition, rainCondition) => {
    let conditions = `Temperature: ${temperature}°C`;
    
    if (windDirection === 'calm') {
      conditions += ', Calm conditions';
    } else {
      const directionText = {
        'headwind': 'Headwind',
        'tailwind': 'Tailwind',
        'crosswind': 'Crosswind'
      };
      conditions += `, ${directionText[windDirection]} ${windSpeed} km/h`;
    }
    
    const greenText = {
      'soft': 'Soft greens',
      'medium': 'Medium greens',
      'firm': 'Firm greens'
    };
    conditions += `, ${greenText[greenCondition]}`;
    
    const rainText = {
      'dry': 'Dry conditions',
      'light': 'Light rain',
      'moderate': 'Moderate rain',
      'heavy': 'Heavy rain'
    };
    conditions += `, ${rainText[rainCondition]}`;
    
    return conditions;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    const clubOrder = getClubOrder();
    const calculatedResults = [];

    clubOrder.forEach(clubKey => {
      const club = clubData[clubKey];
      const result = calculateDistance(clubKey, temperature, windDirection, windSpeed, rainCondition);
      const rollout = calculateRollout(clubKey, greenCondition, rainCondition);
      
      if (result) {
        const finalPosition = result.carry + rollout;
        
        calculatedResults.push({
          clubKey: clubKey,
          club: club.name,
          baselineCarry: club.baseline.carry,
          baselineTotal: club.baseline.total,
          adjustedCarry: result.carry,
          rollout: rollout,
          finalPosition: finalPosition
        });
      }
    });

    setResults({
      conditions: formatConditions(temperature, windDirection, windSpeed, greenCondition, rainCondition),
      clubs: calculatedResults
    });
    
    // Collapse form after calculation
    setFormCollapsed(true);
  };

  return (
    <div>
      {/* Form Toggle Button (only show when form is collapsed and results exist) */}
      {formCollapsed && results && (
        <div className="form-toggle-container">
          <button 
            type="button" 
            onClick={() => setFormCollapsed(false)}
            className="btn btn-secondary btn-center"
          >
            🔧 Adjust Conditions
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleCalculate} className={formCollapsed ? 'form-collapsed' : ''}>
        {/* Wind-Only Mode Toggle - Only show when wind is not calm */}
        {windDirection !== 'calm' && (
          <div className="wind-toggle-container">
            <label className="wind-toggle">
              <input
                type="checkbox"
                checked={windOnlyMode}
                onChange={(e) => setWindOnlyMode(e.target.checked)}
              />
              <span className="wind-toggle-text">⚡ Quick Wind Mode (for mobile play)</span>
            </label>
          </div>
        )}

        <div className="form-grid">
          {/* Temperature - Hidden in wind-only mode */}
          {!windOnlyMode && (
            <div className="form-group">
              <label htmlFor="temperature" className="form-label">
                Temperature (°C)
              </label>
              <input
                type="number"
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="form-input"
                min="-10"
                max="50"
              />
            </div>
          )}

          {/* Wind Direction */}
          <div className="form-group">
            <label htmlFor="windDirection" className="form-label">
              Wind Direction
            </label>
            <select
              id="windDirection"
              value={windDirection}
              onChange={(e) => {
                setWindDirection(e.target.value);
                if (e.target.value === 'calm') {
                  setWindSpeed(0);
                } else if (windSpeed === 0) {
                  setWindSpeed(24);
                }
              }}
              className="form-select"
            >
              <option value="calm">Calm</option>
              <option value="headwind">Into Wind (Headwind)</option>
              <option value="tailwind">Downwind (Tailwind)</option>
              <option value="crosswind">Crosswind</option>
            </select>
          </div>

          {/* Wind Speed - Only show when wind is not calm */}
          {windDirection !== 'calm' && (
            <div className="form-group">
              <label htmlFor="windSpeed" className="form-label">
                Wind Speed (km/h)
              </label>
              <input
                type="number"
                id="windSpeed"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="form-input"
                min="0"
                max="50"
              />
            </div>
          )}

          {/* Green Conditions - Hidden in wind-only mode */}
          {!windOnlyMode && (
            <div className="form-group">
              <label htmlFor="greenCondition" className="form-label">
                Green Conditions
              </label>
              <select
                id="greenCondition"
                value={greenCondition}
                onChange={(e) => setGreenCondition(e.target.value)}
                className="form-select"
              >
                <option value="soft">Soft (Minimal rollout)</option>
                <option value="medium">Medium (Normal rollout)</option>
                <option value="firm">Firm (Maximum rollout)</option>
              </select>
            </div>
          )}

          {/* Rain Conditions - Hidden in wind-only mode */}
          {!windOnlyMode && (
            <div className="form-group">
              <label htmlFor="rainCondition" className="form-label">
                Rain Conditions
              </label>
              <select
                id="rainCondition"
                value={rainCondition}
                onChange={(e) => setRainCondition(e.target.value)}
                className="form-select"
              >
                <option value="dry">Dry (No rain)</option>
                <option value="light">Light rain</option>
                <option value="moderate">Moderate rain</option>
                <option value="heavy">Heavy rain</option>
              </select>
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button type="submit" className="btn btn-primary btn-center">
          Calculate All Distances
        </button>
      </form>

      {/* Club Management */}
      <div className="club-management">
        <button
          type="button"
          onClick={() => setShowAddClubForm(!showAddClubForm)}
          className="btn btn-secondary btn-center"
          style={{ marginTop: '1rem' }}
        >
          {showAddClubForm ? 'Cancel' : '+ Add Club to Bag'}
        </button>

          {showAddClubForm && (
            <div className="add-club-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Club Name</label>
                  <input
                    type="text"
                    value={newClub.name}
                    onChange={(e) => setNewClub(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="e.g. 60° Wedge"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Carry Distance (m)</label>
                  <input
                    type="number"
                    value={newClub.carry}
                    onChange={(e) => setNewClub(prev => ({ ...prev, carry: e.target.value }))}
                    className="form-input"
                    min="10"
                    max="400"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rollout Factor</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newClub.rollout}
                    onChange={(e) => setNewClub(prev => ({ ...prev, rollout: e.target.value }))}
                    className="form-input"
                    min="0"
                    max="20"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddClub}
                className="btn btn-primary btn-center"
              >
                Add Club
              </button>
            </div>
          )}
        </div>

      {/* Results */}
      {results && (
        <div>
          {/* Conditions Display */}
          <div className="conditions-display">
            Current Conditions: {results.conditions}
          </div>

          {/* Desktop Results Table */}
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Club</th>
                  <th>Baseline Carry</th>
                  <th>Baseline Total</th>
                  <th>Adjusted Carry</th>
                  <th>Rollout Distance</th>
                  <th>Final Position</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.clubs.map((club, index) => (
                  <tr key={index}>
                    <td className="club-name">{club.club}</td>
                    <td className="distance-baseline">{club.baselineCarry}</td>
                    <td className="distance-baseline">{club.baselineTotal}</td>
                    <td className="distance-carry">{club.adjustedCarry}</td>
                    <td className="distance-rollout">{club.rollout}</td>
                    <td className="distance-total">{club.finalPosition}</td>
                    <td className="remove-cell">
                      <button
                        onClick={() => handleRemoveClub(club.clubKey)}
                        className="remove-btn"
                        title="Remove club"
                        aria-label="Remove club"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Results Cards */}
          <div className="mobile-table-container">
            {results.clubs.map((club, index) => (
              <div key={index} className="mobile-club-card">
                <div className="mobile-club-header">
                  {club.club}
                  <button
                    onClick={() => handleRemoveClub(club.clubKey)}
                    className="remove-btn mobile-remove-btn"
                    title="Remove club"
                    aria-label="Remove club"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <div className="mobile-distance-grid">
                  <div className="mobile-distance-item">
                    <span className="mobile-distance-label">Baseline Carry:</span>
                    <span className="mobile-distance-value baseline">{club.baselineCarry}m</span>
                  </div>
                  <div className="mobile-distance-item">
                    <span className="mobile-distance-label">Baseline Total:</span>
                    <span className="mobile-distance-value baseline">{club.baselineTotal}m</span>
                  </div>
                  <div className="mobile-distance-item">
                    <span className="mobile-distance-label">Adjusted Carry:</span>
                    <span className="mobile-distance-value carry">{club.adjustedCarry}m</span>
                  </div>
                  <div className="mobile-distance-item">
                    <span className="mobile-distance-label">Rollout:</span>
                    <span className="mobile-distance-value rollout">{club.rollout}m</span>
                  </div>
                  <div className="mobile-final-distance">
                    <div className="mobile-distance-item">
                      <span className="mobile-distance-label">Final Position:</span>
                      <span className="mobile-distance-value total">{club.finalPosition}m</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color carry"></div>
              <span>Carry Distance</span>
            </div>
            <div className="legend-item">
              <div className="legend-color rollout"></div>
              <span>Rollout Distance</span>
            </div>
            <div className="legend-item">
              <div className="legend-color total"></div>
              <span>Final Position</span>
            </div>
            <div className="legend-item">
              <div className="legend-color baseline"></div>
              <span>Baseline (Reference)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

