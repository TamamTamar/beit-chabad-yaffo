import { motion } from 'framer-motion';
import { FC, useEffect, useState } from 'react';
import { getAllDonations } from '../../services/donation-service';
import { settingsService } from '../../services/setting-service';
import './DonationProgressMinimal.scss';

const DonationProgressMinimal: FC = () => {
  const goal = 770000; // יעד התרומות
  const [raised, setRaised] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [dateOfBeggining, setDateOfBeggining] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const dateOfBegginingDate = await settingsService.getSettings();
        const dateOfBegginingStr = dateOfBegginingDate instanceof Date
          ? dateOfBegginingDate.toISOString().slice(0, 10)
          : String(dateOfBegginingDate);
        setDateOfBeggining(dateOfBegginingStr);
      } catch (err) {
        console.error('שגיאה בטעינת תאריך ההתחלה:', err);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const donations = await getAllDonations();

        const fromTimestamp = dateOfBeggining
          ? new Date(`${dateOfBeggining}T00:00:00Z`).getTime()
          : 0;

        const filtered = donations.filter((d) => {
          const ts = d.createdAt ? new Date(d.createdAt).getTime() : 0;
          return ts >= fromTimestamp;
        });

        const totalRaised = filtered.reduce((sum, donation) => {
          const amount = donation.Amount || 0;
          const tashlumim = donation.Tashlumim || 0;
          const capped = tashlumim > 0 ? Math.min(tashlumim, 12) : 12;
          return sum + amount * capped;
        }, 0);

        setRaised(totalRaised);
      } catch (error) {
        console.error('שגיאה בעת שליפת הנתונים מה-API:', error);
      }
    };

    fetchDonationData();
  }, [dateOfBeggining]);

  useEffect(() => {
    const p = Math.min(Math.floor((raised / goal) * 100), 100);
    setPercentage(p);
  }, [raised, goal]);

  const progressPathLength = 223;

  return (
    <div className="donation-progress-container" dir="rtl">
      <h2 className="donation-title">הסכום שהושג</h2>

 

      <div className="graph-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 79" className="graph-svg">
          <polyline
            fill="none"
            strokeWidth="7.06422"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="183.392 75.2523 128.291 45.2293 54.4703 41.6972 3.60791 6.02289"
            style={{ stroke: '#E5E5E5' }}
          />
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

      <div className="amount-container">
        <span className="amount-text">₪{raised.toLocaleString()}</span>
      </div>

      <div className="percentage-text">
        {percentage}% מהיעד {goal.toLocaleString()}₪
      </div>
    </div>
  );
};

export default DonationProgressMinimal;