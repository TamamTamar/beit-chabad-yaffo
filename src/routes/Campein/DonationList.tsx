// src/routes/Campein/DonationList.tsx
import { FC, useEffect, useMemo, useState } from 'react';
import { AggregatedDonation, Donation } from '../../@Types/chabadType';
import { getAllDonations } from '../../services/donation-service';
import { settingsService } from '../../services/setting-service';
import './DonationList.scss';

// מרחיב מקומית את הטיפוס כדי לשמור את המטבע לכל תרומה
type AggWithCurrency = AggregatedDonation & {
    currency?: number | null; // 1=ILS, 2=USD, undefined/null => ILS
};

const DonationList: FC = () => {
    const [dateOfBeggining, setDateOfBeggining] = useState<string>('');
    const [donations, setDonations] = useState<AggWithCurrency[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    // פורמטרים


    const ils = useMemo(
        () =>
            new Intl.NumberFormat('he-IL', {
                style: 'currency',
                currency: 'ILS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
        []
    );

    const usd = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
        []
    );

    // עוזר להצגת שם תורם
    const displayName = (d: Donation) =>
        (d.PublicName && d.PublicName.trim()) ||
        [d.FirstName, d.LastName].filter(Boolean).join(' ') ||
        '—';

    // עיצוב לפי מטבע התרומה (ברירת מחדל: ₪)
    const formatByCurrency = (amount: number, currency?: number | null) => {
        if (currency === 2) return usd.format(amount || 0);
        return ils.format(amount || 0);
    };

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);

                const [dateOfBegginingDate, rawData] = await Promise.all([
                    settingsService.getDonationsStart(),
                    getAllDonations(),
                ]);

                const dateStr =
                    dateOfBegginingDate instanceof Date
                        ? dateOfBegginingDate.toISOString().slice(0, 10)
                        : String(dateOfBegginingDate || '').slice(0, 10);

                const fromTimestamp = dateStr
                    ? new Date(`${dateStr}T00:00:00Z`).getTime()
                    : 0;

                const filtered = (rawData || []).filter((d: Donation) => {
                    const ts = d?.createdAt ? new Date(d.createdAt).getTime() : 0;
                    return Number.isFinite(ts) && ts >= fromTimestamp;
                });

                const aggregated: AggWithCurrency[] = filtered.map((item) => {
                    const name = displayName(item);
                    const monthly = Number(item.Amount ?? 0);
                    const monthsPaid = Number(item.Tashlumim ?? 1);
                    const pastTotal = monthly * monthsPaid;

                    // מטבע מה־DB: אם חסר/ריק → ILS (1)
                    const currency =
                        item.currency === undefined || item.currency === null
                            ? 1
                            : Number(item.currency) || 1;

                    return {
                        name,
                        pastTotal,
                        futureTotal: 0,
                        combinedTotal: pastTotal,
                        lizchut: (item.lizchut || '').toString().trim(),
                        comment: (item.Comments || '').toString().trim(),
                        currency,
                    };
                });

                if (!mounted) return;
                setDateOfBeggining(dateStr);
                setDonations(aggregated);
                setError(null);
            } catch (err) {
                console.error('שגיאה בטעינת תרומות או תאריך התחלה:', err);
                if (!mounted) return;
                setError('נכשלה טעינת התרומות או תאריך ההתחלה');
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const visibleDonations = useMemo(
        () => donations.slice(0, visibleCount),
        [donations, visibleCount]
    );

    const uniqueDonorsCount = useMemo(() => {
        const set = new Set(donations.map((d) => d.name));
        return set.size;
    }, [donations]);

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
                                {uniqueDonorsCount.toLocaleString('he-IL')} השותפים שלנו
                            </h2>
                        </div>

                        {visibleDonations.map((d, idx) => (
                            <div
                                className="donation-card"
                                key={`${d.name}-${d.combinedTotal}-${idx}`}
                            >
                                <div className="donation-card-content">
                                    <div className="donor-row">
                                        <span className="donor-name">{d.name}</span>
                                        <span className="donor-amount">
                                            {formatByCurrency(d.combinedTotal, (d as AggWithCurrency).currency)}
                                        </span>
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
                                onClick={() =>
                                    setVisibleCount((v) => Math.min(v + 4, donations.length))
                                }
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
