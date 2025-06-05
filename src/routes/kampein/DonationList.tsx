import React, { FC, useEffect, useState } from 'react';
import './DonationList.scss';
import { getAllDonations } from '../../services/donation-service';
import { AggregatedDonation, Donation } from '../../@Types/chabadType';

const DonationList: FC = () => {
    const [donations, setDonations] = useState<AggregatedDonation[]>([]);
    const [originalDonations, setOriginalDonations] = useState<AggregatedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSorted, setIsSorted] = useState(false);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const rawData: Donation[] = await getAllDonations();

                const aggregated: AggregatedDonation[] = rawData.map(item => {
                    const name = [item.FirstName, item.LastName].filter(Boolean).join(' ') || '—';
                    const monthly = item.Amount || 0;
                    const monthsPaid = item.Tashlumim || 1;
                    const pastTotal = monthly * monthsPaid;
                    // אין לנו futureTotal אמיתי, אז נשים 0
                    const futureTotal = 0;
                    const combinedTotal = pastTotal + futureTotal;
                    const lizchut = ''; // אם יש לך שדה כזה, הוסף אותו

                    return { name, pastTotal, futureTotal, combinedTotal, lizchut };
                });

                setDonations(aggregated);
                setOriginalDonations(aggregated);
            } catch (err: any) {
                console.error('שגיאה בטעינת הנתונים:', err);
                setError('נכשלה טעינת התרומות');
            }
        };

        fetchDonations();
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
            {/* <button className="sort-button" onClick={handleSortClick}>
                {isSorted ? 'בטל מיון' : 'מיין לפי סכום'}
            </button> */}
            {error ? (
                <p className="error">{error}</p>
            ) : donations.length === 0 ? (
                <p>טוען נתונים...</p>
            ) : (
                <div className="donation-list-container">
                    <div className="cards-container">
                        <div className="donation-list-title-container">
                            <h2 className="donation-list-title">השותפים שלנו</h2>
                        </div>
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
            )}
        </div>
    );
};

export default DonationList;