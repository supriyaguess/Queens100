import React, { useState, useEffect } from 'react'
import Board from './Board'
import Controls from './Controls'
import Rules from './Rules'
import { generatePuzzle, checkSolution } from '../utils/puzzleGenerator'

const Game = () => {
  // State variables
  const [gridSize, setGridSize] = useState(7) // Default grid size
  const [coloredRegions, setColoredRegions] = useState([])
  const [queens, setQueens] = useState({})
  const [blockedCells, setBlockedCells] = useState({})
  const [isSolved, setIsSolved] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Colors for regions
  const regionColors = [
    '#FFC3A0', '#FFAFCC', '#A0C4FF', '#9BF6FF',
    '#CAFFBF', '#FDFFB6', '#BDB2FF', '#FFC6FF'
  ]

  // Generate a new puzzle with the given size
  const startNewGame = (size) => {
    const newRegions = generatePuzzle(size)
    setGridSize(size)
    setColoredRegions(newRegions)
    setQueens({})
    setBlockedCells({})
    setIsSolved(false)
    setGameStarted(true)
  }

  // Reset the current game
  const resetGame = () => {
    setQueens({})
    setBlockedCells({})
    setIsSolved(false)
  }

  // Handle cell click to place/remove queen
  const handleCellClick = (row, col) => {
    if (isSolved) return

    const position = `${row},${col}`

    // If cell already has a queen, remove it
    if (queens[position]) {
      const newQueens = { ...queens }
      delete newQueens[position]
      setQueens(newQueens)
      return
    }

    // If cell is marked as blocked, remove it
    if (blockedCells[position]) {
      const newBlocked = { ...blockedCells }
      delete newBlocked[position]
      setBlockedCells(newBlocked)
      return
    }

    // Otherwise place a queen
    setQueens({ ...queens, [position]: true })
  }

  // Handle right click to mark blocked cells
  const handleRightClick = (row, col, e) => {
    e.preventDefault()
    if (isSolved) return

    const position = `${row},${col}`

    // If there's a queen, don't place a block
    if (queens[position]) return

    // Toggle blocked state
    if (blockedCells[position]) {
      const newBlocked = { ...blockedCells }
      delete newBlocked[position]
      setBlockedCells(newBlocked)
    } else {
      setBlockedCells({ ...blockedCells, [position]: true })
    }
  }

  // Check if the current layout is a valid solution
  useEffect(() => {
    if (!gameStarted || Object.keys(queens).length === 0) {
      setIsSolved(false)
      return
    }

    const solution = checkSolution(queens, gridSize, coloredRegions)
    setIsSolved(solution.isSolved)
  }, [queens, gridSize, coloredRegions, gameStarted])

  return (
    <div className="game-container">
      <h1 className="game-title">Queens Puzzle Game</h1>

      {!gameStarted ? (
        <div className="welcome-screen">
          <h2>Select grid size to start:</h2>
          <div className="size-buttons">
            {[4, 5, 6, 7, 8, 9].map(size => (
              <button
                key={size}
                className="size-btn"
                onClick={() => startNewGame(size)}
              >
                {size}×{size}
              </button>
            ))}
          </div>
          <Rules />
        </div>
      ) : (
        <>
          {isSolved && (
            <div className="solved-message">
              🎉 Puzzle Solved! Congratulations!
            </div>
          )}

          <Controls
            onReset={resetGame}
            onNewGame={() => setGameStarted(false)}
            queensCount={Object.keys(queens).length}
            gridSize={gridSize}
          />

          <Board
            gridSize={gridSize}
            coloredRegions={coloredRegions}
            queens={queens}
            blockedCells={blockedCells}
            regionColors={regionColors}
            onCellClick={handleCellClick}
            onCellRightClick={handleRightClick}
          />
        </>
      )}
    </div>
  )
}

export default Game