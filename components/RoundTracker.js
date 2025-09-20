import { useState, useEffect } from 'react';

export default function RoundTracker() {
  const [currentView, setCurrentView] = useState('menu');
  const [currentRound, setCurrentRound] = useState(null);
  const [currentHole, setCurrentHole] = useState(1);
  const [savedRounds, setSavedRounds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('golfRounds');
    if (saved) {
      setSavedRounds(JSON.parse(saved));
    }
  }, []);

  const startNewRound = (holes) => {
    const newRound = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      holes: holes,
      currentHole: 1,
      holeData: Array(holes).fill(null).map((_, index) => ({
        hole: index + 1,
        par: 4,
        score: null,
        step1: null,
        step2: null,
        step2_5: null,
        step3: null,
        notes: ''
      }))
    };
    setCurrentRound(newRound);
    setCurrentHole(1);
    setCurrentView('playing');
  };

  const updateHoleData = (holeIndex, field, value) => {
    const updatedRound = { ...currentRound };
    updatedRound.holeData[holeIndex][field] = value;
    setCurrentRound(updatedRound);
  };

  const nextHole = () => {
    if (currentHole < currentRound.holes) {
      setCurrentHole(currentHole + 1);
    } else {
      finishRound();
    }
  };

  const previousHole = () => {
    if (currentHole > 1) {
      setCurrentHole(currentHole - 1);
    }
  };

  const finishRound = () => {
    const completedRound = {
      ...currentRound,
      completed: true,
      completedAt: new Date().toISOString(),
      totalScore: currentRound.holeData.reduce((sum, hole) => sum + (hole.score || 0), 0),
      step1Success: currentRound.holeData.filter(hole => hole.step1 === true).length,
      step2Success: currentRound.holeData.filter(hole => hole.step2 === true).length,
      step2_5Success: currentRound.holeData.filter(hole => hole.step2_5 === true).length,
      step3Success: currentRound.holeData.filter(hole => hole.step3 === true).length,
    };

    const updatedRounds = [...savedRounds, completedRound];
    setSavedRounds(updatedRounds);
    localStorage.setItem('golfRounds', JSON.stringify(updatedRounds));
    
    setCurrentRound(null);
    setCurrentView('overview');
  };

  const deleteRound = (roundId) => {
    const updatedRounds = savedRounds.filter(round => round.id !== roundId);
    setSavedRounds(updatedRounds);
    localStorage.setItem('golfRounds', JSON.stringify(updatedRounds));
  };

  const renderMenu = () => (
    <div className="round-tracker-menu">
      <h2>🎯 Round Tracker</h2>
      <p className="framework-intro">
        Track your rounds using the 4-step framework for consistent, stress-free golf:
      </p>
      
      <div className="framework-steps">
        <div className="step">
          <strong>1. Put the ball in play</strong>
          <p>Avoid disaster (OB, water, lost ball). Rough is fine.</p>
        </div>
        <div className="step">
          <strong>2. Give yourself a look at birdie</strong>
          <p>Get around/on the green for a chance. Think opportunity creation.</p>
        </div>
        <div className="step">
          <strong>2.5. If no birdie → look at par</strong>
          <p>Play damage control. Avoid doubles or worse.</p>
        </div>
        <div className="step">
          <strong>3. Give every putt a good run</strong>
          <p>Read it, roll it with intent. Don't baby it short.</p>
        </div>
      </div>

      <div className="menu-buttons">
        <button onClick={() => startNewRound(9)} className="start-round-btn">
          Start 9-Hole Round
        </button>
        <button onClick={() => startNewRound(18)} className="start-round-btn">
          Start 18-Hole Round
        </button>
        <button onClick={() => setCurrentView('overview')} className="view-overview-btn">
          View Round History
        </button>
      </div>
    </div>
  );

  const renderPlaying = () => {
    const hole = currentRound.holeData[currentHole - 1];
    
    return (
      <div className="round-tracker-playing">
        <div className="round-header">
          <h2>Round in Progress</h2>
          <p>Hole {currentHole} of {currentRound.holes} | Par {hole.par}</p>
        </div>

        <div className="hole-tracking">
          <div className="score-input">
            <label>Score:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={hole.score || ''}
              onChange={(e) => updateHoleData(currentHole - 1, 'score', parseInt(e.target.value) || null)}
            />
          </div>

          <div className="par-input">
            <label>Par:</label>
            <select
              value={hole.par}
              onChange={(e) => updateHoleData(currentHole - 1, 'par', parseInt(e.target.value))}
            >
              <option value={3}>Par 3</option>
              <option value={4}>Par 4</option>
              <option value={5}>Par 5</option>
            </select>
          </div>

          <div className="framework-tracking">
            <h3>4-Step Framework</h3>
            
            <div className="step-check">
              <label>
                <input
                  type="checkbox"
                  checked={hole.step1 === true}
                  onChange={(e) => updateHoleData(currentHole - 1, 'step1', e.target.checked)}
                />
                <strong>1. Put ball in play</strong> (avoided disaster)
              </label>
            </div>

            <div className="step-check">
              <label>
                <input
                  type="checkbox"
                  checked={hole.step2 === true}
                  onChange={(e) => updateHoleData(currentHole - 1, 'step2', e.target.checked)}
                />
                <strong>2. Look at birdie</strong> (got a chance)
              </label>
            </div>

            <div className="step-check">
              <label>
                <input
                  type="checkbox"
                  checked={hole.step2_5 === true}
                  onChange={(e) => updateHoleData(currentHole - 1, 'step2_5', e.target.checked)}
                />
                <strong>2.5. Look at par</strong> (damage control if needed)
              </label>
            </div>

            <div className="step-check">
              <label>
                <input
                  type="checkbox"
                  checked={hole.step3 === true}
                  onChange={(e) => updateHoleData(currentHole - 1, 'step3', e.target.checked)}
                />
                <strong>3. Gave putt a good run</strong> (rolled with intent)
              </label>
            </div>
          </div>

          <div className="notes-input">
            <label>Notes:</label>
            <textarea
              value={hole.notes}
              onChange={(e) => updateHoleData(currentHole - 1, 'notes', e.target.value)}
              placeholder="Optional notes about the hole..."
            />
          </div>
        </div>

        <div className="navigation-buttons">
          <button 
            onClick={previousHole} 
            disabled={currentHole === 1}
            className="nav-btn"
          >
            ← Previous
          </button>
          
          <button onClick={() => setCurrentView('menu')} className="menu-btn">
            Back to Menu
          </button>
          
          <button onClick={nextHole} className="nav-btn next-btn">
            {currentHole === currentRound.holes ? 'Finish Round' : 'Next →'}
          </button>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const completedRounds = savedRounds.filter(round => round.completed);
    
    if (completedRounds.length === 0) {
      return (
        <div className="round-tracker-overview">
          <h2>📊 Round History</h2>
          <p>No completed rounds yet. Start tracking your rounds to see progress!</p>
          <button onClick={() => setCurrentView('menu')} className="back-btn">
            Back to Menu
          </button>
        </div>
      );
    }

    const totalRounds = completedRounds.length;
    const recent5 = completedRounds.slice(-5);
    const recent10 = completedRounds.slice(-10);
    
    const avgScore = (completedRounds.reduce((sum, round) => sum + round.totalScore, 0) / totalRounds).toFixed(1);
    const recent5Avg = recent5.length > 0 ? (recent5.reduce((sum, round) => sum + round.totalScore, 0) / recent5.length).toFixed(1) : 'N/A';
    const recent10Avg = recent10.length > 0 ? (recent10.reduce((sum, round) => sum + round.totalScore, 0) / recent10.length).toFixed(1) : 'N/A';
    const bestRound = Math.min(...completedRounds.map(round => round.totalScore));

    const totalHoles = completedRounds.reduce((sum, round) => sum + round.holes, 0);
    const step1Rate = ((completedRounds.reduce((sum, round) => sum + round.step1Success, 0) / totalHoles) * 100).toFixed(1);
    const step2Rate = ((completedRounds.reduce((sum, round) => sum + round.step2Success, 0) / totalHoles) * 100).toFixed(1);
    const step2_5Rate = ((completedRounds.reduce((sum, round) => sum + round.step2_5Success, 0) / totalHoles) * 100).toFixed(1);
    const step3Rate = ((completedRounds.reduce((sum, round) => sum + round.step3Success, 0) / totalHoles) * 100).toFixed(1);

    return (
      <div className="round-tracker-overview">
        <h2>📊 Round History & Progress</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Scoring Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Rounds:</span>
              <span className="stat-value">{totalRounds}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Overall Average:</span>
              <span className="stat-value">{avgScore}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Recent 5 Average:</span>
              <span className="stat-value">{recent5Avg}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Recent 10 Average:</span>
              <span className="stat-value">{recent10Avg}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Best Round:</span>
              <span className="stat-value">{bestRound}</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>Process Success Rates</h3>
            <div className="stat-item">
              <span className="stat-label">Step 1 (Ball in Play):</span>
              <span className="stat-value">{step1Rate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Step 2 (Birdie Look):</span>
              <span className="stat-value">{step2Rate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Step 2.5 (Par Look):</span>
              <span className="stat-value">{step2_5Rate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Step 3 (Good Putt):</span>
              <span className="stat-value">{step3Rate}%</span>
            </div>
          </div>
        </div>

        <div className="rounds-list">
          <h3>Recent Rounds</h3>
          {completedRounds.slice(-10).reverse().map((round) => (
            <div key={round.id} className="round-item">
              <div className="round-summary">
                <div className="round-date">{round.date}</div>
                <div className="round-score">{round.totalScore} ({round.holes} holes)</div>
                <div className="round-process">
                  Process: {round.step1Success}/{round.holes} | {round.step2Success}/{round.holes} | {round.step2_5Success}/{round.holes} | {round.step3Success}/{round.holes}
                </div>
              </div>
              <button 
                onClick={() => deleteRound(round.id)} 
                className="delete-round-btn"
                title="Delete round"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button onClick={() => setCurrentView('menu')} className="back-btn">
          Back to Menu
        </button>
      </div>
    );
  };

  return (
    <div className="round-tracker">
      {currentView === 'menu' && renderMenu()}
      {currentView === 'playing' && renderPlaying()}
      {currentView === 'overview' && renderOverview()}
    </div>
  );
}

