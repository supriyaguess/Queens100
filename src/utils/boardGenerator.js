// boardGenerator.js
// Function to generate a random N-Queens puzzle board with connected regions

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get adjacent cells (orthogonal neighbors)
const getAdjacentCells = (row, col, size) => {
  const adjacent = [];
  
  if (row > 0) adjacent.push([row - 1, col]); // top
  if (row < size - 1) adjacent.push([row + 1, col]); // bottom
  if (col > 0) adjacent.push([row, col - 1]); // left
  if (col < size - 1) adjacent.push([row, col + 1]); // right
  
  return adjacent;
};

// Generate a board with N connected regions
export const generateRandomBoard = (size) => {
  // Initialize empty board
  const board = Array(size).fill().map(() => 
    Array(size).fill().map(() => ({ region: null }))
  );
  
  // Assign region IDs (A-Z)
  const regions = Array(size).fill().map((_, i) => 
    String.fromCharCode(65 + i)
  );
  
  // For each region, select a random starting cell and grow the region
  regions.forEach(region => {
    // Skip if we've already used all cells
    if (board.flat().every(cell => cell.region !== null)) {
      return;
    }

    // Find a random empty cell to start
    let startRow, startCol, attempts = 0;
    do {
      startRow = getRandomInt(0, size - 1);
      startCol = getRandomInt(0, size - 1);
      attempts++;
      // Avoid infinite loop if board is almost full
      if (attempts > 100) break;
    } while (board[startRow][startCol].region !== null);
    
    // If we couldn't find an empty cell, skip this region
    if (board[startRow][startCol].region !== null) {
      return;
    }
    
    // Assign the starting cell to this region
    board[startRow][startCol].region = region;
    
    // Grow the region (between 1 and size cells)
    const targetCells = getRandomInt(Math.max(1, Math.floor(size / 2)), size);
    let cellsInRegion = 1;
    
    // Continue growing until we reach target size or can't grow anymore
    while (cellsInRegion < targetCells) {
      // Find all potential growth cells (empty cells adjacent to this region)
      const potentialCells = [];
      
      // Check each cell in the board
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          // If this cell belongs to our region
          if (board[r][c].region === region) {
            // Look at adjacent cells
            const adjacentCells = getAdjacentCells(r, c, size);
            adjacentCells.forEach(([adjRow, adjCol]) => {
              // If adjacent cell is empty, it's a potential growth cell
              if (board[adjRow][adjCol].region === null) {
                potentialCells.push([adjRow, adjCol]);
              }
            });
          }
        }
      }
      
      // If no potential growth cells, break
      if (potentialCells.length === 0) break;
      
      // Choose a random potential cell and add to region
      const randomIndex = getRandomInt(0, potentialCells.length - 1);
      const [newRow, newCol] = potentialCells[randomIndex];
      board[newRow][newCol].region = region;
      cellsInRegion++;
    }
  });
  
  // Fill any remaining empty cells with random regions
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c].region === null) {
        // Find adjacent regions
        const adjacentCells = getAdjacentCells(r, c, size);
        const adjacentRegions = adjacentCells
          .map(([adjRow, adjCol]) => board[adjRow][adjCol].region)
          .filter(region => region !== null);
        
        if (adjacentRegions.length > 0) {
          // Prefer to extend an existing adjacent region
          const randomAdjacentIndex = getRandomInt(0, adjacentRegions.length - 1);
          board[r][c].region = adjacentRegions[randomAdjacentIndex];
        } else {
          // If no adjacent regions, use a random region
          const availableRegions = regions.filter(region => 
            board.flat().some(cell => cell.region === region)
          );
          const randomRegion = availableRegions[getRandomInt(0, availableRegions.length - 1)];
          board[r][c].region = randomRegion;
        }
      }
    }
  }
  
  return board;
};

// Alternative simplified approach with random flood fill
export const generateSimpleRandomBoard = (size) => {
  // Use fewer regions for smaller boards
  const numRegions = Math.min(size, 9); // Maximum 9 regions (A-I)
  
  // Initialize empty board
  const board = Array(size).fill().map(() => 
    Array(size).fill().map(() => ({ region: null }))
  );
  
  // Assign region IDs (A-I)
  const regions = Array(numRegions).fill().map((_, i) => 
    String.fromCharCode(65 + i)
  );
  
  // Fill the board using a flood-fill algorithm
  for (let regionIndex = 0; regionIndex < regions.length; regionIndex++) {
    const region = regions[regionIndex];
    
    // Find a random empty cell
    let startRow, startCol;
    const emptyCells = [];
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c].region === null) {
          emptyCells.push([r, c]);
        }
      }
    }
    
    if (emptyCells.length === 0) break;
    
    // Choose a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    [startRow, startCol] = randomCell;
    
    // Flood fill from this cell
    const queue = [[startRow, startCol]];
    const targetSize = Math.floor(size * size / numRegions) + getRandomInt(-1, 1);
    let cellsInRegion = 0;
    
    while (queue.length > 0 && cellsInRegion < targetSize) {
      const [r, c] = queue.shift();
      
      if (r < 0 || r >= size || c < 0 || c >= size || board[r][c].region !== null) {
        continue;
      }
      
      board[r][c].region = region;
      cellsInRegion++;
      
      // Add adjacent cells to queue in random order
      const adjacent = getAdjacentCells(r, c, size);
      for (let i = adjacent.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [adjacent[i], adjacent[j]] = [adjacent[j], adjacent[i]];
      }
      
      queue.push(...adjacent);
    }
  }
  
  // Fill any remaining empty cells by expanding existing regions
  let emptyCellsExist = true;
  while (emptyCellsExist) {
    emptyCellsExist = false;
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c].region === null) {
          emptyCellsExist = true;
          
          // Get adjacent non-null regions
          const adjacent = getAdjacentCells(r, c, size);
          const adjacentRegions = adjacent
            .map(([adjR, adjC]) => {
              if (adjR >= 0 && adjR < size && adjC >= 0 && adjC < size) {
                return board[adjR][adjC].region;
              }
              return null;
            })
            .filter(region => region !== null);
          
          // If there are adjacent regions, pick one randomly
          if (adjacentRegions.length > 0) {
            const randomRegion = adjacentRegions[Math.floor(Math.random() * adjacentRegions.length)];
            board[r][c].region = randomRegion;
          } else {
            // If no adjacent regions, assign a random region
            board[r][c].region = regions[Math.floor(Math.random() * regions.length)];
          }
        }
      }
    }
  }
  
  return board;
};

// Export both functions, with the simpler one as default
export default generateSimpleRandomBoard;