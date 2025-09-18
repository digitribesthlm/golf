import { useState } from 'react';
import { defaultClubData } from '../lib/playerStorage';

// Green condition multipliers
const greenConditions = {
  'soft': 0.3,    // 30% of normal rollout
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

export default function GolfCalculator({ playerData }) {
  const [temperature, setTemperature] = useState(17);
  const [windDirection, setWindDirection] = useState('calm');
  const [windSpeed, setWindSpeed] = useState(0);
  const [greenCondition, setGreenCondition] = useState('medium');
  const [rainCondition, setRainCondition] = useState('dry');
  const [results, setResults] = useState(null);
  const [formCollapsed, setFormCollapsed] = useState(false);

  const clubData = playerData || defaultClubData;

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

    // Wind adjustments
    if (windDirection === 'calm') {
      // No additional wind adjustment for calm conditions
    } else if (windDirection === 'headwind') {
      const headwindCarryLoss = data.baseline.carry - data.headwind18.carry;
      const headwindTotalLoss = data.baseline.total - data.headwind18.total;
      
      const windFactor = windSpeed / 18;
      carry -= headwindCarryLoss * windFactor;
      total -= headwindTotalLoss * windFactor;
    } else if (windDirection === 'tailwind') {
      const tailwindCarryGain = data.tailwind18.carry - data.baseline.carry;
      const tailwindTotalGain = data.tailwind18.total - data.baseline.total;
      
      const windFactor = windSpeed / 18;
      carry += tailwindCarryGain * windFactor;
      total += tailwindTotalGain * windFactor;
    } else if (windDirection === 'crosswind') {
      const headwindCarryLoss = data.baseline.carry - data.headwind18.carry;
      const headwindTotalLoss = data.baseline.total - data.headwind18.total;
      
      const windFactor = windSpeed / 18;
      carry -= (headwindCarryLoss * windFactor * 0.1);
      total -= (headwindTotalLoss * windFactor * 0.1);
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
    
    const clubOrder = ['SW', 'PW', '9i', '8i', '7i', '6i', '5i', '4i', '3i', 'U3', 'W3', 'M1'];
    const calculatedResults = [];

    clubOrder.forEach(clubKey => {
      const club = clubData[clubKey];
      const result = calculateDistance(clubKey, temperature, windDirection, windSpeed, rainCondition);
      const rollout = calculateRollout(clubKey, greenCondition, rainCondition);
      
      if (result) {
        const finalPosition = result.carry + rollout;
        
        calculatedResults.push({
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
        <div className="form-grid">
          {/* Temperature */}
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
                  setWindSpeed(18);
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

          {/* Wind Speed */}
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
              disabled={windDirection === 'calm'}
            />
          </div>

          {/* Green Conditions */}
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

          {/* Rain Conditions */}
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
        </div>

        {/* Calculate Button */}
        <button type="submit" className="btn btn-primary btn-center">
          Calculate All Distances
        </button>
      </form>

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

