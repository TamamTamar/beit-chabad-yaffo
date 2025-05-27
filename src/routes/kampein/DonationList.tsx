import React, { useEffect, useState } from 'react';
import axios from 'axios';

type DonationItem = {
  DT_RowId: string;
  [key: string]: string;
};

const DonationList: React.FC = () => {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const response = await axios.get('https://matara.pro/nedarimplus/Reports/Manage3.aspx', {
          params: {
            Action: 'GetKevaNew',
            MosadNumber: '7013920',
            ApiPassword: 'fp203',
          },
        });

        const rawData = response.data.data;

        if (Array.isArray(rawData)) {
          setDonations(rawData);
        } else {
          setError('פורמט הנתונים לא תקין');
        }
      } catch (err: any) {
        console.error('שגיאה בעת משיכת התרומות:', err);
        setError('נכשלה טעינת התרומות');
      }
    };

    fetchDonationData();
  }, []);

  return (
    <div style={{ direction: 'rtl', padding: '1rem' }}>
      <h2>רשימת תורמים</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : donations.length === 0 ? (
        <p>טוען נתונים...</p>
      ) : (
        <ul>
          {donations.map((donation) => (
            <li key={donation.DT_RowId}>
              <strong>{donation['2']}</strong> — {donation['4']}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DonationList;
