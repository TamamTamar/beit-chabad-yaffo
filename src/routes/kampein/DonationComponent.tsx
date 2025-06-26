import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';

// Comprehensive donation interface
interface DonationData {
  campaignId: string;
  title: string;
  goal: number;
  currentAmount: number;
  description: string;
}

const DonationComponent: FC = () => {
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const response = await axios.get<DonationData>('/api/donations/campaign');
        setDonationData(response.data);
      } catch (err) {
        setError('Failed to load donation data');
        console.error(err);
      }
    };

    fetchDonation();
  }, []);

  if (error) return <div>{error}</div>;
  if (!donationData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{donationData.title}</h2>
      <p>{donationData.description}</p>
      <div>
        Goal: ${donationData.goal}
        Current: ${donationData.currentAmount}
      </div>
    </div>
  );
};

export default DonationComponent;