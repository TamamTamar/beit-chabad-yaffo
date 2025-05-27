import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DonationList.scss';

type DonationItem = {
  DT_RowId: string;
  [key: string]: string;
};

type AggregatedDonation = {
  name: string;
  pastTotal: number;
  futureTotal: number;
  combinedTotal: number;
  lizchut: string;
};

const DonationList: React.FC = () => {
  const [donations, setDonations] = useState<AggregatedDonation[]>([]);
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

        const rawData: DonationItem[] = response.data.data;

        const aggregated: AggregatedDonation[] = rawData.map(item => {
          const name = item['2']?.trim() || '—';
          const monthly = parseFloat(item['4']?.replace(/[^\d.]/g, '') || '0');
          const monthsPaid = parseInt(item['8'] || '0', 10);
          const remaining = parseInt(item['7'] || '0', 10);
          const lizchut = item['6']?.trim() || '';

          const pastTotal = monthly * monthsPaid;
          const futureTotal = monthly * remaining;
          const combinedTotal = pastTotal + futureTotal;

          return { name, pastTotal, futureTotal, combinedTotal, lizchut };
        });

        aggregated.sort((a, b) => b.combinedTotal - a.combinedTotal);

        setDonations(aggregated);
      } catch (err: any) {
        console.error('שגיאה בטעינת הנתונים:', err);
        setError('נכשלה טעינת התרומות');
      }
    };

    fetchDonationData();
  }, []);

  return (
    <div className="donation-list-cards">
      <h2 className='donation-list-title'>השותפים שלנו</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : donations.length === 0 ? (
        <p>טוען נתונים...</p>
      ) : (
        <div className="cards-container">
          {donations.map((d, idx) => (
            <div className="donation-card" key={idx}>
              <div className="donor-name">{d.name}</div>
              <div className="donation-amounts">
                <div>
                  <span className="value total"><strong>{d.combinedTotal.toLocaleString()} ₪</strong></span>
                </div>
                <div>
                    <span className="value lizchut">לזכות: {d.lizchut}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationList;