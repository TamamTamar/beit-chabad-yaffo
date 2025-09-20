import { FC, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllDonations, getUsdToIlsRate } from '../../services/payment-service';
import { settingsService } from '../../services/setting-service';
import './DonationProgressMinimal.scss';

type Props = {
  goal?: number;
};

const DonationProgressMinimal: FC<Props> = ({ goal = 600_000 }) => {
  const [raised, setRaised] = useState(0);
  const [startDate, setStartDate] = useState<string>(''); // yyyy-mm-dd
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ils = useMemo(
    () => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }),
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);

        // מביאים תאריך התחלה + תרומות + שער USD→ILS במקביל
        const [settingsDate, donations, usdToIls] = await Promise.all([
          settingsService.getDonationsStart(),
          getAllDonations(),
          getUsdToIlsRate(),
        ]);

        const dateStr =
          settingsDate instanceof Date
            ? settingsDate.toISOString().slice(0, 10)
            : String(settingsDate || '').slice(0, 10);

        const fromTs = dateStr ? new Date(`${dateStr}T00:00:00Z`).getTime() : 0;

        const totalIls = (donations || [])
          .filter((d) => {
            const ts = d?.createdAt ? new Date(d.createdAt).getTime() : 0;
            return Number.isFinite(ts) && ts >= fromTs;
          })
                    // ...existing code...
          .reduce((sum, d) => {
              const amount = Number(d?.Amount ?? 0);
              const tashlumim = Number(d?.Tashlumim ?? 1); // ברירת מחדל 1
              // אין תקרה 12
              const inIls = (amount * tashlumim) * (Number(d?.currency) === 2 ? usdToIls : 1);
              return sum + inIls;
          }, 0);
          // ...existing code...

        if (!mounted) return;
        setStartDate(dateStr);
        setRaised(totalIls);
        setError(null);
      } catch (e) {
        console.error('שגיאה בעת שליפת הנתונים:', e);
        if (mounted) setError('נכשלה טעינת נתוני ההתרמה');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const percentage = Math.min(Math.floor((raised / goal) * 100), 100);

  // אם לא שינית את ה־SVG, תשאיר 223. אם שינית, מדוד את האורך החדש.
  const progressPathLength = 223; // אורך הקו ב־SVG (אם שינית SVG, מדוד מחדש)
  const dashOffset = progressPathLength * (1 - percentage / 100);

  return (
    <div className="donation-progress-container" dir="rtl">
      <h2 className="donation-title">הסכום שהושג</h2>

      {loading ? (
        <div className="graph-container"><div className="skeleton-line" /></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
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
                initial={{ strokeDashoffset: progressPathLength }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
          </div>
          <div className="amount-container">
            <span className="amount-text">{ils.format(raised)}</span>
          </div>
          <div className="percentage-text">
            {percentage}% מהיעד {ils.format(goal)}
          </div>
        </>
      )}
    </div>
  );
};

export default DonationProgressMinimal;
