import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ active, onUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval = null;
    
    if (active) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          onUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, onUpdate]);
  
  // Format time as MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center text-xl font-bold">
      <Clock size={20} className="mr-2" />
      {formatTime(seconds)}
    </div>
  );
};

export default Timer;