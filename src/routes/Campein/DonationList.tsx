// src/routes/Campein/DonationList.tsx
import { FC, useEffect, useMemo, useState } from "react";
import "./DonationList.scss";
import {
    getAllDonationsView,
    formatByCurrency,
    AggWithCurrency,
} from "../../services/payment-service";

const DonationList: FC = () => {
    const [donations, setDonations] = useState<AggWithCurrency[]>([]);
    const [uniqueDonorsCount, setUniqueDonorsCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const { donations, uniqueDonorsCount } = await getAllDonationsView(); // ← הכל מוכן
                if (!mounted) return;

                setDonations(donations);
                setUniqueDonorsCount(uniqueDonorsCount);
            } catch (err: any) {
                console.error("[DonationList]", err?.message || err);
                if (!mounted) return;
                setError("נכשלה טעינת התרומות");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const visibleDonations = useMemo(
        () => donations.slice(0, visibleCount),
        [donations, visibleCount]
    );

    return (
        <div className="donation-list-cards">
            {loading ? (
                <p className="donor-message">טוען…</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : donations.length === 0 ? (
                <p className="donor-message">בואו תהיו הראשונים</p>
            ) : (
                <div className="donation-list-container">
                    <div className="cards-container">
                        <div className="donation-list-title-container">
                            <h2 className="donation-list-title">
                                {uniqueDonorsCount.toLocaleString("he-IL")} השותפים שלנו
                            </h2>
                        </div>

                        {visibleDonations.map((d, idx) => (
                            <div className="donation-card" key={`${d.name}-${d.combinedTotal}-${idx}`}>
                                <div className="donation-card-content">
                                    <div className="donor-row">
                                        <span className="donor-name">{d.name}</span>
                                        <span className="donor-amount">
                                            {formatByCurrency(d.combinedTotal, d.currency)}
                                        </span>
                                    </div>
                                    {d.lizchut && <div className="donor-message">לזכות: {d.lizchut}</div>}
                                </div>
                            </div>
                        ))}

                        {visibleCount < donations.length && (
                            <button
                                className="show-more-btn"
                                onClick={() => setVisibleCount((v) => Math.min(v + 4, donations.length))}
                                aria-label="הצג עוד תרומות"
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
