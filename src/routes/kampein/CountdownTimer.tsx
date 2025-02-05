import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const targetDate = new Date('2025-03-05T00:00:00'); // הגדר את תאריך היעד כאן
  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(difference / 1000)); // זמן שנותר בשניות
  }

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const progress = (timeLeft / (9 * 3600 + 44 * 60 + 18)) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#ccc" strokeWidth="5" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#1E88E5"
            strokeWidth="5"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={(progress / 100) * 283}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-blue-700 font-bold text-lg">
          זמן לסיום
        </div>
      </div>

      <div className="flex space-x-4 text-blue-700 text-2xl font-semibold">
        <div>{days} ימים</div>
        <div>{hours} שעות</div>
        <div>{minutes} דקות</div>
        <div>{seconds} שניות</div>
      </div>
    </div>
  );
};

export default CountdownTimer;