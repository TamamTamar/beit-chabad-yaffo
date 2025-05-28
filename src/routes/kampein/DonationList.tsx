import React, { FC, useEffect, useState } from 'react';
import './DonationList.scss';
import { paymentService } from '../../services/payment-service';

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

const DonationList: FC = () => {
    const [donations, setDonations] = useState<AggregatedDonation[]>([]);
    const [originalDonations, setOriginalDonations] = useState<AggregatedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSorted, setIsSorted] = useState(false);

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                const response = await paymentService.fetchDonationData();
                // אם אתה מקבל response.data.data, השאר כך. אם לא, שנה ל-response.data
                const rawData: DonationItem[] = response.data;

                const aggregated: AggregatedDonation[] = rawData.map(item => {
                    const name = item['2']?.trim() || '—';
                    const monthly = parseFloat(item['4']?.replace(/[^\d.]/g, '') || '0');
                    const monthsPaid = parseInt(item['8'] || '0', 10);
                    // אם item['7'] ריק, נחשב future ל-12 פחות מה ששולם
                    const remaining = item['7'] !== "" ? parseInt(item['7'], 10) : 12 - monthsPaid;
                    const lizchut = item['6']?.trim() || '';

                    const pastTotal = monthly * monthsPaid;
                    const futureTotal = monthly * remaining;
                    const combinedTotal = pastTotal + futureTotal;

                    return { name, pastTotal, futureTotal, combinedTotal, lizchut };
                });
                setDonations(aggregated);
                setOriginalDonations(aggregated);
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
                    <div className="donation-list-header">
                        <button className="sort-button" onClick={handleSortClick}>
                            {isSorted ? 'בטל מיון' : 'מיין לפי סכום'}
                        </button>
                        <button>nnln</button>
                    </div>
                    <div className="cards-container">
                        <h2 className="donation-list-title">השותפים שלנו</h2>
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