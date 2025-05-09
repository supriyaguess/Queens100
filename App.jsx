// import { useState, useEffect } from 'react';
// import { ChevronDown, HelpCircle, Settings, Crown, RefreshCw, ArrowLeft } from 'lucide-react';
// import './App.css';
// import Board from './components/Board';
// import Timer from './components/Timer';
// import { generateSimpleRandomBoard } from './utils/boardGenerator';
// import HowToPlay from './components/HowToPlay';
// import SuccessModal from './components/SuccessModal';

// function App() {
//   const [boardSize, setBoardSize] = useState(7);
//   const [board, setBoard] = useState([]);
//   const [queens, setQueens] = useState([]);
//   const [marks, setMarks] = useState([]);
//   const [gameComplete, setGameComplete] = useState(false);
//   const [errors, setErrors] = useState([]);
//   const [howToPlayOpen, setHowToPlayOpen] = useState(false);
//   const [resetKey, setResetKey] = useState(0);
//   const [timerKey, setTimerKey] = useState(0);
//   const [timerActive, setTimerActive] = useState(true);
//   const [successModalOpen, setSuccessModalOpen] = useState(false);
//   const [moveCount, setMoveCount] = useState(0);
//   const [gameTime, setGameTime] = useState(0);

//   // Generate a new board when component mounts or boardSize changes
//   useEffect(() => {
//     const newBoard = generateSimpleRandomBoard(boardSize);
//     setBoard(newBoard);
//     setQueens([]);
//     setMarks([]);
//     setErrors([]);
//     setGameComplete(false);
//     setMoveCount(0);
//     setTimerKey(prev => prev + 1);
//     setTimerActive(true);
//   }, [boardSize, resetKey]);

//   const handleCellClick = (row, col, double = false) => {
//     // If the game is complete, don't allow further moves
//     if (gameComplete) return;
    
//     // Increment move count
//     setMoveCount(prev => prev + 1);

//     const cellPos = `${row},${col}`;
    
//     // Double click: place/remove a queen
//     if (double) {
//       // Check if there's already a queen at this position
//       const queenIndex = queens.findIndex(pos => pos === cellPos);
      
//       if (queenIndex !== -1) {
//         // Remove queen if it exists
//         const newQueens = [...queens];
//         newQueens.splice(queenIndex, 1);
//         setQueens(newQueens);
//         validateBoard(newQueens);
//       } else {
//         // Add a queen
//         const newQueens = [...queens, cellPos];
//         setQueens(newQueens);
        
//         // Remove any mark at this position
//         const markIndex = marks.findIndex(pos => pos === cellPos);
//         if (markIndex !== -1) {
//           const newMarks = [...marks];
//           newMarks.splice(markIndex, 1);
//           setMarks(newMarks);
//         }
        
//         // Validate board after placing a queen
//         validateBoard(newQueens);
//       }
//     } else {
//       // Single click: place/remove a mark (X)
//       // Check if there's already a mark at this position
//       const markIndex = marks.findIndex(pos => pos === cellPos);
      
//       // Check if there's a queen at this position
//       const hasQueen = queens.some(pos => pos === cellPos);
      
//       if (!hasQueen) {
//         if (markIndex !== -1) {
//           // Remove mark if it exists
//           const newMarks = [...marks];
//           newMarks.splice(markIndex, 1);
//           setMarks(newMarks);
//         } else {
//           // Add a mark
//           setMarks([...marks, cellPos]);
//         }
//       }
//     }
//   };

//   const validateBoard = (currentQueens) => {
//     const newErrors = [];
    
//     // Check rows, columns, regions, and adjacency
//     const rowCounts = {};
//     const colCounts = {};
//     const regionCounts = {};
    
//     // Check each queen against every other queen
//     for (let i = 0; i < currentQueens.length; i++) {
//       const [row1, col1] = currentQueens[i].split(',').map(Number);
//       const region1 = board[row1][col1].region;
      
