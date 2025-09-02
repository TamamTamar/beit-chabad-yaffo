// DonationList.tsx
import { FC, useEffect, useMemo, useState } from 'react';
import { AggregatedDonation, Donation } from '../../@Types/chabadType';
import { getAllDonations } from '../../services/donation-service';
import './DonationList.scss';
import { settingsService } from '../../services/setting-service';



const DonationList: FC = () => {
    const [dateOfBeggining, setDateOfBeggining] = useState<string>('');
    const [raw, setRaw] = useState<Donation[]>([]);
    const [donations, setDonations] = useState<AggregatedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        (async () => {
            try {
                const dateOfBegginingDate = await settingsService.getSettings();
                const dateOfBegginingStr = dateOfBegginingDate instanceof Date
                    ? dateOfBegginingDate.toISOString().slice(0, 10)
                    : String(dateOfBegginingDate);
                setDateOfBeggining(dateOfBegginingStr);
            } catch (err) {
                console.error('שגיאה בטעינת תאריך ההתחלה:', err);
                setError('נכשלה טעינת תאריך ההתחלה');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const rawData: Donation[] = await getAllDonations();
                setRaw(rawData);
            } catch (err) {
                console.error('שגיאה בטעינת הנתונים:', err);
                setError('נכשלה טעינת התרומות');
            }
        })();
    }, []);

    useEffect(() => {
        // השתמש ב-dateOfBeggining במקום SHOW_FROM
        const fromTimestamp = dateOfBeggining
            ? new Date(`${dateOfBeggining}T00:00:00Z`).getTime()
            : 0;

        const filtered = raw.filter((d) => {
            const ts = d.createdAt ? new Date(d.createdAt).getTime() : 0;
            return ts >= fromTimestamp;
        });

        const aggregated: AggregatedDonation[] = filtered.map((item) => {
            const name = [item.FirstName, item.LastName].filter(Boolean).join(' ') || '—';
            const monthly = item.Amount ?? 0;
            const monthsPaid = item.Tashlumim ?? 1;
            const pastTotal = monthly * monthsPaid;
            const combinedTotal = pastTotal;
            const lizchut = item.lizchut || '';
            const comment = item.Comments || '';
            return { name, pastTotal, futureTotal: 0, combinedTotal, lizchut, comment };
        });

        setDonations(aggregated);
    }, [raw, dateOfBeggining]);

    const visibleDonations = useMemo(
        () => donations.slice(0, visibleCount),
        [donations, visibleCount]
    );

    return (
        <div className="donation-list-cards">
            {error ? (
                <p className="error">{error}</p>
            ) : donations.length === 0 ? (
                <p className='donor-message '>בואו תהיו הראשונים</p>
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
                                    {d.lizchut && <div className="donor-message">לזכות: {d.lizchut}</div>}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationList;