import { FC, useEffect, useState } from 'react';
import { AggregatedDonation, Donation } from '../../@Types/chabadType';
import { getAllDonations } from '../../services/donation-service';
import './DonationList.scss';

const DonationList: FC = () => {
    const [donations, setDonations] = useState<AggregatedDonation[]>([]);
    const [originalDonations, setOriginalDonations] = useState<AggregatedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSorted, setIsSorted] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const rawData: Donation[] = await getAllDonations();

                const aggregated: AggregatedDonation[] = rawData.map(item => {
                    const name = [item.FirstName, item.LastName].filter(Boolean).join(' ') || '—';
                    const monthly = item.Amount || 0;
                    const monthsPaid = item.Tashlumim || 1;
                    const pastTotal = monthly * monthsPaid;
                    const futureTotal = 0;
                    const combinedTotal = pastTotal + futureTotal;
                    const lizchut = item.lizchut || "";

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

    // הצג רק visibleCount ראשונים
    const visibleDonations = donations.slice(0, visibleCount);

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
                        {visibleDonations.map((d, idx) => (
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
                        {visibleCount < donations.length && (
                            <button
                                className="show-more-btn"
                                onClick={() => setVisibleCount(Math.min(visibleCount + 4, donations.length))}
                            >
                                הצג עוד
                            </button>
                        )}
                        {visibleCount > 10 && (
                            <button
                                className="show-more-btn"
                                onClick={() => setVisibleCount(10)}
                            >
                                הצג פחות
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationList;