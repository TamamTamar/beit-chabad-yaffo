import React, { useEffect, useState } from 'react';

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
    <div className="w-full max-w-lg mx-auto text-center p-6">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">הסכום שהושג</h2>

      {/* גרף */}
      <div className="mb-8 flex justify-center">
        <svg viewBox="0 0 100 100" className="w-full max-w-xs">
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
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          )}
        </svg>
      </div>

      {/* סכום */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-4xl font-bold text-blue-900">₪{raised.toLocaleString()}</span>
      </div>

      {/* אחוז השגת היעד */}
      <div className="text-gray-600">
        {percentage}% מהיעד {goal.toLocaleString()}₪
      </div>
    </div>
  );
};

export default DonationProgressMinimal;