import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './DonationProgressMinimal.scss';

const DonationProgressMinimal: React.FC = () => {
  const raised = 274634;
  const goal = 770000;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = Math.min(Math.floor((raised / goal) * 100), 100);
    setPercentage(calculatedPercentage);
  }, [raised, goal]);

  const progressPathLength = 223; // אורך המסלול הכולל

  return (
    <div className="donation-progress-container" dir="rtl">
      <h2 className="donation-title">הסכום שהושג</h2>

      {/* גרף */}
      <div className="graph-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 79" className="graph-svg">
          {/* קו רקע אפור */}
          <polyline 
            fill="none" 
            strokeWidth="7.06422" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            points="183.392 75.2523 128.291 45.2293 54.4703 41.6972 3.60791 6.02289" 
            className="arrow-stroke-default" 
            style={{ stroke: '#E5E5E5' }}
          />
          
          {/* קו מתקדם עם אנימציה */}
          <motion.polyline
            fill="none"
            strokeWidth="7.06422"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="183.392 75.2522 128.291 45.2293 54.47 41.6972 47.4058 36.7424"
            stroke="#6B4B9A"
            strokeDasharray={`${progressPathLength}`}
            strokeDashoffset={progressPathLength * (1 - percentage / 100)}
            initial={{ strokeDashoffset: progressPathLength }}
            animate={{ strokeDashoffset: progressPathLength * (1 - percentage / 100) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
      </div>

      {/* סכום */}
      <div className="amount-container">
        <span className="amount-text">₪{raised.toLocaleString()}</span>
      </div>

      {/* אחוז השגת היעד */}
      <div className="percentage-text">
        {percentage}% מהיעד {goal.toLocaleString()}₪
      </div>
    </div>
  );
};

export default DonationProgressMinimal;
