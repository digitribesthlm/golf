import { useState, useEffect } from 'react';

export default function RoundTracker() {
  const [roundStarted, setRoundStarted] = useState(false);
  const [totalHoles, setTotalHoles] = useState(18);
  const [currentHole, setCurrentHole] = useState(1);
  const [holeData, setHoleData] = useState({});
  const [roundComplete, setRoundComplete] = useState(false);
  const [savedRounds, setSavedRounds] = useState([]);
  const [showOverview, setShowOverview] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);

  // Current hole scoring state
  const [ballInPlay, setBallInPlay] = useState(null);
  const [birdieChance, setBirdieChance] = useState(null);
  const [parChance, setParChance] = useState(null);
  const [puttRun, setPuttRun] = useState(null);
  const [actualScore, setActualScore] = useState('');
  const [holePar, setHolePar] = useState(4);

  useEffect(() => {
    // Load saved rounds from localStorage
    const saved = localStorage.getItem('golfRounds');
    if (saved) {
      setSavedRounds(JSON.parse(saved));
    }
  }, []);

  const startRound = (holes) => {
    setTotalHoles(holes);
    setRoundStarted(true);
    setCurrentHole(1);
    setHoleData({});
    setRoundComplete(false);
    setShowOverview(false);
    resetHoleInputs();
  };

  const resetHoleInputs = () => {
    setBallInPlay(null);
    setBirdieChance(null);
    setParChance(null);
    setPuttRun(null);
    setActualScore('');
    setHolePar(4);
  };

  const nextHole = () => {
    // Save current hole data
    const currentHoleData = {
      par: holePar,
      ballInPlay,
      birdieChance,
      parChance: birdieChance === false ? parChance : null, // Only relevant if no birdie chance
      puttRun,
      actualScore: parseInt(actualScore),
      processScore: calculateProcessScore()
    };

    setHoleData(prev => ({
      ...prev,
      [currentHole]: currentHoleData
    }));

    if (currentHole < totalHoles) {
      setCurrentHole(currentHole + 1);
      resetHoleInputs();
    } else {
      setRoundComplete(true);
    }
  };

  const calculateProcessScore = () => {
    let score = 0;
    if (ballInPlay) score += 1;
    if (birdieChance) score += 1;
    else if (parChance) score += 1; // Step 2.5
    if (puttRun) score += 1;
    return score;
  };

  const saveRound = () => {
    const roundData = {
      id: Date.now(), // Simple ID for round identification
      date: new Date().toISOString(),
      holes: totalHoles,
      holeData: { ...holeData, [currentHole]: {
        par: holePar,
        ballInPlay,
        birdieChance,
        parChance: birdieChance === false ? parChance : null,
        puttRun,
        actualScore: parseInt(actualScore),
        processScore: calculateProcessScore()
      }},
      summary: calculateRoundSummary()
    };

    const updatedRounds = [...savedRounds, roundData];
    setSavedRounds(updatedRounds);
    localStorage.setItem('golfRounds', JSON.stringify(updatedRounds));
    
    // Reset for new round
    setRoundStarted(false);
    setRoundComplete(false);
    resetHoleInputs();
  };

  const deleteRound = (roundId) => {
    const updatedRounds = savedRounds.filter(round => round.id !== roundId);
    setSavedRounds(updatedRounds);
    localStorage.setItem('golfRounds', JSON.stringify(updatedRounds));
    setSelectedRound(null);
  };

  const calculateRoundSummary = () => {
    const allHoles = { ...holeData, [currentHole]: {
      par: holePar,
      ballInPlay,
      birdieChance,
      parChance: birdieChance === false ? parChance : null,
      puttRun,
      actualScore: parseInt(actualScore),
      processScore: calculateProcessScore()
    }};

    let totalScore = 0;
    let totalPar = 0;
    let processScores = { step1: 0, step2: 0, step3: 0 };
    
    Object.values(allHoles).forEach(hole => {
      totalScore += hole.actualScore;
      totalPar += hole.par;
      if (hole.ballInPlay) processScores.step1++;
      if (hole.birdieChance || hole.parChance) processScores.step2++;
      if (hole.puttRun) processScores.step3++;
    });

    return {
      totalScore,
      totalPar,
      scoreToPar: totalScore - totalPar,
      processScores,
      processPercentages: {
        step1: Math.round((processScores.step1 / totalHoles) * 100),
        step2: Math.round((processScores.step2 / totalHoles) * 100),
        step3: Math.round((processScores.step3 / totalHoles) * 100)
      }
    };
  };

  const calculateProgressStats = () => {
    if (savedRounds.length === 0) return null;

    const recent5 = savedRounds.slice(-5);
    const recent10 = savedRounds.slice(-10);
    
    const avgScore = (rounds) => {
      const total = rounds.reduce((sum, round) => sum + round.summary.scoreToPar, 0);
      return (total / rounds.length).toFixed(1);
    };

    const avgProcess = (rounds, step) => {
      const total = rounds.reduce((sum, round) => sum + round.summary.processPercentages[step], 0);
      return Math.round(total / rounds.length);
    };

    return {
      totalRounds: savedRounds.length,
      recent5Avg: recent5.length > 0 ? avgScore(recent5) : 'N/A',
      recent10Avg: recent10.length > 0 ? avgScore(recent10) : 'N/A',
      overallAvg: avgScore(savedRounds),
      bestRound: savedRounds.reduce((best, round) => 
        round.summary.scoreToPar < best.summary.scoreToPar ? round : best
      ),
      processAverages: {
        step1: avgProcess(savedRounds, 'step1'),
        step2: avgProcess(savedRounds, 'step2'),
        step3: avgProcess(savedRounds, 'step3')
      }
    };
  };

  const canProceed = ballInPlay !== null && (birdieChance !== null && (birdieChance || parChance !== null)) && puttRun !== null && actualScore !== '';

  // Overview/History View
  if (showOverview) {
    const progressStats = calculateProgressStats();
    
    return (
      <div className="round-tracker">
        <div className="overview-header">
          <h2>📊 Rounds Overview & Progress</h2>
          <button onClick={() => setShowOverview(false)} className="btn btn-secondary">
            ← Back to Menu
          </button>
        </div>

        {progressStats && (
          <div className="progress-stats">
            <h3>Progress Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Rounds</span>
                <span className="stat-value">{progressStats.totalRounds}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Overall Average</span>
                <span className="stat-value">{progressStats.overallAvg > 0 ? '+' : ''}{progressStats.overallAvg}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Recent 5 Average</span>
                <span className="stat-value">{progressStats.recent5Avg > 0 ? '+' : ''}{progressStats.recent5Avg}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Best Round</span>
                <span className="stat-value">
                  {progressStats.bestRound.summary.scoreToPar > 0 ? '+' : ''}{progressStats.bestRound.summary.scoreToPar}
                </span>
                <span className="stat-date">
                  {new Date(progressStats.bestRound.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="process-averages">
              <h4>Process Averages</h4>
              <div className="process-grid">
                <div className="process-stat">
                  <span className="process-label">Ball in Play</span>
                  <span className="process-value">{progressStats.processAverages.step1}%</span>
                </div>
                <div className="process-stat">
                  <span className="process-label">Created Chances</span>
                  <span className="process-value">{progressStats.processAverages.step2}%</span>
                </div>
                <div className="process-stat">
                  <span className="process-label">Aggressive Putting</span>
                  <span className="process-value">{progressStats.processAverages.step3}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounds-history">
          <h3>Round History</h3>
          {savedRounds.length === 0 ? (
            <p className="no-rounds">No rounds saved yet. Play a round to start tracking your progress!</p>
          ) : (
            <div className="rounds-grid">
              {savedRounds.slice().reverse().map((round) => (
                <div key={round.id} className="round-card">
                  <div className="round-header">
                    <span className="round-date">{new Date(round.date).toLocaleDateString()}</span>
                    <span className="round-holes">{round.holes} holes</span>
                    <button 
                      onClick={() => deleteRound(round.id)}
                      className="btn btn-danger btn-small"
                      title="Delete round"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="round-score">
                    <span className="score-display">
                      {round.summary.scoreToPar > 0 ? '+' : ''}{round.summary.scoreToPar}
                    </span>
                    <span className="total-score">({round.summary.totalScore})</span>
                  </div>
                  <div className="round-process">
                    <div className="process-item">
                      <span>Ball in Play: {round.summary.processPercentages.step1}%</span>
                    </div>
                    <div className="process-item">
                      <span>Chances: {round.summary.processPercentages.step2}%</span>
                    </div>
                    <div className="process-item">
                      <span>Putting: {round.summary.processPercentages.step3}%</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedRound(round)}
                    className="btn btn-outline btn-small"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Round Detail Modal */}
        {selectedRound && (
          <div className="round-detail-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Round Details - {new Date(selectedRound.date).toLocaleDateString()}</h3>
                <button onClick={() => setSelectedRound(null)} className="btn btn-secondary">✕</button>
              </div>
              <div className="modal-body">
                <div className="round-summary-detail">
                  <div className="summary-stats">
                    <div className="stat">
                      <span>Total Score: {selectedRound.summary.totalScore}</span>
                    </div>
                    <div className="stat">
                      <span>To Par: {selectedRound.summary.scoreToPar > 0 ? '+' : ''}{selectedRound.summary.scoreToPar}</span>
                    </div>
                    <div className="stat">
                      <span>Holes: {selectedRound.holes}</span>
                    </div>
                  </div>
                </div>
                <div className="hole-by-hole">
                  <h4>Hole by Hole</h4>
                  <div className="holes-grid">
                    {Object.entries(selectedRound.holeData).map(([holeNum, holeData]) => (
                      <div key={holeNum} className="hole-detail">
                        <div className="hole-number">#{holeNum}</div>
                        <div className="hole-info">
                          <span>Par {holeData.par} - Score {holeData.actualScore}</span>
                          <div className="hole-process">
                            <span className={holeData.ballInPlay ? 'success' : 'fail'}>
                              {holeData.ballInPlay ? '✅' : '❌'} Ball in Play
                            </span>
                            <span className={holeData.birdieChance || holeData.parChance ? 'success' : 'fail'}>
                              {holeData.birdieChance || holeData.parChance ? '✅' : '❌'} Chance Created
                            </span>
                            <span className={holeData.puttRun ? 'success' : 'fail'}>
                              {holeData.puttRun ? '✅' : '❌'} Aggressive Putt
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!roundStarted) {
    return (
      <div className="round-tracker">
        <div className="tracker-header">
          <h2>🎯 Round Tracker</h2>
          <p>Track your performance using the 4-step framework</p>
        </div>

        <div className="framework-summary">
          <h3>The Four Steps</h3>
          <div className="steps">
            <div className="step">
              <strong>1. Put the ball in play</strong>
              <p>Avoid disaster (OB, water, lost ball). Rough is fine!</p>
            </div>
            <div className="step">
              <strong>2. Give yourself a look at birdie</strong>
              <p>Get around/on the green for an opportunity</p>
            </div>
            <div className="step">
              <strong>2.5. If no birdie → look at par</strong>
              <p>Damage control, avoid doubles</p>
            </div>
            <div className="step">
              <strong>3. Give every putt a good run</strong>
              <p>Read it, roll it with intent</p>
            </div>
          </div>
        </div>

        <div className="round-options">
          <h3>Start New Round</h3>
          <div className="round-buttons">
            <button onClick={() => startRound(9)} className="btn btn-primary">
              9 Holes
            </button>
            <button onClick={() => startRound(18)} className="btn btn-primary">
              18 Holes
            </button>
          </div>
          {savedRounds.length > 0 && (
            <div className="overview-button">
              <button onClick={() => setShowOverview(true)} className="btn btn-secondary">
                📊 View Overview & Progress
              </button>
            </div>
          )}
        </div>

        {savedRounds.length > 0 && (
          <div className="saved-rounds">
            <h3>Recent Rounds</h3>
            <div className="rounds-list">
              {savedRounds.slice(-3).reverse().map((round, index) => (
                <div key={index} className="round-summary">
                  <div className="round-info">
                    <span className="round-date">{new Date(round.date).toLocaleDateString()}</span>
                    <span className="round-holes">{round.holes} holes</span>
                    <span className="round-score">
                      {round.summary.scoreToPar > 0 ? '+' : ''}{round.summary.scoreToPar}
                    </span>
                  </div>
                  <div className="process-summary">
                    Step 1: {round.summary.processPercentages.step1}% | 
                    Step 2: {round.summary.processPercentages.step2}% | 
                    Step 3: {round.summary.processPercentages.step3}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (roundComplete) {
    const summary = calculateRoundSummary();
    return (
      <div className="round-tracker">
        <div className="round-complete">
          <h2>🏌️‍♂️ Round Complete!</h2>
          
          <div className="final-summary">
            <div className="score-summary">
              <h3>Final Score</h3>
              <div className="score-display">
                <span className="total-score">{summary.totalScore}</span>
                <span className="par-info">
                  ({summary.scoreToPar > 0 ? '+' : ''}{summary.scoreToPar} to par)
                </span>
              </div>
            </div>

            <div className="process-summary">
              <h3>Process Performance</h3>
              <div className="process-stats">
                <div className="stat">
                  <span className="stat-label">Ball in Play</span>
                  <span className="stat-value">{summary.processPercentages.step1}%</span>
                  <span className="stat-count">({summary.processScores.step1}/{totalHoles})</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Created Chances</span>
                  <span className="stat-value">{summary.processPercentages.step2}%</span>
                  <span className="stat-count">({summary.processScores.step2}/{totalHoles})</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Aggressive Putting</span>
                  <span className="stat-value">{summary.processPercentages.step3}%</span>
                  <span className="stat-count">({summary.processScores.step3}/{totalHoles})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="round-actions">
            <button onClick={saveRound} className="btn btn-primary">
              💾 Save Round
            </button>
            <button onClick={() => setRoundStarted(false)} className="btn btn-secondary">
              🏠 Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="round-tracker">
      <div className="hole-header">
        <h2>Hole {currentHole} of {totalHoles}</h2>
        <div className="par-selector">
          <label>Par: </label>
          <select value={holePar} onChange={(e) => setHolePar(parseInt(e.target.value))}>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
      </div>

      <div className="hole-tracking">
        <div className="step-tracking">
          <div className="step">
            <h3>1. Put the ball in play</h3>
            <p>Avoid disaster (OB, water, lost ball)</p>
            <div className="step-options">
              <button 
                className={`btn ${ballInPlay === true ? 'btn-success' : 'btn-outline'}`}
                onClick={() => setBallInPlay(true)}
              >
                ✅ In Play
              </button>
              <button 
                className={`btn ${ballInPlay === false ? 'btn-danger' : 'btn-outline'}`}
                onClick={() => setBallInPlay(false)}
              >
                ❌ Disaster
              </button>
            </div>
          </div>

          <div className="step">
            <h3>2. Give yourself a look at birdie</h3>
            <p>Get around/on the green for an opportunity</p>
            <div className="step-options">
              <button 
                className={`btn ${birdieChance === true ? 'btn-success' : 'btn-outline'}`}
                onClick={() => {
                  setBirdieChance(true);
                  setParChance(null); // Reset par chance if birdie chance exists
                }}
              >
                ✅ Birdie Look
              </button>
              <button 
                className={`btn ${birdieChance === false ? 'btn-warning' : 'btn-outline'}`}
                onClick={() => setBirdieChance(false)}
              >
                ❌ No Birdie
              </button>
            </div>
          </div>

          {birdieChance === false && (
            <div className="step step-2-5">
              <h3>2.5. Give yourself a look at par</h3>
              <p>Damage control, avoid doubles</p>
              <div className="step-options">
                <button 
                  className={`btn ${parChance === true ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => setParChance(true)}
                >
                  ✅ Par Look
                </button>
                <button 
                  className={`btn ${parChance === false ? 'btn-danger' : 'btn-outline'}`}
                  onClick={() => setParChance(false)}
                >
                  ❌ No Par
                </button>
              </div>
            </div>
          )}

          <div className="step">
            <h3>3. Give every putt a good run</h3>
            <p>Read it, roll it with intent</p>
            <div className="step-options">
              <button 
                className={`btn ${puttRun === true ? 'btn-success' : 'btn-outline'}`}
                onClick={() => setPuttRun(true)}
              >
                ✅ Aggressive
              </button>
              <button 
                className={`btn ${puttRun === false ? 'btn-warning' : 'btn-outline'}`}
                onClick={() => setPuttRun(false)}
              >
                ❌ Tentative
              </button>
            </div>
          </div>
        </div>

        <div className="score-input">
          <h3>Actual Score</h3>
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={actualScore}
            onChange={(e) => setActualScore(e.target.value)}
            placeholder="Enter score"
            className="score-field"
          />
        </div>

        <div className="hole-actions">
          <button 
            onClick={nextHole}
            disabled={!canProceed}
            className="btn btn-primary btn-large"
          >
            {currentHole === totalHoles ? '🏁 Finish Round' : '➡️ Next Hole'}
          </button>
        </div>
      </div>
    </div>
  );
}

