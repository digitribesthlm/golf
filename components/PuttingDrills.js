import { useState } from 'react';

export default function PuttingDrills() {
  const [useMetric, setUseMetric] = useState(true);

  // Putting data: Stimp (rows) vs Distance (columns) = Backstroke length in cm
  const puttingData = {
    8: { 3: 16, 6: 22, 9: 26, 12: 29, 15: 33, 18: 35, 21: 38, 24: 41, 27: 43, 30: 45 },
    9: { 3: 16, 6: 21, 9: 25, 12: 28, 15: 31, 18: 34, 21: 36, 24: 38, 27: 41, 30: 43 },
    10: { 3: 15, 6: 20, 9: 23, 12: 27, 15: 29, 18: 32, 21: 34, 24: 37, 27: 39, 30: 41 },
    11: { 3: 14, 6: 19, 9: 22, 12: 25, 15: 28, 18: 31, 21: 33, 24: 35, 27: 37, 30: 39 },
    12: { 3: 14, 6: 18, 9: 21, 12: 24, 15: 27, 18: 29, 21: 32, 24: 34, 27: 36, 30: 37 },
    13: { 3: 13, 6: 17, 9: 21, 12: 23, 15: 26, 18: 28, 21: 30, 24: 32, 27: 34, 30: 36 }
  };

  const distances = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];
  const stimpReadings = [8, 9, 10, 11, 12, 13];

  // Convert cm to inches
  const cmToInches = (cm) => Math.round(cm / 2.54 * 10) / 10;
  
  // Convert feet to meters  
  const feetToMeters = (feet) => Math.round(feet * 0.3048 * 10) / 10;

  const getDistanceDisplay = (distance) => {
    return useMetric ? `${feetToMeters(distance)}m` : `${distance}ft`;
  };

  const getBackstrokeDisplay = (cm) => {
    return useMetric ? `${cm}cm` : `${cmToInches(cm)}"`;
  };

  return (
    <div className="putting-drills">
      <div className="putting-header">
        <h2>🏌️‍♂️ Putting Swing Length Chart</h2>
        <p>Backstroke length for different green speeds and distances</p>
        
        {/* Unit Toggle */}
        <div className="unit-toggle-container">
          <label className="unit-toggle">
            <input
              type="checkbox"
              checked={useMetric}
              onChange={(e) => setUseMetric(e.target.checked)}
            />
            <span className="unit-toggle-text">
              📏 {useMetric ? 'Metric (m/cm)' : 'Imperial (ft/inches)'}
            </span>
          </label>
        </div>
      </div>

      <div className="putting-info">
        <div className="info-box">
          <h3>How to Use:</h3>
          <ul>
            <li><strong>Stimp Reading:</strong> Green speed measurement (8 = slow, 13 = very fast)</li>
            <li><strong>Distance:</strong> Length of putt in feet</li>
            <li><strong>Backstroke:</strong> How far back to take your putter (in cm)</li>
            <li><strong>Practice:</strong> Use consistent tempo and follow through equal to backstroke</li>
          </ul>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="putting-table-container">
        <table className="putting-table">
          <thead>
            <tr>
              <th className="stimp-header">Stimp/Distance</th>
              {distances.map(distance => (
                <th key={distance} className="distance-header">{getDistanceDisplay(distance)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stimpReadings.map(stimp => (
              <tr key={stimp}>
                <td className="stimp-cell">{stimp}</td>
                {distances.map(distance => (
                  <td key={`${stimp}-${distance}`} className="backstroke-cell">
                    {getBackstrokeDisplay(puttingData[stimp][distance])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="putting-mobile">
        {stimpReadings.map(stimp => (
          <div key={stimp} className="putting-mobile-card">
            <div className="mobile-stimp-header">
              Stimp {stimp}
            </div>
            <div className="mobile-distances">
              {distances.map(distance => (
                <div key={`${stimp}-${distance}`} className="mobile-distance-item">
                  <span className="mobile-distance">{getDistanceDisplay(distance)}:</span>
                  <span className="mobile-backstroke">{getBackstrokeDisplay(puttingData[stimp][distance])}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="putting-tips">
        <div className="info-box warning">
          <h3>💡 Practice Tips:</h3>
          <ul>
            <li><strong>Consistent Tempo:</strong> Same rhythm for all putts</li>
            <li><strong>Equal Follow Through:</strong> Follow through should match backstroke length</li>
            <li><strong>Practice Distances:</strong> Start with shorter putts and work up</li>
            <li><strong>Green Reading:</strong> Adjust for slope and grain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

