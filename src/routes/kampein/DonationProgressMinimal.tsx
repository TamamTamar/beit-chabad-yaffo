import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { paymentService } from '../../services/payment-service';
import './DonationProgressMinimal.scss';

const DonationProgressMinimal: React.FC = () => {
  const goal = 770000; // יעד התרומות
  const [raised, setRaised] = useState<number>(0); // סכום משוער שיושג
  const [percentage, setPercentage] = useState<number>(0); // אחוז מהיעד

  const progressPathLength = 223; // אורך הקו בגרף SVG

  // חישוב סכום חודשי * חודשים שנותרו
  const calculateEstimatedDonations = (donations: any[]) => {
    return donations.reduce((total, donation) => {
      const amountStr = donation["4"]?.replace("₪", "").trim();
      const monthsLeftStr = donation["7"]?.trim();

      const amount = parseFloat(amountStr);
      const monthsLeft = parseInt(monthsLeftStr, 10);

      if (!isNaN(amount) && !isNaN(monthsLeft)) {
        return total + amount * monthsLeft;
      }

      return total;
    }, 0);
  };

  const fetchDonationData = async () => {
    try {
      const response = await paymentService.fetchDonationData();
      const donations = response?.data;

      if (Array.isArray(donations)) {
        const total = calculateEstimatedDonations(donations);
        setRaised(total);
      } else {
        console.error('פורמט הנתונים שהתקבל לא תקין:', response);
      }
    } catch (error) {
      console.error('שגיאה בעת שליפת נתוני התרומות:', error);
    }
  };

  useEffect(() => {
    fetchDonationData();
  }, []);

  useEffect(() => {
    const calculatedPercentage = Math.min(Math.floor((raised / goal) * 100), 100);
    setPercentage(calculatedPercentage);
  }, [raised]);

  return (
    <div className="donation-progress-container" dir="rtl">
      <h2 className="donation-title">הסכום שצפוי להתקבל עד סוף השנה</h2>

      {/* גרף התקדמות */}
      <div className="graph-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 79" className="graph-svg">
          {/* קו אפור רקע */}
          <polyline 
            fill="none" 
            strokeWidth="7.06422" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            points="183.392 75.2523 128.291 45.2293 54.4703 41.6972 3.60791 6.02289" 
            style={{ stroke: '#E5E5E5' }}
          />

          {/* קו מתקדם עם אנימציה */}
          <motion.polyline
            fill="none"
            strokeWidth="7.06422"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="183.392 75.2522 128.291 45.2293 54.47 41.6972 47.4058 36.7424"
            stroke="#68001f"
            strokeDasharray={progressPathLength}
            strokeDashoffset={progressPathLength * (1 - percentage / 100)}
            initial={{ strokeDashoffset: progressPathLength }}
            animate={{ strokeDashoffset: progressPathLength * (1 - percentage / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
      </div>

      {/* סכום */}
      <div className="amount-container">
        <span className="amount-text">₪{raised.toLocaleString()}</span>
      </div>

      {/* אחוז מהיעד */}
      <div className="percentage-text">
        {percentage}% מתוך יעד של {goal.toLocaleString()}₪
      </div>
    </div>
  );
};

export default DonationProgressMinimal;
