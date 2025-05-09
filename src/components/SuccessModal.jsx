// import { CheckCircle } from 'lucide-react';

// const SuccessModal = ({ onClose, onRestart, moveCount, timeInSeconds }) => {
//   // Format time for display
//   const formatTime = (totalSeconds) => {
//     const minutes = Math.floor(totalSeconds / 60);
//     const remainingSeconds = totalSeconds % 60;
    
//     return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="success-modal" onClick={onClose}>
//       <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="success-icon">
//           <CheckCircle size={32} />
//         </div>
        
//         <h2 className="text-xl font-bold">Puzzle Complete!</h2>
//         <p className="text-gray-600 mt-2">Great job solving the Queens puzzle</p>
        
//         <div className="stats-container">
//           <div className="stat-item">
//             <p className="stat-value">{moveCount}</p>
//             <p className="stat-label">Moves</p>
//           </div>
//           <div className="stat-item">
//             <p className="stat-value">{formatTime(timeInSeconds)}</p>
//             <p className="stat-label">Time</p>
//           </div>
//         </div>
        
//         <div className="success-actions">
//           <button 
//             className="success-btn btn-secondary"
//             onClick={onClose}
//           >
//             Close
//           </button>
//           <button 
//             className="success-btn btn-primary"
//             onClick={onRestart}
//           >
//             Play Again
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuccessModal;
import { Trophy, ArrowRight, CheckCircle } from 'lucide-react';

const SuccessModal = ({ 
  moveCount, 
  timeInSeconds, 
  onClose, 
  onRestart, 
  onNextLevel, 
  isLastLevel, 
  levelNumber 
}) => {
  // Format time for display
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-header">
          <Trophy className="success-trophy" size={48} />
          <h2 className="success-title">
            <span className="level-number">Level {levelNumber}</span>
            Complete!
          </h2>
          <p className="success-message">
            Great job solving this level!
          </p>
        </div>

        <div className="stats-container">
          <div className="stat-row">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moveCount}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Time:</span>
            <span className="stat-value">{formatTime(timeInSeconds)}</span>
          </div>
        </div>

        {!isLastLevel && (
          <div className="unlocked-text">
            <CheckCircle size={18} />
            <span>Level {levelNumber + 1} Unlocked!</span>
          </div>
        )}

        <div className="modal-buttons">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
          {!isLastLevel && (
            <button className="btn-next" onClick={onNextLevel}>
              <span>Next Level</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;