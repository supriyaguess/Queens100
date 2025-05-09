import { useState, useEffect } from 'react';
import { Crown, X } from 'lucide-react';

const Board = ({ board, queens, marks, errors, onCellClick, playSoundEffect }) => {
  const [doubleClickTimer, setDoubleClickTimer] = useState(null);
  const [lastClickedCell, setLastClickedCell] = useState(null);
  const [animatingCells, setAnimatingCells] = useState({});

  // Handle cell animations when placed/removed
  useEffect(() => {
    // Clear animations after 300ms
    const animationTimers = Object.keys(animatingCells).map(key => {
      return setTimeout(() => {
        setAnimatingCells(prev => {
          const newState = {...prev};
          delete newState[key];
          return newState;
        });
      }, 300);
    });
    
    return () => {
      animationTimers.forEach(timer => clearTimeout(timer));
    };
  }, [animatingCells]);

  // Update animations when queens change
  useEffect(() => {
    const newAnimations = {};
    queens.forEach(pos => {
      if (!animatingCells[pos]) {
        newAnimations[pos] = 'place';
      }
    });
    
    if (Object.keys(newAnimations).length > 0) {
      setAnimatingCells(prev => ({...prev, ...newAnimations}));
    }
  }, [queens]);

  const handleCellClick = (row, col) => {
    // Check if this is the same cell that was clicked recently
    if (lastClickedCell === `${row},${col}` && doubleClickTimer) {
      // Double click detected
      clearTimeout(doubleClickTimer);
      setDoubleClickTimer(null);
      setLastClickedCell(null);
      onCellClick(row, col, true); // true for double click
    } else {
      // First click - start timer for double click detection
      if (doubleClickTimer) {
        clearTimeout(doubleClickTimer);
      }
      
      setLastClickedCell(`${row},${col}`);
      
      const timer = setTimeout(() => {
        // Single click action after delay
        onCellClick(row, col, false);
        setDoubleClickTimer(null);
        setLastClickedCell(null);
      }, 300); // 300ms delay to detect double click
      
      setDoubleClickTimer(timer);
    }
  };

  // Map region IDs to color styles
  const getRegionColor = (regionId) => {
    const colorMap = {
      'A': '#a8e6cf',
      'B': '#dcedc1',
      'C': '#ffd3b6',
      'D': '#ffaaa5',
      'E': '#ff8b94',
      'F': '#d8b5ff',
      'G': '#98d2eb',
      'H': '#ffcc80',
      'I': '#b2ebf2',
    };
    
    return colorMap[regionId] || '#e2e8f0'; // Default gray color
  };

  // Get animation class for a cell
  const getCellAnimationClass = (cellPos) => {
    if (animatingCells[cellPos] === 'place') {
      return 'cell-placed';
    }
    return '';
  };

  return (
    <div className="board-container" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <div 
        className="board-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${board.length}, 1fr)`,
          gridTemplateRows: `repeat(${board.length}, 1fr)`,
          gap: '2px',
          width: '100%',
          aspectRatio: '1/1'
        }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const cellPos = `${rowIndex},${colIndex}`;
            const hasQueen = queens.includes(cellPos);
            const hasMark = marks.includes(cellPos);
            const hasError = errors.includes(cellPos);
            const animationClass = getCellAnimationClass(cellPos);
            
            return (
              <div
                key={cellPos}
                className={`board-cell ${animationClass} ${hasError ? 'error' : ''}`}
                style={{
                  backgroundColor: getRegionColor(cell.region),
                  border: hasError ? '2px solid red' : '1px solid #ccc',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '1/1',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {hasQueen && (
                  <Crown 
                    className={`queen-icon ${hasError ? 'queen-error' : ''}`}
                    color={hasError ? "red" : "#4a4a4a"} 
                    size={24} 
                  />
                )}
                {hasMark && !hasQueen && (
                  <X 
                    className="mark-icon"
                    color="#4a4a4a" 
                    size={18}
                    style={{ opacity: 0.7 }}
                  />
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Board;