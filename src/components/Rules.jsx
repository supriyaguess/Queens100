import React from 'react'

const Rules = () => {
  return (
    <div className="game-rules">
      <h3>Game Rules:</h3>
      <ul>
        <li>Place exactly one queen in every row, column, and colored region</li>
        <li>Queens cannot attack each other (even diagonally)</li>
        <li>Left-click to place/remove a queen</li>
        <li>Right-click to mark/unmark a blocked cell</li>
      </ul>
    </div>
  )
}

export default Rules