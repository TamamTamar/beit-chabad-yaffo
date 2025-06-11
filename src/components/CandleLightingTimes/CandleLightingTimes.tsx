import React, { FC, useEffect, useState } from 'react';
import './CandleLightingTimes.scss';
import { fetchCandleLightingTimes } from '../../services/candleLightingService';
import { ShabbatData } from '../../@Types/chabadType';

const CandleLightingTimes: FC = () => {
  const [shabbatData, setShabbatData] = useState<ShabbatData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getShabbatData = async () => {
      try {
        const data = await fetchCandleLightingTimes();
        setShabbatData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    getShabbatData();
  }, []);

  return (
    <div className="cl-table">
      {error ? (
        <p className="cl-error">שגיאה: {error}</p>
      ) : shabbatData ? (
        <div className="cl-content-wrapper">
          <div className="cl-image">
            <img src="/img/light2.webp" alt="שבת שלום" />
          </div>
          <div className="cl-details">
            <h2 className="cl-heading-bold">זמני הדלקת נרות</h2>
            <p><strong>תאריך:</strong> {shabbatData.date}</p>
            <p><strong>פרשה:</strong> {shabbatData.parasha}</p>
            <p><strong>הדלקת נרות:</strong> {shabbatData.candles}</p>
            <p><strong>צאת שבת:</strong> {shabbatData.havdalah}</p>
          </div>
        </div>
      ) : (
        <p>טוען נתונים...</p>
      )}
    </div>
  );
  
};

export default CandleLightingTimes;