//       // Count queens in rows, columns, and regions
//       rowCounts[row1] = (rowCounts[row1] || 0) + 1;
//       colCounts[col1] = (colCounts[col1] || 0) + 1;
//       regionCounts[region1] = (regionCounts[region1] || 0) + 1;
      
//       // Check queen adjacency
//       for (let j = i + 1; j < currentQueens.length; j++) {
//         const [row2, col2] = currentQueens[j].split(',').map(Number);
        
//         // Check if queens are adjacent (including diagonally)
//         const rowDiff = Math.abs(row1 - row2);
//         const colDiff = Math.abs(col1 - col2);
        
//         if (rowDiff <= 1 && colDiff <= 1) {
//           newErrors.push(`${row1},${col1}`);
//           newErrors.push(`${row2},${col2}`);
//         }
//       }
//     }
    
//     // Add errors for rows, columns, and regions with multiple queens
//     Object.entries(rowCounts).forEach(([row, count]) => {
//       if (count > 1) {
//         currentQueens.forEach(pos => {
//           const [qRow] = pos.split(',').map(Number);
//           if (qRow === Number(row)) {
//             newErrors.push(pos);
//           }
//         });
//       }
//     });
    
//     Object.entries(colCounts).forEach(([col, count]) => {
//       if (count > 1) {
//         currentQueens.forEach(pos => {
//           const [, qCol] = pos.split(',').map(Number);
//           if (qCol === Number(col)) {
//             newErrors.push(pos);
//           }
//         });
//       }
//     });
    
//     Object.entries(regionCounts).forEach(([region, count]) => {
//       if (count > 1) {
//         currentQueens.forEach(pos => {
//           const [qRow, qCol] = pos.split(',').map(Number);
//           if (board[qRow][qCol].region === region) {
//             newErrors.push(pos);
//           }
//         });
//       }
//     });
    
//     // Remove duplicates from errors array
//     setErrors([...new Set(newErrors)]);
    
//     // Check if the game is complete
//     const allRowsFilled = Object.keys(rowCounts).length === boardSize && 
//                            Object.values(rowCounts).every(count => count === 1);
//     const allColsFilled = Object.keys(colCounts).length === boardSize && 
//                            Object.values(colCounts).every(count => count === 1);
//     const allRegionsFilled = Object.keys(regionCounts).length === boardSize && 
//                              Object.values(regionCounts).every(count => count === 1);
//     const noAdjacent = newErrors.length === 0;
    
//     if (allRowsFilled && allColsFilled && allRegionsFilled && noAdjacent && currentQueens.length === boardSize) {
//       setGameComplete(true);
//       setTimerActive(false);
//       setSuccessModalOpen(true);
//     }
//   };

//   const resetGame = () => {
//     setResetKey(prev => prev + 1);
//   };

//   const handleTimerUpdate = (timeInSeconds) => {
//     setGameTime(timeInSeconds);
//   };

//   const handleHint = () => {
//     // Simple hint system that marks cells where queens cannot be placed
//     // For now, just mark all cells with errors
//     if (errors.length > 0) {
//       // Highlight the first error
//       const errorPos = errors[0].split(',').map(Number);
//       alert(`Check your queen at row ${errorPos[0] + 1}, column ${errorPos[1] + 1}`);
//     } else if (queens.length < boardSize) {
//       alert(`You need to place ${boardSize - queens.length} more queens`);
//     }
//   };

//   return (
//     <div className="game-container">
//       <header className="game-header">
//         <div className="flex items-center">
//           <button className="btn-icon" aria-label="Back">
//             <ArrowLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold flex items-center">
//             <Crown className="mr-2" size={24} />
//             Queens
//           </h1>
//         </div>
//         <div className="flex">
//           <button 
//             className="btn-icon" 
//             aria-label="Help"
//             onClick={() => setHowToPlayOpen(!howToPlayOpen)}
//           >
//             <HelpCircle size={24} />
//           </button>
//           <button className="btn-icon" aria-label="Settings">
//             <Settings size={24} />
//           </button>
//         </div>
//       </header>

