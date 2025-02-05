import React, { useEffect, useState } from 'react';
import './DonationProgressMinimal.scss';

const DonationProgressMinimal: React.FC = () => {
  const raised = 17733;
  const goal = 100088;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = Math.min(Math.floor((raised / goal) * 100), 100);
    setPercentage(calculatedPercentage);
  }, [raised, goal]);

  const pathD = "M 90,80 L 60,50 L 30,50 L 10,30"; // נתיב מימין לשמאל

  return (
    <div className="donation-progress-container">
      <h2 className="donation-title">הסכום שהושג</h2>

      {/* גרף */}
      <div className="graph-container">
        <svg viewBox="0 0 100 100" className="graph-svg">
          {/* קו אפור רקע */}
          <path d={pathD} fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
          {/* קו כחול מתקדם */}
          {percentage > 0 && (
            <path
              d={pathD}
              fill="none"
              stroke="#1e40af"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={100 - percentage}
              className="progress-path"
            />
          )}
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