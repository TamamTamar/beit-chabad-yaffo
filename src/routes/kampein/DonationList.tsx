import React, { useEffect, useState } from 'react';
import './DonationList.scss';
import { paymentService } from '../../services/payment-service';

type RawDonation = {
  ClientName: string;
  Amount: string;
  TransactionType: string;
  TransactionTime: string;
  Groupe: string;
};

type AggregatedDonation = {
  name: string;
  amount: number;
  lizchut: string;
  date: string;
};

const DonationList: React.FC = () => {
  const [donations, setDonations] = useState<AggregatedDonation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const response = await paymentService.fetchDonationData();
        console.log('Response from API:', response);

        if (!Array.isArray(response)) {
          throw new Error('Format is not array');
        }

        const mapped: AggregatedDonation[] = response.map((item: RawDonation) => {
          return {
            name: item.ClientName?.trim() || '—',
            amount: parseFloat(item.Amount) || 0,
            lizchut: item.Groupe?.trim() || '',
            date: item.TransactionTime?.split(' ')[0] || '',
          };
        });

        setDonations(mapped);
      } catch (err: any) {
        console.error('שגיאה בטעינת הנתונים:', err);
        setError('נכשלה טעינת התרומות');
      }
    };

    fetchDonationData();
  }, []);

  return (
    <div className="donation-list-cards">
      {error ? (
        <p className="error">{error}</p>
      ) : donations.length === 0 ? (
        <p>טוען נתונים...</p>
      ) : (
        <div className="donation-list-container">
          <div className="cards-container">
            <h2 className="donation-list-title">השותפים שלנו</h2>
            <div className="donation-cards">
              {donations.map((d, idx) => (
                <div className="donation-card" key={idx}>
                  <div className="donation-card-content">
                    <div className="donor-row">
                      <span className="donor-name">{d.name}</span>
                      <span className="donor-amount">{d.amount.toLocaleString()} ₪</span>
                    </div>
                    {d.lizchut && <div className="donor-message">לזכות: {d.lizchut}</div>}
                    <div className="donor-date">בתאריך: {d.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationList;