//       <div className="game-content">
//         <div className="timer-container">
//           <Timer key={timerKey} active={timerActive} onUpdate={handleTimerUpdate} />
//           <button className="btn-clear" aria-label="Clear">
//             Clear
//           </button>
//         </div>

//         <Board 
//           board={board}
//           queens={queens}
//           marks={marks}
//           errors={errors}
//           onCellClick={handleCellClick}
//         />

//         <div className="game-controls">
//           <button 
//             className="btn-control" 
//             onClick={resetGame}
//           >
//             <RefreshCw size={18} className="mr-2" />
//             Restart
//           </button>
//           <button 
//             className="btn-control"
//             onClick={handleHint}
//           >
//             Hint
//           </button>
//         </div>

//         {howToPlayOpen && <HowToPlay onClose={() => setHowToPlayOpen(false)} />}
        
//         {successModalOpen && (
//           <SuccessModal 
//             moveCount={moveCount}
//             timeInSeconds={gameTime}
//             onClose={() => setSuccessModalOpen(false)}
//             onRestart={resetGame}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Settings, Crown, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import './App.css';
import Board from './components/Board';
import Timer from './components/Timer';
import { generateSimpleRandomBoard } from './utils/boardGenerator';
import HowToPlay from './components/HowToPlay';
import SuccessModal from './components/SuccessModal';
import LevelSelect from './components/LevelSelect';
import { Analytics } from "@vercel/analytics/react"

