import { useState, useEffect } from 'react';
import { Lock, CheckCircle, ArrowRight, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

const LevelSelect = ({ onSelectLevel, onBack }) => {
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [bestTimes, setBestTimes] = useState({});
  const [bestMoves, setBestMoves] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  
  const LEVELS_PER_PAGE = 5;
  const TOTAL_LEVELS = 100;
  
  // Generate all 100 levels programmatically
  const allLevels = Array.from({ length: TOTAL_LEVELS }, (_, index) => {
    const levelId = index + 1;
    let size, difficulty;
    
    // Determine board size and difficulty based on level number
    if (levelId <= 20) {
      size = 7; // First 20 levels use 7x7 board
      difficulty = levelId <= 5 ? "Easy" : levelId <= 15 ? "Medium" : "Hard";
    } else if (levelId <= 60) {
      size = 8; // Levels 21-60 use 8x8 board
      difficulty = levelId <= 30 ? "Medium" : levelId <= 45 ? "Hard" : "Expert";
    } else {
      size = 9; // Levels 61-100 use 9x9 board
      difficulty = levelId <= 75 ? "Hard" : "Expert";
    }
    
    // Generate level name based on level number
    let name;
    if (levelId <= 5) {
      const nameMap = ["Novice", "Apprentice", "Knight", "Bishop", "Queen"];
      name = nameMap[levelId - 1] || `Level ${levelId}`;
    } else {
      // Use chess-themed names for higher levels
      const rank = Math.ceil((levelId - 5) / 10);
      const themes = ["Pawn", "Knight", "Bishop", "Rook", "Queen", "King", "Grandmaster", "Champion", "Master", "Legend"];
      name = `${themes[rank % themes.length]} ${levelId}`;
    }
    
    return { id: levelId, size, name, difficulty };
  });
  
  // Get current visible levels based on pagination
  const getVisibleLevels = () => {
    const startIndex = currentPage * LEVELS_PER_PAGE;
    const endIndex = Math.min(startIndex + LEVELS_PER_PAGE, TOTAL_LEVELS);
    
    return allLevels.slice(startIndex, endIndex);
  };
  
  // Current visible levels
  const visibleLevels = getVisibleLevels();
  
  // Calculate total pages
  const totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedUnlockedLevels = localStorage.getItem('queensPuzzleUnlockedLevels');
    const savedCompletedLevels = localStorage.getItem('queensPuzzleCompletedLevels');
    const savedBestTimes = localStorage.getItem('queensPuzzleBestTimes');
    const savedBestMoves = localStorage.getItem('queensPuzzleBestMoves');
    
    if (savedUnlockedLevels) {
      setUnlockedLevels(parseInt(savedUnlockedLevels));
    }
    
    if (savedCompletedLevels) {
      const completedLevelsList = JSON.parse(savedCompletedLevels);
      setCompletedLevels(completedLevelsList);
      
      // Auto-unlock the next level after the highest completed level
      if (completedLevelsList.length > 0) {
        const highestCompletedLevel = Math.max(...completedLevelsList);
        const nextLevelToUnlock = highestCompletedLevel + 1;
        
        // If the next level should be unlocked, but isn't yet
        if (nextLevelToUnlock > (savedUnlockedLevels ? parseInt(savedUnlockedLevels) : unlockedLevels)) {
          setUnlockedLevels(nextLevelToUnlock);
          localStorage.setItem('queensPuzzleUnlockedLevels', nextLevelToUnlock.toString());
        }
      }
    }
    
    if (savedBestTimes) {
      setBestTimes(JSON.parse(savedBestTimes));
    }
    
    if (savedBestMoves) {
      setBestMoves(JSON.parse(savedBestMoves));
    }
  }, []);

  // Format time for display
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return '--:--';
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "text-green-500";
      case "Medium": return "text-blue-500";
      case "Hard": return "text-orange-500";
      case "Expert": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  // Handle pagination
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="level-select-container">
      <div className="level-select-header">
        <button className="btn-icon" onClick={onBack}>
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h1 className="text-xl font-bold">Select Level</h1>
      </div>
      
      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button 
          className="pagination-button" 
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="page-indicator">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button 
          className="pagination-button" 
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="levels-grid">
        {visibleLevels.map((level) => {
          const isUnlocked = level.id <= unlockedLevels;
          const isCompleted = completedLevels.includes(level.id);
          const bestTime = bestTimes[level.id];
          const bestMove = bestMoves[level.id];
          
          return (
            <div 
                key={level.id}
                className={`level-card ${isUnlocked ? 'unlocked' : 'locked'} ${
                  isUnlocked
                    ? isCompleted
                      ? 'completed-gradient'
                      : 'incomplete-gradient'
                    : ''
                }`}
                onClick={() => isUnlocked && onSelectLevel(level)}
              >

              <div className="level-card-inner">
                <div className="level-header">
                  <span className="level-number">Level {level.id}</span>
                  {isCompleted && <CheckCircle className="text-green-500 check-circle" size={18} />}
                </div>
                
                <h3 className="level-name">{level.name}</h3>
                <p className={`level-difficulty ${getDifficultyColor(level.difficulty)}`}>
                  {level.difficulty}
                </p>
                
                <div className="level-size">
                  {level.size} × {level.size} Board
                </div>
                
                {isUnlocked ? (
                  <div className="level-stats">
                    {isCompleted && (
                      <>
                        <div className="level-stat">
                          <span className="stat-label">Best Time:</span>
                          <span className="stat-value">{formatTime(bestTime)}</span>
                        </div>
                        <div className="level-stat">
                          <span className="stat-label">Best Moves:</span>
                          <span className="stat-value">{bestMove || '--'}</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="level-locked">
                    <Lock size={24} />
                    <span>Complete previous level to unlock</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="achievements-section">
        <h2 className="text-lg font-bold flex items-center">
          <Trophy className="mr-2" size={20} />
          Achievements
        </h2>
        
        <div className="achievements-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(completedLevels.length / TOTAL_LEVELS) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {completedLevels.length}/{TOTAL_LEVELS} Levels Completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;