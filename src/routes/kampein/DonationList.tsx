import React, { useEffect, useState } from 'react';
import './DonationList.scss';
import { paymentService } from '../../services/payment-service';


type AggregatedDonation = {
    name: string;
    pastTotal: number;
    futureTotal: number;
    combinedTotal: number;
    lizchut: string;
};

type RawDonation = {
    ClientName?: string;
    Amount?: string;
    Comments?: string;
    // Add other fields if needed
};

const DonationList: React.FC = () => {
    const [donations, setDonations] = useState<AggregatedDonation[]>([]);
    const [originalDonations, setOriginalDonations] = useState<AggregatedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSorted, setIsSorted] = useState(false);

    useEffect(() => {
    const fetchDonationData = async () => {
        try {
            const response = await paymentService.fetchDonationData();
            const rawData: RawDonation[] = response.data;

            // לא מפלטרים לפי סוג עסקה, כוללים הכל
            const grouped: { [name: string]: AggregatedDonation } = {};

            rawData.forEach(item => {
                const name = item.ClientName?.trim() || '—';
                const amount = parseFloat(item.Amount || '0');
                const lizchut = item.Comments?.trim() || '';

                if (!grouped[name]) {
                    grouped[name] = {
                        name,
                        pastTotal: 0,
                        futureTotal: 0,
                        combinedTotal: 0,
                        lizchut,
                    };
                }

                grouped[name].pastTotal += amount;
                grouped[name].combinedTotal += amount;
            });

            const result: AggregatedDonation[] = Object.values(grouped);
            setDonations(result);
            setOriginalDonations(result);
        } catch (err: any) {
            console.error('שגיאה בטעינת הנתונים:', err);
            setError('נכשלה טעינת התרומות');
        }
    };

    fetchDonationData();
}, []);


    const handleSortClick = () => {
        if (isSorted) {
            setDonations(originalDonations);
        } else {
            const sorted = [...donations].sort((a, b) => b.combinedTotal - a.combinedTotal);
            setDonations(sorted);
        }
        setIsSorted(!isSorted);
    };

    return (
        <div className="donation-list-cards">


            {/*    <button className="sort-button" onClick={handleSortClick}>
                {isSorted ? 'בטל מיון' : 'מיין לפי סכום'}
            </button> */}
            {error ? (
                <p className="error">{error}</p>
            ) : donations.length === 0 ? (
                <p>טוען נתונים...</p>
            ) : (
                <div className="donation-list-container">
                 {/*    <div className="donation-list-header">
                        <button className="sort-button" onClick={handleSortClick}>
                            {isSorted ? 'בטל מיון' : 'מיין לפי סכום'}
                        </button>
                    </div> */}

                    <div className="cards-container">
                        <h2 className="donation-list-title">השותפים שלנו</h2>
                        <div className="donation-cards">
                        {donations.map((d, idx) => (
                            <div className="donation-card" key={idx}>
                                <div className="donation-card-content">
                                    <div className="donor-row">
                                        <span className="donor-name">{d.name}</span>
                                        <span className="donor-amount">{d.combinedTotal.toLocaleString()} ₪</span>
                                    </div>
                                    {d.lizchut && (
                                        <div className="donor-message">לזכות: {d.lizchut}</div>
                                    )}
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