function App() {
  // Game state
  const [board, setBoard] = useState([]);
  const [queens, setQueens] = useState([]);
  const [marks, setMarks] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [errors, setErrors] = useState([]);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  
  // Level system state
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [bestTimes, setBestTimes] = useState({});
  const [bestMoves, setBestMoves] = useState({});

  // Load user progress from localStorage
  useEffect(() => {
    const savedUnlockedLevels = localStorage.getItem('queensPuzzleUnlockedLevels');
    const savedCompletedLevels = localStorage.getItem('queensPuzzleCompletedLevels');
    const savedBestTimes = localStorage.getItem('queensPuzzleBestTimes');
    const savedBestMoves = localStorage.getItem('queensPuzzleBestMoves');
    
    if (savedUnlockedLevels) {
      setUnlockedLevels(parseInt(savedUnlockedLevels));
    }
    
    if (savedCompletedLevels) {
      setCompletedLevels(JSON.parse(savedCompletedLevels));
    }
    
    if (savedBestTimes) {
      setBestTimes(JSON.parse(savedBestTimes));
    }
    
    if (savedBestMoves) {
      setBestMoves(JSON.parse(savedBestMoves));
    }
  }, []);

  // Generate a new board when a level is selected or game is reset
  useEffect(() => {
    if (currentLevel) {
      const newBoard = generateSimpleRandomBoard(currentLevel.size);
      setBoard(newBoard);
      setQueens([]);
      setMarks([]);
      setErrors([]);
      setGameComplete(false);
      setMoveCount(0);
      setTimerKey(prev => prev + 1);
      setTimerActive(true);
    }
  }, [currentLevel, resetKey]);

  const handleCellClick = (row, col, double = false) => {
    // If the game is complete, don't allow further moves
    if (gameComplete) return;
    
    // Increment move count
    setMoveCount(prev => prev + 1);

    const cellPos = `${row},${col}`;
    
    // Double click: place/remove a queen
    if (double) {
      // Check if there's already a queen at this position
      const queenIndex = queens.findIndex(pos => pos === cellPos);
      
      if (queenIndex !== -1) {
        // Remove queen if it exists
        const newQueens = [...queens];
        newQueens.splice(queenIndex, 1);
        setQueens(newQueens);
        validateBoard(newQueens);
      } else {
        // Add a queen
        const newQueens = [...queens, cellPos];
        setQueens(newQueens);
        
        // Remove any mark at this position
        const markIndex = marks.findIndex(pos => pos === cellPos);
        if (markIndex !== -1) {
          const newMarks = [...marks];
          newMarks.splice(markIndex, 1);
          setMarks(newMarks);
        }
        
        // Validate board after placing a queen
        validateBoard(newQueens);
      }
    } else {
      // Single click: place/remove a mark (X)
      // Check if there's already a mark at this position
      const markIndex = marks.findIndex(pos => pos === cellPos);
      
      // Check if there's a queen at this position
      const hasQueen = queens.some(pos => pos === cellPos);
      
      if (!hasQueen) {
        if (markIndex !== -1) {
          // Remove mark if it exists
          const newMarks = [...marks];
          newMarks.splice(markIndex, 1);
          setMarks(newMarks);
        } else {
          // Add a mark
          setMarks([...marks, cellPos]);
        }
      }
    }
  };

  const validateBoard = (currentQueens) => {
    const newErrors = [];
    
    // Check rows, columns, regions, and adjacency
    const rowCounts = {};
    const colCounts = {};
    const regionCounts = {};
    
    // Check each queen against every other queen
    for (let i = 0; i < currentQueens.length; i++) {
      const [row1, col1] = currentQueens[i].split(',').map(Number);
      const region1 = board[row1][col1].region;
      
      // Count queens in rows, columns, and regions
      rowCounts[row1] = (rowCounts[row1] || 0) + 1;
      colCounts[col1] = (colCounts[col1] || 0) + 1;
      regionCounts[region1] = (regionCounts[region1] || 0) + 1;
      
      // Check queen adjacency
      for (let j = i + 1; j < currentQueens.length; j++) {
        const [row2, col2] = currentQueens[j].split(',').map(Number);
        
        // Check if queens are adjacent (including diagonally)
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        
        if (rowDiff <= 1 && colDiff <= 1) {
          newErrors.push(`${row1},${col1}`);
          newErrors.push(`${row2},${col2}`);
        }
      }
    }
    
    // Add errors for rows, columns, and regions with multiple queens
    Object.entries(rowCounts).forEach(([row, count]) => {
      if (count > 1) {
        currentQueens.forEach(pos => {
          const [qRow] = pos.split(',').map(Number);
          if (qRow === Number(row)) {
            newErrors.push(pos);
          }
        });
      }
    });
    
    Object.entries(colCounts).forEach(([col, count]) => {
      if (count > 1) {
        currentQueens.forEach(pos => {
          const [, qCol] = pos.split(',').map(Number);
          if (qCol === Number(col)) {
            newErrors.push(pos);
          }
        });
      }
    });
    
    Object.entries(regionCounts).forEach(([region, count]) => {
      if (count > 1) {
        currentQueens.forEach(pos => {
          const [qRow, qCol] = pos.split(',').map(Number);
          if (board[qRow][qCol].region === region) {
            newErrors.push(pos);
          }
        });
      }
    });
    
    // Remove duplicates from errors array
    setErrors([...new Set(newErrors)]);
    
    // Check if the game is complete
    if (currentLevel) {
      const boardSize = currentLevel.size;
      const allRowsFilled = Object.keys(rowCounts).length === boardSize && 
                            Object.values(rowCounts).every(count => count === 1);
      const allColsFilled = Object.keys(colCounts).length === boardSize && 
                            Object.values(colCounts).every(count => count === 1);
      const allRegionsFilled = Object.keys(regionCounts).length === boardSize && 
                               Object.values(regionCounts).every(count => count === 1);
      const noAdjacent = newErrors.length === 0;
      
      if (allRowsFilled && allColsFilled && allRegionsFilled && noAdjacent && currentQueens.length === boardSize) {
        setGameComplete(true);
        setTimerActive(false);
        setSuccessModalOpen(true);
        
        // Handle level completion
        handleLevelComplete();
      }
    }
  };

  const handleLevelComplete = () => {
    if (!currentLevel) return;
    
    const levelId = currentLevel.id;
    
    // Update completed levels
    if (!completedLevels.includes(levelId)) {
      const newCompletedLevels = [...completedLevels, levelId];
      setCompletedLevels(newCompletedLevels);
      localStorage.setItem('queensPuzzleCompletedLevels', JSON.stringify(newCompletedLevels));
    }
    
    // Unlock next level if this is the highest level completed
    if (levelId === unlockedLevels && levelId < 5) {
      const newUnlockedLevel = levelId + 1;
      setUnlockedLevels(newUnlockedLevel);
      localStorage.setItem('queensPuzzleUnlockedLevels', newUnlockedLevel.toString());
    }
    
    // Update best time if better than previous
    const currentBestTime = bestTimes[levelId] || Infinity;
    if (gameTime < currentBestTime) {
      const newBestTimes = {...bestTimes, [levelId]: gameTime};
      setBestTimes(newBestTimes);
      localStorage.setItem('queensPuzzleBestTimes', JSON.stringify(newBestTimes));
    }
    
    // Update best moves if better than previous
    const currentBestMoves = bestMoves[levelId] || Infinity;
    if (moveCount < currentBestMoves) {
      const newBestMoves = {...bestMoves, [levelId]: moveCount};
      setBestMoves(newBestMoves);
      localStorage.setItem('queensPuzzleBestMoves', JSON.stringify(newBestMoves));
    }
  };

  const resetGame = () => {
    setResetKey(prev => prev + 1);
  };

  const handleTimerUpdate = (timeInSeconds) => {
    setGameTime(timeInSeconds);
  };

  const handleHint = () => {
    // Simple hint system that marks cells where queens cannot be placed
    // For now, just mark all cells with errors
    if (errors.length > 0) {
      // Highlight the first error
      const errorPos = errors[0].split(',').map(Number);
      alert(`Check your queen at row ${errorPos[0] + 1}, column ${errorPos[1] + 1}`);
    } else if (currentLevel && queens.length < currentLevel.size) {
      alert(`You need to place ${currentLevel.size - queens.length} more queens`);
    }
  };

  const handleSelectLevel = (level) => {
    setCurrentLevel(level);
    setShowLevelSelect(false);
  };

  const handleBackToLevels = () => {
    setShowLevelSelect(true);
    setTimerActive(false);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
  };

  const handlePlayAgain = () => {
    resetGame();
    setSuccessModalOpen(false);
  };

  // const handlePlayNextLevel = () => {
  //   if (currentLevel && currentLevel.id < 5) {
  //     // Find the next level
  //     const nextLevelId = currentLevel.id + 1;
  //     const levels = [
  //       { id: 1, size: 5, name: "Novice", difficulty: "Easy" },
  //       { id: 2, size: 6, name: "Apprentice", difficulty: "Medium" },
  //       { id: 3, size: 7, name: "Knight", difficulty: "Medium" },
  //       { id: 4, size: 8, name: "Bishop", difficulty: "Hard" },
  //       { id: 5, size: 9, name: "Queen", difficulty: "Expert" }
  //     ];
      
  //     const nextLevel = levels.find(level => level.id === nextLevelId);
  //     if (nextLevel) {
  //       setCurrentLevel(nextLevel);
  //       setSuccessModalOpen(false);
  //       resetGame();
  //     }
  //   } else {
  //     setSuccessModalOpen(false);
  //     handleBackToLevels();
  //   }
  // };

  const handlePlayNextLevel = () => {
    if (currentLevel && currentLevel.id < 100) {
      // Find the next level
      const nextLevelId = currentLevel.id + 1;
      
      // Generate level data
      let size, difficulty, name;
      
      // Determine board size and difficulty based on level number
      if (nextLevelId <= 20) {
        size = 7; // First 20 levels use 7x7 board
        difficulty = nextLevelId <= 5 ? "Easy" : nextLevelId <= 15 ? "Medium" : "Hard";
      } else if (nextLevelId <= 60) {
        size = 8; // Levels 21-60 use 8x8 board
        difficulty = nextLevelId <= 30 ? "Medium" : nextLevelId <= 45 ? "Hard" : "Expert";
      } else {
        size = 9; // Levels 61-100 use 9x9 board
        difficulty = nextLevelId <= 75 ? "Hard" : "Expert";
      }
      
      // Generate level name based on level number
      if (nextLevelId <= 5) {
        const nameMap = ["Novice", "Apprentice", "Knight", "Bishop", "Queen"];
        name = nameMap[nextLevelId - 1] || `Level ${nextLevelId}`;
      } else {
        // Use chess-themed names for higher levels
        const rank = Math.ceil((nextLevelId - 5) / 10);
        const themes = ["Pawn", "Knight", "Bishop", "Rook", "Queen", "King", "Grandmaster", "Champion", "Master", "Legend"];
        name = `${themes[rank % themes.length]} ${nextLevelId}`;
      }
      
      const nextLevel = { id: nextLevelId, size, name, difficulty };
      setCurrentLevel(nextLevel);
      setSuccessModalOpen(false);
      resetGame();
    } else {
      setSuccessModalOpen(false);
      handleBackToLevels();
    }
  };

  return (
    <div className="game-container">
      {showLevelSelect ? (
        <LevelSelect 
          onSelectLevel={handleSelectLevel}
          onBack={() => {}}
        />
      ) : (
        <>
          <header className="game-header">
            <div className="flex items-center">
              <button 
                className="btn-icon" 
                aria-label="Back to Levels"
                onClick={handleBackToLevels}
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold flex items-center">
                <Crown className="mr-2" size={24} />
                Queens - Level {currentLevel?.id}: {currentLevel?.name}
              </h1>
            </div>
            <div className="flex">
              <button 
                className="btn-icon" 
                aria-label="Help"
                onClick={() => setHowToPlayOpen(!howToPlayOpen)}
              >
                <HelpCircle size={24} />
              </button>
              <button className="btn-icon" aria-label="Settings">
                <Settings size={24} />
              </button>
            </div>
          </header>

          <div className="game-content">
            <div className="timer-container">
              <Timer key={timerKey} active={timerActive} onUpdate={handleTimerUpdate} />
              <button 
                className="btn-clear" 
                aria-label="Clear"
                onClick={() => {
                  setQueens([]);
                  setMarks([]);
                  setErrors([]);
                }}
              >
                Clear
              </button>
            </div>

            <Board 
              board={board}
              queens={queens}
              marks={marks}
              errors={errors}
              onCellClick={handleCellClick}
            />

            {/* <div className="game-controls">
              <button 
                className="btn-control" 
                onClick={resetGame}
              >
                <RefreshCw size={18} className="mr-2" />
                Restart
              </button>
              <button 
                className="btn-control"
                onClick={handleHint}
              >
                Hint
              </button>
            </div> */}

            {howToPlayOpen && <HowToPlay onClose={() => setHowToPlayOpen(false)} />}
            
            {successModalOpen && (
                <>
                  {/* Overlay to block interaction with background */}
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional dimming
                      zIndex: 999, // Make sure it's behind the modal
                      pointerEvents: 'auto', // Block clicks to background
                    }}
                  />

                  {/* Success Modal */}
                  <div style={{ position: '', zIndex: 1000 }}>
                    <SuccessModal 
                      moveCount={moveCount}
                      timeInSeconds={gameTime}
                      onClose={handleSuccessModalClose}
                      onRestart={handlePlayAgain}
                      onNextLevel={handlePlayNextLevel}
                      isLastLevel={currentLevel?.id === 100}
                      levelNumber={currentLevel?.id}
                    />
                  </div>
                </>
              )}
          </div>
        </>
      )}
      <Analytics />
    </div>
  );
}

export default App;