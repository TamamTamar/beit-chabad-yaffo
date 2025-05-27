import React, { useEffect, useState } from 'react';
import './DonorsList.scss';

type Donor = {
  name: string;
  amount: number;
  message?: string;
};

const DonorsList: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('/api/donors'); // החלף ב-API שלך
        const data = await response.json();
        setDonors(data);
      } catch (error) {
        console.error('שגיאה בשליפת תורמים:', error);
      }
    };

    fetchDonors();
  }, []);

  return (
    <div className="donors-list" dir="rtl">
      <h3 className="donors-title">תורמים</h3>
      <div className="donors-grid">
        {donors.map((donor, index) => (
          <div key={index} className="donor-card">
            <div className="donor-row">
              <span className="donor-name">{donor.name || 'אנונימי'}</span>
              <span className="donor-amount">₪{donor.amount.toLocaleString()}</span>
            </div>
            {donor.message && (
              <div className="donor-message">לזכות {donor.message}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorsList;