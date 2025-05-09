import { X, Crown, ChevronDown } from 'lucide-react';

const HowToPlay = ({ onClose }) => {
  return (
    <div className="how-to-play" onClick={onClose}>
      <div className="how-to-play-content" onClick={(e) => e.stopPropagation()}>
        <div className="how-to-play-header">
          <h2 className="text-xl font-bold">How to play</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <ul className="how-to-play-rules">
          <li>
            <div className="list-number">1</div>
            <div>
              <p>Your goal is to have <strong>exactly one <Crown size={16} className="inline" /></strong> in each row, column, and color region.</p>
            </div>
          </li>
          
          <li>
            <div className="list-number">2</div>
            <div>
              <p>Tap once to place <strong>X</strong> and tap twice for <Crown size={16} className="inline" />. Use X to mark where <Crown size={16} className="inline" /> cannot be placed.</p>
            </div>
          </li>
          
          <li>
            <div className="list-number">3</div>
            <div>
              <p>Two <Crown size={16} className="inline" /> cannot touch each other, not even diagonally.</p>
            </div>
          </li>
          
          <li>
            <div className="list-number">4</div>
            <div>
              <p>All cells of the same color <strong>must be connected</strong> horizontally or vertically (not diagonally).</p>
            </div>
          </li>
        </ul>
        
        <button 
          className="btn-control w-full"
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default HowToPlay;