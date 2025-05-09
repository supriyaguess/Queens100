import React from 'react'

const Controls = ({ onReset, onNewGame, queensCount, gridSize }) => {
  return (
    <div className="game-controls">
      <div className="control-buttons">
        <button className="control-btn reset-btn" onClick={onReset}>
          Reset
        </button>
        <button className="control-btn new-game-btn" onClick={onNewGame}>
          New Game
        </button>
      </div>
      
      <div className="queens-counter">
        Queens placed: {queensCount}/{gridSize}
      </div>
    </div>
  )
}

export default Controls