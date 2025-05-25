import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { paymentService } from '../../services/payment-service'; // ייבוא ה-service
import './DonationProgressMinimal.scss';

const DonationProgressMinimal: React.FC = () => {
  const goal = 770000;
  const [raised, setRaised] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  // שליפת נתוני תרומות מה-service
  const fetchDonationData = async () => {
    try {
      const data = await paymentService.fetchDonationData();
      const { TotalYear } = data;

      if (TotalYear) {
        const totalRaised = parseFloat(TotalYear);
        setRaised(totalRaised);
      } else {
        console.error('TotalYear לא נמצא בתגובה');
      }
    } catch (error) {
      console.error('שגיאה בעת שליפת הנתונים מה-API:', error);
    }
  };

  useEffect(() => {
    fetchDonationData();
  }, []);

  useEffect(() => {
    const calculatedPercentage = Math.min(Math.floor((raised / goal) * 100), 100);
    setPercentage(calculatedPercentage);
  }, [raised, goal]);

  const progressPathLength = 223;

  return (
    <div className="donation-progress-container" dir="rtl">
      {/* ...שאר הקוד... */}
    </div>
  );
};

export default DonationProgressMinimal;