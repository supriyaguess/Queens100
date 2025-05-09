import React from 'react'

const Cell = ({
  hasQueen,
  isBlocked,
  isAttacked,
  backgroundColor,
  onClick,
  onRightClick
}) => {
  // Determine cell class for styling
  const cellClass = `game-cell ${isAttacked ? 'attacked' : ''}`

  return (
    <div
      className={cellClass}
      style={{ backgroundColor }}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {hasQueen && <span className="queen">♛</span>}
      {isBlocked && <span className="blocked">✖</span>}
    </div>
  )
}

export default Cell